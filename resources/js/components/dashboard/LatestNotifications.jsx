import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { getNotificationDetails } from '@/lib/notification-helper';
import { BellIcon } from 'lucide-react';

export default function LatestNotifications({ notifications }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.latest_notifications_widget.title || 'Latest Notifications'}</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications.length > 0 ? (
                    <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-4">
                            {notifications.map((notification) => {
                                // --- THE FIX IS HERE ---
                                const details = getNotificationDetails(notification);
                                const Icon = details.icon || BellIcon;

                                return (
                                    <div key={notification.id} className="flex items-start space-x-3">
                                        <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm leading-none font-semibold">{details.title}</p>
                                            <p className="text-sm text-muted-foreground">{details.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                                // --- END FIX ---
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-sm">{translations.latest_notifications_widget.no_notifications}</p>
                )}
            </CardContent>
        </Card>
    );
}
