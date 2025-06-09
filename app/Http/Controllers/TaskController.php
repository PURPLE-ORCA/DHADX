<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = [];
        if (Auth::user()->hasRole('admin')) {
            $tasks = Task::with(['assignee', 'assigner']);
            // Add filters if needed
            if ($request->has('assignee_id')) {
                $tasks->where('assignee_id', $request->assignee_id);
            }
            if ($request->has('status')) {
                $tasks->where('status', $request->status);
            }
            $tasks = $tasks->get();
        } elseif (Auth::user()->hasRole('collaborator')) {
            $tasks = Auth::user()->assignedTasks()->with('assigner')->get();
        }

        return Inertia::render('application/Task/Index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $collaborators = User::whereHas('roles', function ($query) {
            $query->where('name', 'collaborator');
        })->get();

        return Inertia::render('application/Task/Create', [
            'collaborators' => $collaborators,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'assignee_id' => $validated['assignee_id'],
            'assigner_id' => Auth::id(),
            'due_date' => $validated['due_date'],
            'status' => 'pending',
            'priority' => $validated['priority'],
        ]);

        // TODO: Send notification to assignee.

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $task->load(['assignee', 'assigner', 'comments.user']);

        return Inertia::render('application/Task/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $collaborators = User::whereHas('roles', function ($query) {
            $query->where('name', 'collaborator');
        })->get();

        return Inertia::render('application/Task/Edit', [
            'task' => $task,
            'collaborators' => $collaborators,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $validated = $request->validated();

        $task->update($validated);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    public function startProgress(Task $task)
    {
        // Authorization will be handled by Gate later
        $task->update(['status' => 'in_progress']);
        return redirect()->back()->with('success', 'Task status updated to In Progress.');
    }

    public function submitForReview(Task $task, Request $request)
    {
        // Authorization will be handled by Gate later
        $task->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        if ($request->filled('comment')) {
            $task->comments()->create([
                'user_id' => Auth::id(),
                'comment' => $request->input('comment'),
            ]);
        }
        return redirect()->back()->with('success', 'Task submitted for review.');
    }

    public function approveCompletion(Task $task, Request $request)
    {
        // Authorization will be handled by Gate later
        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        if ($request->filled('comment')) {
            $task->comments()->create([
                'user_id' => Auth::id(),
                'comment' => $request->input('comment'),
            ]);
        }
        return redirect()->back()->with('success', 'Task approved and marked as completed.');
    }

    public function requestRevision(Task $task, Request $request)
    {
        // Authorization will be handled by Gate later
        $request->validate(['comment' => ['required', 'string']]);

        $task->update(['status' => 'needs_revision']);
        $task->comments()->create([
            'user_id' => Auth::id(),
            'comment' => $request->input('comment'),
        ]);
        return redirect()->back()->with('success', 'Revision requested for the task.');
    }

    public function cancelTask(Task $task)
    {
        // Authorization will be handled by Gate later
        $task->update(['status' => 'cancelled']);
        return redirect()->back()->with('success', 'Task cancelled.');
    }

    public function storeComment(Request $request, Task $task)
    {
        // Authorization will be handled by Gate later
        $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $task->comments()->create([
            'user_id' => Auth::id(),
            'comment' => $request->input('comment'),
        ]);

        return redirect()->back()->with('success', 'Comment added successfully.');
    }
}
