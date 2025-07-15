<?php
namespace App\Http\Controllers;

use App\Models\Cour;
use App\Models\Seance;
use App\Models\SeanceExercise;
use App\Models\ExerciseSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Events\PresenceCheckStarted; 
use App\Models\Camp;
use App\Events\CollaboratorCheckedIn; // <-- Add this import at the top
use App\Events\ExerciseSubmitted;
use App\Events\SeanceStatusUpdated; // We will create this event next
use App\Events\AttendanceStateReset; // New event for resetting attendance

class SeanceController extends Controller
{
    // --- Admin/Mentor Views ---

    public function index() {
        $seances = Seance::with('course', 'mentor')->latest()->paginate(10);
        return Inertia::render('application/Seance/Index', ['seances' => $seances]);
    }

    public function create() {
        // We need lists of courses and mentors to populate dropdowns in the form
        $courses = Cour::select('id', 'name')->get();
        $mentors = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->select('id', 'name')->get(); // Assuming mentors are admins
        return Inertia::render('application/Seance/Create', [
            'courses' => $courses,
            'mentors' => $mentors,
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'course_id' => 'required|exists:cours,id',
            'mentor_id' => 'required|exists:users,id',
            'topic' => 'required|string|max:255',
            'agenda' => 'nullable|string',
            'meeting_link' => 'nullable|url',
            'scheduled_at' => 'required|date|after:now',
        ]);
        $seance = Seance::create($validated);

        // **CRITICAL LOGIC:** Automatically enroll all collaborators from the course's camps
        $collaboratorIds = Camp::where('cour_id', $seance->course_id)->pluck('collaborator_id')->unique();
        $seance->attendees()->sync($collaboratorIds); // This creates the initial attendance records

        return redirect()->route('seances.index')->with('message', 'Seance created successfully.');
    }

    public function edit(Seance $seance) {
        $courses = Cour::select('id', 'name')->get();
        $mentors = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->select('id', 'name')->get();
        return Inertia::render('application/Seance/Edit', [
            'seance' => $seance,
            'courses' => $courses,
            'mentors' => $mentors,
        ]);
    }

    public function update(Request $request, Seance $seance) {
        $validated = $request->validate([
            'course_id' => 'required|exists:cours,id',
            'mentor_id' => 'required|exists:users,id',
            'topic' => 'required|string|max:255',
            'agenda' => 'nullable|string',
            'meeting_link' => 'nullable|url',
            'scheduled_at' => 'required|date|after:now',
        ]);
        $seance->update($validated);

        // Re-sync attendees if course changed or for any reason
        $collaboratorIds = Camp::where('cour_id', $seance->course_id)->pluck('collaborator_id')->unique();
        $seance->attendees()->sync($collaboratorIds);

        return redirect()->route('seances.index')->with('message', 'Seance updated successfully.');
    }

    public function destroy(Seance $seance) {
        $seance->delete();
        return redirect()->route('seances.index')->with('message', 'Seance deleted successfully.');
    }

    public function startSeance(Seance $seance) {
        $seance->update([
            'status' => 'live',
            'started_at' => now(),
        ]);
        // Load the relationships before broadcasting
        $seance->load('course:id,name', 'mentor:id,name');
        broadcast(new SeanceStatusUpdated($seance)); // Announce the change
        return back();
    }

    public function finishSeance(Seance $seance) {
        $seance->update([
            'status' => 'finished',
            'finished_at' => now(),
        ]);
        // Load the relationships before broadcasting
        $seance->load('course:id,name', 'mentor:id,name');
        broadcast(new SeanceStatusUpdated($seance));
        return back();
    }

    public function cancelSeance(Seance $seance) {
        $seance->update(['status' => 'cancelled']);
        // Load the relationships before broadcasting
        $seance->load('course:id,name', 'mentor:id,name');
        broadcast(new SeanceStatusUpdated($seance));
        return back();
    }

