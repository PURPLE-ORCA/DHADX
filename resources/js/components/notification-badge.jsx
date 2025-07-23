import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { BellIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getNotificationDetails } from '@/lib/notification-helper';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { Badge } from './ui/badge';
import { toast } from 'sonner'; // Import toast from sonner

export default function NotificationBadge() {
    const { translations } = useContext(TranslationContext);
    const [pendingCount, setPendingCount] = useState(0);
    const [latestNotifications, setLatestNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const countResponse = await axios.get(route('notifications.pendingCount'));
            setPendingCount(countResponse.data.count);

            const latestResponse = await axios.get(route('notifications.unread'));
            setLatestNotifications(latestResponse.data.notifications);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchNotifications(); // Initial fetch
        const interval = setInterval(fetchNotifications, 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const markAsRead = async (notificationId = null) => {
        try {
            const url = notificationId
                ? route('notifications.markRead', notificationId)
                : route('notifications.markRead');
            await axios.post(url);
            toast.success(translations.notifications.mark_as_read_success_toast); // Use sonner's toast.success
            fetchNotifications(); // Refresh counts and list
        } catch (error) {
            toast.error(translations.notifications.mark_as_read_error_toast); // Use sonner's toast.error
        }
    };

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                    <BellIcon className="h-14 w-14 text-[var(--brand-color)]" />
                    {pendingCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0">{pendingCount}</Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{translations.notifications.dropdown_label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {latestNotifications.length > 0 ? (
                    <>
                        {latestNotifications.map((notification) => {
                            const details = getNotificationDetails(notification);
                            const Icon = details.icon;

                            return (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start space-y-1">
                                    <Link href={notification.link || '#'} onClick={() => markAsRead(notification.id)} className="w-full">
                                        <div className="flex items-start gap-3">
                                            <Icon className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm leading-none font-medium">{details.title}</p>
                                                <p className="text-muted-foreground mt-1 text-sm">{details.message}</p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center">
                            <Button variant="link" onClick={() => markAsRead()}>
                                {translations.notifications.mark_all_as_read_button}
                            </Button>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem>{translations.notifications.no_new_notifications}</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
