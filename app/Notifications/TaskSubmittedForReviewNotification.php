<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Task;

class TaskSubmittedForReviewNotification extends Notification
{
    use Queueable;

    protected $task;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Task "' . $this->task->title . '" has been submitted for review.',
            'link' => route('tasks.show', $this->task->id),
            'type' => 'task_submitted_for_review',
        ];
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => 'Task "' . $this->task->title . '" has been submitted for review.',
            'link' => route('tasks.show', $this->task->id),
            'type' => 'task_submitted_for_review',
        ];
    }
}
