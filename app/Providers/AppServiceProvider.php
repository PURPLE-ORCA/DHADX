<?php

namespace App\Providers;

use App\Models\User; // Import User model
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('is_admin', function (User $user) { // Type hint User
            return $user->hasRole('admin');
        });

        Gate::define('is_student', function (User $user) {
            return $user->hasRole('student');
        });
    }
}
