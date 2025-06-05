<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Http\Requests\StoreCollaboratorRequest;
use App\Http\Requests\UpdateCollaboratorRequest;
use App\Models\Speciality;
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
    public function store(StoreCollaboratorRequest $request)
    {
        $validated = $request->validated();

        $collaborator = Collaborator::create([
            'name' => $validated['name'],
        ]);

        $collaborator->specialities()->sync($validated['speciality_ids'] ?? []);

        return redirect()->route("collaborators.index");
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
