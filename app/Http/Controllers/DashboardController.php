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

        $taskSummaries = [];
        if (Auth::user()->hasRole('admin')) {
            $taskSummaries['submittedForReviewCount'] = Task::where('status', 'submitted')->count();
            $taskSummaries['globalOverdueCount'] = Task::where('status', 'overdue')->count();
        } elseif (Auth::user()->hasRole('collaborator')) {
            $taskSummaries['pendingTasksCount'] = Auth::user()->assignedTasks()->where('status', 'pending')->count();
            $taskSummaries['overdueTasksCount'] = Auth::user()->assignedTasks()->where('status', 'overdue')->count();
        }

        return Inertia::render('dashboard', [
            'collabCount' => $collabCount,
            'specialitysCount' => $specialitysCount,
            'formationsCount' => $formationsCount,
            'coursCount' => $coursCount,
            'taskSummaries' => $taskSummaries,
        ]);
    }
}
