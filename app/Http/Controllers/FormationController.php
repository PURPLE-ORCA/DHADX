<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Http\Requests\StoreFormationRequest;
use App\Http\Requests\UpdateFormationRequest;
use App\Models\Cour;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class FormationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('application/Formation/Formations', [
            'formations' => Formation::with('cours')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('application/Formation/Create', [
            'cours' => Cour::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormationRequest $request)
    {
        $validated = $request->validated();

        $formation = Formation::create([
            'name' => $validated['name'],
            'icon_name' => $validated['icon_name'] ?? null,
        ]);

        $formation->cours()->sync($validated['cour_ids'] ?? []);

        return redirect()->route("formations.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation)
    {
        $formation->load('cours'); // <- Properly loads the relation

        return Inertia::render('application/Formation/Edit', [
            'cours' => Cour::all(),
            'formation' => $formation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormationRequest $request, Formation $formation)
    {
        $validated = $request->validated();

        // Manually apply unique validation for name, ignoring the current formation
        Validator::make($validated, [
            'name' => [
                'required',
                \Illuminate\Validation\Rule::unique('formations')->ignore($formation->id),
            ],
        ])->validate();

        $formation->update([
            'name' => $validated['name'],
            'icon_name' => $validated['icon_name'] ?? null,
        ]);

        $formation->cours()->sync($validated['cour_ids'] ?? []);

        return redirect()->route("formations.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation)
    {
        $formation->delete();

        $formation->cours()->detach();

        return redirect()->route("formations.index");
    }
}
