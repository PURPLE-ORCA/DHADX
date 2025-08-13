<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;

class UserPortalController extends Controller
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
    public function create()
    {
        $specialities = \App\Models\Speciality::all();
        return \Inertia\Inertia::render('application/User/Create', [
            'specialities' => $specialities,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'birth_date' => 'nullable|date',
            'cin' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'nullable|string|max:255',
            'speciality_ids' => 'nullable|array',
            'speciality_ids.*' => 'exists:specialities,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('password'), // Set a default password
            'birth_date' => $request->birth_date,
            'cin' => $request->cin,
            'gender' => $request->gender,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $user->image = $path;
            $user->save();
        }

        $user->roles()->attach(\App\Models\Role::where('name', 'collaborator')->first());

        if ($request->speciality_ids) {
            $user->specialities()->attach($request->speciality_ids);
        }

        return Redirect::route('users.index');
    }

    public function index()
    {
        $users = User::whereHas('roles', function ($query) {
            $query->where('name', '!=', 'admin');
        })->with('specialities')->get();

        return Inertia::render('application/User/Users', [
            'users' => $users,
        ]);
    }
public function edit(User $user)
    {
        $user->load('specialities');
        $specialities = \App\Models\Speciality::all();

        return Inertia::render('application/User/Edit', [
            'user' => $user,
            'specialities' => $specialities,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'birth_date' => 'nullable|date',
            'cin' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'nullable|string|max:255',
            'speciality_ids' => 'nullable|array',
            'speciality_ids.*' => 'exists:specialities,id',
        ]);

        $user->update($request->except('image', 'speciality_ids'));

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $user->image = $path;
            $user->save();
        }

        if ($request->speciality_ids) {
            $user->specialities()->sync($request->speciality_ids);
        } else {
            $user->specialities()->detach();
        }

        return Redirect::route('users.index');
    }
    public function destroy(User $user)
    {
        $user->specialities()->detach();
        $user->delete();

        return Redirect::route('users.index');
    }
}
