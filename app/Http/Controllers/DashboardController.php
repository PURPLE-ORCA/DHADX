<?php

namespace App\Http\Controllers;

use App\Models\Camp; // Add Camp model
use App\Models\Collaborator;
use App\Models\Cour;
use App\Models\Formation;
use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
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

        $latestNotifications = $user->notifications()->latest()->take(5)->get();
            $upcomingTasks = collect(); // Initialize as empty collection
            $personalProgress = [];

            $isAdmin = $user->hasRole('admin');
            $isCollaborator = $user->hasRole('collaborator');

            if ($isCollaborator) {
                $upcomingTasks = $user->assignedTasks()
                    ->where('status', '!=', 'completed') // Exclude completed tasks
                    ->where('due_date', '>=', now())
                    ->where('due_date', '<=', now()->addDays(7))
                    ->orderBy('due_date', 'asc')
                    ->take(5) // Limit to 5 upcoming tasks
                    ->get();
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
                'upcomingTasks' => $upcomingTasks, // Pass upcoming tasks
                'collaboratorActiveCamps' => $collaboratorActiveCamps, // NEW PROP
            ]);
    }
}
