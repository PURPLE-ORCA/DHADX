import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { AlertTriangle } from 'lucide-react'; // Import AlertTriangle icon

export default function UpcomingDeadlines({ urgentTasks }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card className="col-span-full bg-[var(--card-back)] md:col-span-2 lg:col-span-2">
            <CardHeader>
                <CardTitle>Urgent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                {urgentTasks.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                        <div className="space-y-4">
                            {urgentTasks.map((task) => {
                                const isOverdue = task.status === 'overdue';
                                return (
                                    <Link
                                        href={route('tasks.show', task.id)}
                                        key={task.id}
                                        className={`block ${isOverdue ? 'border-l-4 border-red-500 bg-red-900/20 p-2 rounded-md' : ''}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            {isOverdue && <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />}
                                            <div className="flex-1">
                                                <p className="text-sm leading-none font-medium">{task.title}</p>
                                                <p className={`text-sm ${isOverdue ? 'font-bold text-red-400' : 'text-muted-foreground'}`}>
                                                    {translations.upcoming_deadlines_widget.due_prefix} {format(new Date(task.due_date), 'PPP')}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="my-2" />
                                    </Link>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-sm">{translations.upcoming_deadlines_widget.no_deadlines}</p>
                )}
            </CardContent>
        </Card>
    );
}
