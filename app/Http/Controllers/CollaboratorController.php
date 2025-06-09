<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Http\Requests\StoreCollaboratorRequest;
use App\Http\Requests\UpdateCollaboratorRequest;
use App\Models\Speciality;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CollaboratorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('application/Collaborator/Collaborators', [
            'collaborators' => Collaborator::with('specialities')->get(),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('application/Collaborator/Create', [
            'specialities' => Speciality::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollaboratorRequest $request) // Use Form Request
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // 1. Create User
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(Str::random(16)), // Temp password
            ]);

            // 2. Assign "collaborator" Role
            $collaboratorRole = Role::where('name', 'collaborator')->firstOrFail();
            $user->roles()->attach($collaboratorRole->id);

            // 3. Create Collaborator Profile, linking to the User
            $collaborator = Collaborator::create([
                'name' => $validated['name'], // Name on collaborator profile
                'email' => $user->email,      // User's email
                'user_id' => $user->id,       // Link to the user
            ]);

            // 4. Sync Specialities
            $collaborator->specialities()->sync($validated['speciality_ids'] ?? []);

            // 5. Send Activation/Password Setup Email
            app('auth.password.broker')->sendResetLink(['email' => $user->email]);

            return redirect()->route("collaborators.index")
                ->with('success', 'Collaborator account created and activation email sent!');
        });
    }


    /**
     * Display the specified resource.
     */
    public function show(Collaborator $collaborator)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Collaborator $collaborator)
    {
        $collaborator->load('specialities'); // <- Properly loads the relation

        return Inertia::render('application/Collaborator/Edit', [
            'specialities' => Speciality::all(),
            'collaborator' => $collaborator,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollaboratorRequest $request, Collaborator $collaborator)
    {
        $validated = $request->validated();

        $collaborator->update([
            'name' => $validated['name'],
        ]);

        $collaborator->specialities()->sync($validated['speciality_ids'] ?? []);

        return redirect()->route("collaborators.index");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collaborator $collaborator)
    {
        $collaborator->delete();

        $collaborator->specialities()->detach();
        return redirect()->route("collaborators.index");
    }
}
