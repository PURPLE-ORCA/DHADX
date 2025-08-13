<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Gate; // Ensure Gate is imported
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->loadMissing('roles') : null,
                'abilities' => $request->user() ? $this->getGateAbilities($request->user()) : [],
            ],
            'flash' => [ 
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }

    private function getGateAbilities($user): array // $user is already an instance of User model
    {
        // Define the abilities you want to check and share
        $abilities = [
            'isAdmin' => Gate::forUser($user)->allows('is_admin'),
            'isStudent' => Gate::forUser($user)->allows('is_student'),
            'canViewTask' => Gate::forUser($user)->allows('view_task'),
            'canCreateTask' => Gate::forUser($user)->allows('create_task'),
            'canEditTask' => Gate::forUser($user)->allows('edit_task'),
            'canDeleteTask' => Gate::forUser($user)->allows('delete_task'),
            'canUpdateTaskStatusCollaborator' => Gate::forUser($user)->allows('update_task_status_collaborator'),
            'canReviewTaskSubmission' => Gate::forUser($user)->allows('review_task_submission'),
            'canAddCommentToTask' => Gate::forUser($user)->allows('add_task_comment'),
            // 'canCreateCollaborators' => Gate::forUser($user)->allows('create_collaborator_entity'),
        ];

        return $abilities;
    }
}
