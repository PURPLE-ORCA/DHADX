import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function UpcomingDeadlines({ upcomingTasks }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card className="col-span-full bg-[var(--card-back)] md:col-span-2 lg:col-span-2">
            <CardHeader>
                <CardTitle>{translations.upcoming_deadlines_widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {upcomingTasks.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {upcomingTasks.map((task) => (
                                <Link href={route('tasks.show', task.id)} key={task.id} className="block">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1">
                                            <p className="text-sm leading-none font-medium">{task.title}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {translations.upcoming_deadlines_widget.due_prefix} {format(new Date(task.due_date), 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-2" />
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-sm">{translations.upcoming_deadlines_widget.no_deadlines}</p>
                )}
            </CardContent>
        </Card>
    );
}
