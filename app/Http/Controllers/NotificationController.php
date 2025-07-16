<?php   

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth; // Import Auth facade

class NotificationController extends Controller
{
    public function pendingCount()
    {
        if (Auth::check()) {
            $count = Auth::user()->unreadNotifications()->count();
            return response()->json(['count' => $count]);
        }
        return response()->json(['count' => 0]); // Return 0 if not authenticated
    }

    public function latest()
    {
        if (Auth::check()) {
            $notifications = Auth::user()->notifications()
                ->latest()
                ->limit(5) // Adjust as needed
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->data['type'] ?? 'generic', // Use the simple type string we stored
                        'message' => $notification->data['message'] ?? 'No message',
                        'link' => $notification->data['link'] ?? '#',
                        'created_at' => $notification->created_at,
                    ];
                });
            return response()->json(['notifications' => $notifications]);
        }
        return response()->json(['notifications' => []]); // Return empty array if not authenticated
    }

    public function markRead(?DatabaseNotification $notification = null) // Explicitly declare as nullable
    {
        if (Auth::check()) {
            if ($notification) {
                $notification->markAsRead();
            } else {
                Auth::user()->unreadNotifications->markAsRead();
            }
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Not authenticated']);
    }

    public function unread()
    {
        if (Auth::check()) {
            $notifications = Auth::user()->unreadNotifications()
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->data['type'] ?? 'generic',
                        'message' => $notification->data['message'] ?? 'No message',
                        'link' => $notification->data['link'] ?? '#',
                        'created_at' => $notification->created_at,
                    ];
                });
            return response()->json(['notifications' => $notifications]);
        }
        return response()->json(['notifications' => []]);
    }
}
