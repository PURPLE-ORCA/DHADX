import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function LatestNotifications({ notifications }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card className="col-span-full bg-[var(--card-back)] md:col-span-2 lg:col-span-2">
            <CardHeader>
                <CardTitle>{translations.latest_notifications_widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-4">
                                    <div className="flex-1">
                                        <p className="text-sm leading-none font-medium">{notification.data.message}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-sm">{translations.latest_notifications_widget.no_notifications}</p>
                )}
            </CardContent>
        </Card>
    );
}
