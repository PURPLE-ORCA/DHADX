<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        // Subquery for max_cour_level
        $maxLevelSubquery = \App\Models\Cour::selectRaw('MAX(cours.level)')
            ->join('camps', 'camps.cour_id', '=', 'cours.id')
            ->whereColumn('camps.collaborator_id', 'collaborators.id');

        // Subquery for average_progress_in_max_cour
        $avgProgressSubquery = \App\Models\Camp::selectRaw('CASE WHEN COUNT(camps.id) > 0 THEN ROUND(SUM(camps.progress) / COUNT(camps.id)) ELSE 0 END')
            ->join('cours', 'camps.cour_id', '=', 'cours.id')
            ->whereColumn('camps.collaborator_id', 'collaborators.id')
            ->where('cours.level', $maxLevelSubquery);

        $leaderboardEntries = Collaborator::select('collaborators.*')
            ->addSelect(['max_cour_level' => $maxLevelSubquery])
            ->addSelect(['average_progress_in_max_cour' => $avgProgressSubquery])
            ->orderByRaw('max_cour_level DESC NULLS LAST, average_progress_in_max_cour DESC NULLS LAST')
            ->orderBy('collaborators.name', 'asc')
            ->take(10)
            ->get();

        return Inertia::render('application/Leaderboard/Index', [ // Ensure this path is correct
            'leaderboardEntries' => $leaderboardEntries,
        ]);
    }
}