    public function startPresenceCheck(Seance $seance)
    {
        // Authorization is handled by the policy, so we're good here.

        // --- THE NEW LOGIC: RESETTING THE BOARD ---
        // First, find all attendance records for this seance and reset their status.
        // We'll do this with a direct DB update for efficiency.
        DB::table('seance_attendances')
            ->where('seance_id', $seance->id)
            ->update(['status' => 'absent', 'checked_in_at' => null]);
        // ------------------------------------------

        // Now, broadcast the event as before to trigger the check-in button.
        broadcast(new PresenceCheckStarted($seance->id));
        
        // We should also broadcast a "state reset" event to the mentor's UI.
        // Re-fetch the attendees with all their data
        $freshAttendeesCollection = $seance->attendees()->with('user:id,name')->get();

        // --- THE FINAL, FINAL, FINAL FIX ---
        // Convert the Eloquent Collection into a plain PHP array.
        $freshAttendeesArray = $freshAttendeesCollection->map(function ($attendee) {
            return [
                'id' => $attendee->id,
                'user' => [
                    'id' => $attendee->user->id,
                    'name' => $attendee->user->name,
                ],
                'pivot' => [
                    'seance_id' => $attendee->pivot->seance_id,
                    'collaborator_id' => $attendee->pivot->collaborator_id,
                    'status' => $attendee->pivot->status, // This will be 'absent'
                ],
                // You can add profile_photo_url here if you need it
                'profile_photo_url' => $attendee->profile_photo_url, 
            ];
        })->toArray();
        // ------------------------------------

        // Broadcast the plain array, not the Eloquent Collection
        broadcast(new AttendanceStateReset($seance->id, $freshAttendeesArray));

        return response()->json(['message' => 'New presence check initiated.']);
    }

    public function recordCheckIn(Seance $seance)
    {
        $collaborator = Auth::user()->collaboratorProfile;
        if (!$collaborator) {
            return response()->json(['error' => 'User is not a collaborator.'], 403);
        }

        // Find the attendance record and update it
        $attendance = $seance->attendees()->where('collaborator_id', $collaborator->id)->first();
        
        if ($attendance) {
            // This uses the pivot accessor to update the pivot table data
            $attendance->pivot->status = 'present';
            $attendance->pivot->checked_in_at = now();
            $attendance->pivot->save();

            // --- THE NEW LOGIC ---
            // Load the user relationship so the name is available on the frontend
            $collaborator->load('user:id,name'); 
            broadcast(new CollaboratorCheckedIn($seance->id, $collaborator));
            // --------------------

            return response()->json(['message' => 'Checked in successfully.']);
        }

        return response()->json(['error' => 'Attendance record not found.'], 404);
    }

    // --- Live Seance View (The Main Event) ---

    public function show(Seance $seance) {
        $user = Auth::user();
        $isMentor = $seance->mentor_id === $user->id;

        // Eager load everything needed for the view
        $seance->load([
            'course:id,name',
            'mentor:id,name',
            'exercises.submissions.collaborator.user:id,name',
            'attendees.user:id,name' // Load the user for each collaborator in the attendance list
        ]);
        
        $mySubmission = null;
        if (!$isMentor) {
            // Find if the current user has submitted work for any exercise in this seance
            // Simplified for now, can be optimized
        }

        return Inertia::render('application/Seance/Show', [
            'seance' => $seance,
            'isMentor' => $isMentor,
            'current_user_id' => $user->id, // Pass current user ID for frontend logic
        ]);
    }

    // --- Action Methods ---

    public function storeExercise(Request $request, Seance $seance) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $seance->exercises()->create($validated);
        return back()->with('message', 'Exercise added.');
    }

    public function storeSubmission(Request $request, SeanceExercise $exercise) {
        $validated = $request->validate([
            'text_content' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if (empty($validated['text_content']) && empty($validated['file'])) {
            return back()->withErrors(['submission' => 'Either text content or a file must be provided.']);
        }

        $collaborator = Auth::user()->collaboratorProfile;
        if (!$collaborator) {
            abort(403, 'User is not a collaborator.');
        }

        $submissionData = [
            'collaborator_id' => $collaborator->id,
        ];

        if (isset($validated['file'])) {
            $path = $request->file('file')->store('submissions', 'public');
            $submissionData['submission_type'] = 'file';
            $submissionData['content'] = $path;
        } elseif (isset($validated['text_content'])) {
            $submissionData['submission_type'] = 'text';
            $submissionData['content'] = $validated['text_content'];
        }

        $submission = $exercise->submissions()->create($submissionData);

        // --- THE REVISED, SECURE LOGIC ---
        $submission->load('collaborator.user:id,name');
        
        // Find the mentor's ID from the exercise's parent seance
        $mentorId = $exercise->seance->mentor_id;

        // Dispatch the event with the submission AND the mentor's ID
        broadcast(new ExerciseSubmitted($submission, $mentorId));
        // ------------------------------------

        return back()->with('message', 'Submission successful!');
    }
}
