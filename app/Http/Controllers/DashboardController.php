<?php

namespace App\Http\Controllers;

use App\Models\Camp;
use App\Models\Collaborator;
use App\Models\Cour;
use App\Models\Formation;
use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Seance;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $collabCount = Collaborator::count();
        $formationsCount = Formation::count();
        $coursCount = Cour::count();
        $specialitysCount = Speciality::count();

        $user = Auth::user()->load('roles'); // Eager load roles
        $taskSummaries = [];

        if ($user->hasRole('admin')) {
            // These are the missing pieces of the puzzle for the admin dashboard view
            $taskSummaries['pendingTasksCount'] = Task::where('status', 'pending')->count();
            $taskSummaries['overdueTasksCount'] = Task::where('status', 'overdue')->count();

            // You can also keep the other summaries if you plan to use them elsewhere, for example:
            $taskSummaries['submittedForReviewCount'] = Task::where('status', 'submitted')->count();
        } elseif ($user->hasRole('collaborator')) {
            $taskSummaries['pendingTasksCount'] = $user->assignedTasks()->where('status', 'pending')->count();
            $taskSummaries['overdueTasksCount'] = $user->assignedTasks()->where('status', 'overdue')->count();
        }

        $latestNotifications = $user->notifications()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'] ?? 'generic', // USE THE STORED SIMPLE TYPE
                    'message' => $notification->data['message'] ?? 'No message',
                    'link' => $notification->data['link'] ?? '#',
                    'created_at' => $notification->created_at,
                ];
            });
            $upcomingTasks = collect(); // Initialize as empty collection
            $personalProgress = [];

            $isAdmin = $user->hasRole('admin');
            $isCollaborator = $user->hasRole('collaborator');

            if ($isCollaborator) {
                $overdueTasks = $user->assignedTasks()
                    ->where('status', 'overdue')
                    ->orderBy('due_date', 'asc') // Oldest overdue tasks first
                    ->get();

                $imminentTasks = $user->assignedTasks()
                    ->whereNotIn('status', ['completed', 'cancelled', 'overdue'])
                    ->where('due_date', '>=', now()->startOfDay()) // From today onwards
                    ->where('due_date', '<=', now()->addDays(7))
                    ->orderBy('due_date', 'asc')
                    ->get();

                $urgentTasks = $overdueTasks->merge($imminentTasks)->unique('id');

                $upcomingSeance = null;
                $collaboratorProfile = $user->collaboratorProfile;

                if ($collaboratorProfile) {
                // First, try to find a seance that is currently live.
                $activeSeance = Seance::whereHas('attendees', fn($q) => $q->where('collaborator_id', $collaboratorProfile->id))
                    ->where('status', 'live')
                    ->with('course:id,name', 'mentor:id,name')
                    ->first();

                // If no seance is live, find the very next scheduled one.
                if (!$activeSeance) {
                    $activeSeance = Seance::whereHas('attendees', fn($q) => $q->where('collaborator_id', $collaboratorProfile->id))
                        ->where('status', 'scheduled')
                        ->where('scheduled_at', '>=', now())
                        ->orderBy('scheduled_at', 'asc')
                        ->with('course:id,name', 'mentor:id,name')
                        ->first();
                }
                }
            }

            $collaboratorActiveCamps = collect(); // Initialize as empty collection

            if ($isCollaborator) {
                // Fetch active camps for the collaborator
                $collaboratorActiveCamps = Camp::where('collaborator_id', $user->id)
                    ->with(['cour:id,name,label', 'formation:id,name']) // Select specific columns for efficiency, including 'label'
                    ->orderBy('cour_id')
                    ->orderByDesc('progress')
                    ->get();
            }

            return Inertia::render('dashboard', [
                'user' => $user, // Pass the user object with roles
                'collabCount' => $collabCount,
                'specialitysCount' => $specialitysCount,
                'formationsCount' => $formationsCount,
                'coursCount' => $coursCount,
                'taskSummaries' => $taskSummaries,
                'latestNotifications' => $latestNotifications, // Pass latest notifications
                'urgentTasks' => $urgentTasks ?? collect(), // Pass urgent tasks, initialize as empty if not set
                'collaboratorActiveCamps' => $collaboratorActiveCamps, // NEW PROP
                'activeSeance' => $activeSeance ?? null, // Use a new prop name for clarity
            ]);
    }
}
