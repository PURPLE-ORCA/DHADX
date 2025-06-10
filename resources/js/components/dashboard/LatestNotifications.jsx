import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

export default function LatestNotifications({ notifications }) {
    return (
        <Card className="col-span-full md:col-span-2 lg:col-span-2">
            <CardHeader>
                <CardTitle>Latest Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.data.message}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-sm text-muted-foreground">No new notifications.</p>
                )}
            </CardContent>
        </Card>
    );
}
