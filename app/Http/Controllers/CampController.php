<?php

namespace App\Http\Controllers;

use App\Models\Camp;
use App\Models\Collaborator;
use App\Models\Cour;
use App\Models\User; // Import User model
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\CollaboratorEnrolledInCampNotification; // Import Notification class

class CampController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $camps = Camp::with(['collaborator', 'cour', 'formation'])->get();

        return Inertia::render('application/Camp/Camps', [
            'camps' => $camps
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('application/Camp/Create', [
            'collaborators' => Collaborator::all(),
            'cours' => Cour::with('formations')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'collaborator_id' => 'required|exists:collaborators,id',
            'cour_id' => 'required|exists:cours,id',
        ]);

        $cour = Cour::with('formations')->findOrFail($request->cour_id);

        foreach ($cour->formations as $formation) {
            $camp = Camp::updateOrCreate([ // Assign the created/updated camp to $camp
                'collaborator_id' => $request->collaborator_id,
                'cour_id' => $cour->id,
                'formation_id' => $formation->id,
            ], [
                'progress' => 0,
            ]);

            // Send notification to the enrolled collaborator
            $collaborator = Collaborator::find($request->collaborator_id);
            if ($collaborator && $collaborator->user) {
                $collaborator->user->notify(new CollaboratorEnrolledInCampNotification($camp));
            }
        }

        return redirect()->route('camps.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Camp $camp)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Camp $camp)
    {
        return Inertia::render('application/Camp/Edit', [
            'camp' => $camp->load(['collaborator', 'cour', 'formation'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Camp $camp)
    {
        $request->validate([
            'progress' => 'required|integer|min:0|max:100'
        ]);

        $camp->progress = $request->progress;
        $camp->save();

        return redirect()->route('camps.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Camp $camp)
    {
        $camp->delete();

        return redirect()->route('camps.index');
    }
}
