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
use App\Http\Controllers\NotificationController; // Import NotificationController
use App\Http\Controllers\TaskController;
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

    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');

    Route::post('/tasks/{task}/start-progress', [TaskController::class, 'startProgress'])->name('tasks.startProgress');
    Route::post('/tasks/{task}/submit-for-review', [TaskController::class, 'submitForReview'])->name('tasks.submitForReview');
    Route::post('/tasks/{task}/approve-completion', [TaskController::class, 'approveCompletion'])->name('tasks.approveCompletion');
    Route::post('/tasks/{task}/request-revision', [TaskController::class, 'requestRevision'])->name('tasks.requestRevision');
    Route::post('/tasks/{task}/cancel', [TaskController::class, 'cancelTask'])->name('tasks.cancel');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'storeComment'])->name('tasks.storeComment');

    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
    Route::get('/my-tasks', [CollaboratorPortalController::class, 'myTasks'])->name('collaborator.tasks');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
