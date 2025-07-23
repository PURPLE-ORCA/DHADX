import { UserPlus, FileCheck, Award } from 'lucide-react';
import { BellIcon } from 'lucide-react'; // Assuming BellIcon is also from lucide-react or a similar icon library

export const getNotificationDetails = (notification) => {
    let details = {
        icon: BellIcon, // A default icon
        title: 'New Notification',
        message: notification.message || 'You have a new notification.',
    };

    // The `type` is now 'camp_enrollment', 'task_assigned', etc.
    switch (notification.type) {
        case 'task_assigned':
            details.icon = UserPlus;
            details.title = 'New Task Assigned';
            break;
        case 'task_submitted_for_review':
            details.icon = FileCheck;
            details.title = 'Task Submitted';
            break;
        case 'camp_enrollment':
            details.icon = Award;
            details.title = 'Camp Enrollment';
            break;
    }
    // The message is already perfect from the backend, so we just use it.
    details.message = notification.message;
    return details;
};
