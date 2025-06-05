<?php

use App\Http\Controllers\CampController;
use App\Http\Controllers\CourController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\SpecialityController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaderboardController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    Route::resource('collaborators', CollaboratorController::class);

    Route::resource('specialities', SpecialityController::class);

    Route::resource('formations', FormationController::class);

    Route::resource('cours', CourController::class);

    Route::resource('camps', CampController::class);
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
