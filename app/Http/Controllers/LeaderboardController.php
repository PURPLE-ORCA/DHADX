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
        $leaderboardEntries = Collaborator::select([
            'collaborators.*', // Select all columns from the collaborators table
            'c_levels.max_cour_level',
            // We'll also get the count of formations in that max level for a proper average
            // And then calculate average if count > 0
            DB::raw('CASE WHEN c_progress.formations_in_max_cour_count > 0
                          THEN ROUND(c_progress.total_progress_in_max_cour / c_progress.formations_in_max_cour_count)
                          ELSE 0
                     END as average_progress_in_max_cour')
        ])
        // Use crossJoin with DB::raw for LATERAL, as Laravel doesn't have a dedicated lateralJoin method
        ->crossJoin(DB::raw(
            'LATERAL (
                SELECT MAX(sub_cours.level) as max_cour_level
                FROM camps AS sub_camps
                INNER JOIN cours AS sub_cours ON sub_camps.cour_id = sub_cours.id
                WHERE sub_camps.collaborator_id = collaborators.id -- Correlates with the outer collaborators table
            ) AS c_levels'
        ))
        ->crossJoin(DB::raw(
            'LATERAL (
                SELECT
                    SUM(progress_camps.progress) as total_progress_in_max_cour,
                    COUNT(progress_camps.id) as formations_in_max_cour_count -- Count of formations
                FROM camps AS progress_camps
                INNER JOIN cours AS progress_cours ON progress_camps.cour_id = progress_cours.id
                WHERE progress_camps.collaborator_id = collaborators.id -- Correlates with collaborators
                  AND progress_cours.level = c_levels.max_cour_level -- Crucially uses the result from the first LATERAL
            ) AS c_progress'
        ))
        ->with(['camps.cour']) // Eager load if you still need it for other display purposes on the frontend
        ->orderByRaw('c_levels.max_cour_level DESC NULLS LAST, average_progress_in_max_cour DESC NULLS LAST')
        // Standard orderBy for the last one
        ->orderBy('collaborators.name', 'asc')
        ->take(10)
        ->get();

        return Inertia::render('application/Leaderboard/Index', [ // Ensure this path is correct
            'leaderboardEntries' => $leaderboardEntries,
        ]);
    }
}
