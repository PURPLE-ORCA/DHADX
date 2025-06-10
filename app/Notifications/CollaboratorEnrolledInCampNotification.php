<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Camp; // Import the Camp model

class CollaboratorEnrolledInCampNotification extends Notification
{
    use Queueable;

    protected $camp;

    /**
     * Create a new notification instance.
     */
    public function __construct(Camp $camp)
    {
        $this->camp = $camp;
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
            'message' => 'You have been enrolled in the camp: "' . $this->camp->name . '".',
            'link' => route('camps.show', $this->camp->id),
            'type' => 'camp_enrolled',
        ];
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => 'You have been enrolled in the camp: "' . $this->camp->name . '".',
            'link' => route('camps.show', $this->camp->id),
            'type' => 'camp_enrolled',
        ];
    }
}
