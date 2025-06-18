import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function CollaboratorMyTasks({ taskSummaries }) {
    return (
        <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Link href={route('tasks.index', { status: 'pending' })} className="mb-2 block pb-8">
                <Card className="relative aspect-video overflow-hidden bg-[var(--card-back)] pb-8">
                    <CardHeader className="flex flex-col items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col items-center justify-center text-center">
                        <div className="text-2xl font-bold">{taskSummaries.pendingTasksCount}</div>
                    </CardContent>
                </Card>
            </Link>
            <Link href={route('tasks.index', { status: 'overdue' })} className="mb-2 block">
                <Card className="relative aspect-video overflow-hidden bg-[var(--card-back)] pb-8">
                    <CardHeader className="flex flex-col items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col items-center justify-center text-center">
                        <div className="text-2xl font-bold">{taskSummaries.overdueTasksCount}</div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
