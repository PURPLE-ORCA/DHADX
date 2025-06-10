import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function CollaboratorMyTasks({ taskSummaries }) {
    return (
        <>
            <Link href={route('tasks.index', { status: 'pending' })} className="block">
                <Card className="relative aspect-video overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col items-center justify-center text-center">
                        <div className="text-4xl font-bold">{taskSummaries.pendingTasksCount}</div>
                    </CardContent>
                </Card>
            </Link>
            <Link href={route('tasks.index', { status: 'overdue' })} className="block">
                <Card className="relative aspect-video overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col items-center justify-center text-center">
                        <div className="text-4xl font-bold">{taskSummaries.overdueTasksCount}</div>
                    </CardContent>
                </Card>
            </Link>
        </>
    );
}
