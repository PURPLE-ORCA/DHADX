import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';

export default function UpcomingDeadlines({ upcomingTasks }) {
    return (
        <Card className="col-span-full md:col-span-2 lg:col-span-2">
            <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
                {upcomingTasks.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {upcomingTasks.map((task) => (
                                <Link href={route('tasks.show', task.id)} key={task.id} className="block">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-none">
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {format(new Date(task.due_date), 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                )}
            </CardContent>
        </Card>
    );
}
