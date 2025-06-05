<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\Cour;
use App\Models\Formation;
use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $collabCount = Collaborator::count();
        $formationsCount = Formation::count();
        $coursCount = Cour::count();
        $specialitysCount = Speciality::count();

        return Inertia::render('dashboard', [
            'collabCount' => $collabCount,
            'specialitysCount' => $specialitysCount,
            'formationsCount' => $formationsCount,
            'coursCount' => $coursCount
        ]);
    }
}
