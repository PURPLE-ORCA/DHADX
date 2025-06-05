<?php

namespace App\Http\Controllers;

use App\Models\Cour;
use App\Http\Requests\StoreCourRequest;
use App\Http\Requests\UpdateCourRequest;
use App\Models\Formation;
use Inertia\Inertia;

class CourController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cours = Cour::with('formations')->orderBy('name', 'ASC')->get();

        return Inertia::render('application/Cours/Cours', [
            'cours' => $cours
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('application/Cours/Create', [
            'formations' => Formation::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourRequest $request)
    {
        $validatedData = $request->validated();

        Cour::create([
            'name' => $validatedData['name'],
            'label' => $validatedData['label'],
            'color' => $validatedData['color'],
        ]);

        return redirect()->route("cours.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Cour $cour)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cour $cour)
    {
        return Inertia::render('application/Cours/Edit', [
            'cour' => $cour,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourRequest $request, Cour $cour)
    {
        $validatedData = $request->validated();

        $cour->update([
            'name' => $validatedData['name'],
            'label' => $validatedData['label'],
            'color' => $validatedData['color'],
        ]);

        return redirect()->route("cours.index");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cour $cour)
    {
        $cour->delete();

        $cour->formations()->detach();

        return redirect()->route("cours.index");
    }
}
