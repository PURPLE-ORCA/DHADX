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
        // Eager load the relationships right away
        $this->camp = $camp->load(['cour:id,name', 'formation:id,name']);
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
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        // Build a useful, descriptive message
        $message = 'You have been enrolled in the ' . $this->camp->cour->name 
                     . ' camp for the ' . $this->camp->formation->name . ' formation.';
            
        // The link for a collaborator should go to THEIR dashboard, not an admin page.
        $link = route('dashboard'); 

        return [
            'message' => $message,
            'link' => $link,
            'type' => 'camp_enrollment', // A simple, clean type string
        ];
    }
}
