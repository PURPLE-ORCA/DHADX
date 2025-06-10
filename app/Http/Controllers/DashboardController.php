<?php

namespace App\Http\Controllers;

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
            $taskSummaries['submittedForReviewCount'] = Task::where('status', 'submitted')->count();
            $taskSummaries['globalOverdueCount'] = Task::where('status', 'overdue')->count();
        } elseif ($user->hasRole('collaborator')) {
            $taskSummaries['pendingTasksCount'] = $user->assignedTasks()->where('status', 'pending')->count();
            $taskSummaries['overdueTasksCount'] = $user->assignedTasks()->where('status', 'overdue')->count();
        }

        $latestNotifications = $user->notifications()->latest()->take(5)->get();
        $upcomingTasks = collect(); // Initialize as empty collection
        $personalProgress = [];

        if ($user->hasRole('collaborator')) {
            $upcomingTasks = $user->assignedTasks()
                ->where('status', '!=', 'completed') // Exclude completed tasks
                ->where('due_date', '>=', now())
                ->where('due_date', '<=', now()->addDays(7))
                ->orderBy('due_date', 'asc')
                ->take(5) // Limit to 5 upcoming tasks
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
        ]);
    }
}
