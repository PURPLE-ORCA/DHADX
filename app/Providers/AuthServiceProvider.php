<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Task;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('view_task', function (User $user, Task $task) {
            return $user->id === $task->assignee_id ||
                   $user->id === $task->assigner_id ||
                   $user->hasRole('admin');
        });

        Gate::define('create_task', function (User $user) {
            return $user->hasRole('admin');
        });

        Gate::define('edit_task', function (User $user, Task $task) {
            return $user->id === $task->assigner_id ||
                   $user->hasRole('admin');
        });

        Gate::define('delete_task', function (User $user, Task $task) {
            return $user->id === $task->assigner_id ||
                   $user->hasRole('admin');
        });

        Gate::define('update_task_status_collaborator', function (User $user, Task $task) {
            return $user->id === $task->assignee_id;
        });

        Gate::define('review_task_submission', function (User $user, Task $task) {
            return $user->id === $task->assigner_id ||
                   $user->hasRole('admin');
        });

        Gate::define('add_task_comment', function (User $user, Task $task) {
            return $user->id === $task->assignee_id ||
                   $user->id === $task->assigner_id ||
                   $user->hasRole('admin');
        });
    }
}
