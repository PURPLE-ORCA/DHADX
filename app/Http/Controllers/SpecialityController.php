<?php

namespace App\Http\Controllers;

use App\Models\Speciality;
use App\Http\Requests\StoreSpecialityRequest;
use App\Http\Requests\UpdateSpecialityRequest;
use Inertia\Inertia;

class SpecialityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $specialities = Speciality::orderBy('name', 'ASC')->get();

        return Inertia::render('application/Speciality/Specialities', [
            'specialities' => $specialities
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('application/Speciality/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSpecialityRequest $request)
    {
        $validatedData = $request->validated();

        Speciality::create([
            'name' => $validatedData['name'],
        ]);

        return redirect()->route("specialities.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Speciality $speciality)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Speciality $speciality)
    {
        return Inertia::render('application/Speciality/Edit', [
            'speciality' => $speciality,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSpecialityRequest $request, Speciality $speciality)
    {
        $speciality->update([
            'name' => $request->input('name'),
        ]);

        return redirect()->route("specialities.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Speciality $speciality)
    {
        $speciality->delete();
        $speciality->collaborators()->detach();
        return redirect()->route("specialities.index");
    }
}
