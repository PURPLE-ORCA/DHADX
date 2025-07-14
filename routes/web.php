<?php

use App\Http\Controllers\CampController;
use App\Http\Controllers\CourController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\SpecialityController;
use App\Http\Controllers\CollaboratorPortalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WhiteboardController;
use App\Http\Controllers\SeanceController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Notification Routes
    Route::get('/notifications/pending-count', [NotificationController::class, 'pendingCount'])->name('notifications.pendingCount');
    Route::get('/notifications/latest', [NotificationController::class, 'latest'])->name('notifications.latest');
    Route::post('/notifications/mark-read/{notification?}', [NotificationController::class, 'markRead'])->name('notifications.markRead');

    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    
    Route::middleware('can:is_admin')->group(function () {
        Route::resource('camps', CampController::class);
        Route::resource('collaborators', CollaboratorController::class);
        Route::resource('specialities', SpecialityController::class);
        Route::resource('formations', FormationController::class);
        Route::resource('cours', CourController::class);
        Route::resource('tasks', TaskController::class)->except(['index', 'show']);
    });

    // SEANCE MANAGEMENT (for Mentors/Admins)
    Route::middleware('can:is_admin')->group(function () {
        Route::get('/seances', [SeanceController::class, 'index'])->name('seances.index'); // List all seances
        Route::get('/seances/create', [SeanceController::class, 'create'])->name('seances.create'); // Show create form
        Route::post('/seances', [SeanceController::class, 'store'])->name('seances.store'); // Save new seance
        Route::get('/seances/{seance}/edit', [SeanceController::class, 'edit'])->name('seances.edit'); // Show edit form
        Route::put('/seances/{seance}', [SeanceController::class, 'update'])->name('seances.update'); // Update seance
        Route::delete('/seances/{seance}', [SeanceController::class, 'destroy'])->name('seances.destroy');

    // Add these alongside your other seance action routes
    Route::post('/seances/{seance}/start', [SeanceController::class, 'startSeance'])
        ->middleware('can:update,seance') // Reuse the update policy or create a new one
        ->name('seances.start');

    Route::post('/seances/{seance}/finish', [SeanceController::class, 'finishSeance'])
        ->middleware('can:update,seance')
        ->name('seances.finish');
        
    Route::post('/seances/{seance}/cancel', [SeanceController::class, 'cancelSeance'])
        ->middleware('can:update,seance')
        ->name('seances.cancel');
    });

    // Mentor-specific presence check initiation
    Route::post('/seances/{seance}/presence/start', [SeanceController::class, 'startPresenceCheck'])
        ->middleware('can:startPresenceCheck,seance') // <-- USE THE POLICY
        ->name('seances.presence.start');

    // Exercise Management within a Seance
    Route::post('/seances/{seance}/exercises', [SeanceController::class, 'storeExercise'])
        ->name('seances.exercises.store');

    // LIVE SEANCE VIEW (for Mentors and Collaborators)
    Route::get('/seances/{seance}', [SeanceController::class, 'show'])->name('seances.show');

    // Presence Check Routes
    Route::post('/seances/{seance}/check-in', [SeanceController::class, 'recordCheckIn'])->name('seances.presence.checkin');

    // EXERCISE SUBMISSION (for Collaborators)
    Route::post('/seance-exercises/{exercise}/submissions', [SeanceController::class, 'storeSubmission'])->name('exercises.submissions.store');

    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');

    Route::post('/tasks/{task}/start-progress', [TaskController::class, 'startProgress'])->name('tasks.startProgress');
    Route::post('/tasks/{task}/submit-for-review', [TaskController::class, 'submitForReview'])->name('tasks.submitForReview');
    Route::post('/tasks/{task}/approve-completion', [TaskController::class, 'approveCompletion'])->name('tasks.approveCompletion');
    Route::post('/tasks/{task}/request-revision', [TaskController::class, 'requestRevision'])->name('tasks.requestRevision');
    Route::post('/tasks/{task}/cancel', [TaskController::class, 'cancelTask'])->name('tasks.cancelTask');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'storeComment'])->name('tasks.storeComment');

    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
    Route::get('/my-tasks', [CollaboratorPortalController::class, 'myTasks'])->name('collaborator.tasks');

    // Whiteboard Routes
    Route::get('/whiteboards', [WhiteboardController::class, 'index'])->name('whiteboards.index');
    Route::post('/whiteboards', [WhiteboardController::class, 'store'])->name('whiteboards.store');
    Route::get('/whiteboards/{whiteboard}', [WhiteboardController::class, 'show'])->name('whiteboards.show');
    Route::put('/whiteboards/{whiteboard}', [WhiteboardController::class, 'update'])->name('whiteboards.update');
    Route::patch('/whiteboards/{whiteboard}/toggle-public', [WhiteboardController::class, 'togglePublic'])->name('whiteboards.togglePublic');
    Route::delete('/whiteboards/{whiteboard}', [WhiteboardController::class, 'destroy'])->name('whiteboards.destroy');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
