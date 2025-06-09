<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CollaboratorPortalController extends Controller
{
    public function myTasks(Request $request)
    {
        $user = Auth::user();

        $myTasks = Task::where('assignee_id', $user->id)
            ->with(['assignee', 'assigner', 'comments'])
            ->orderBy('due_date')
            ->get();

        return Inertia::render('application/Task/Index', [
            'tasks' => $myTasks, // Renaming 'myTasks' to 'tasks' to match common Inertia prop naming for index pages
        ]);
    }
}
