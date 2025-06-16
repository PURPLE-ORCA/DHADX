import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminTaskSummary({ collabCount, specialitysCount, coursCount, formationsCount, taskSummaries }) {
    return (
        <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Card className="relative aspect-vide ">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center text-center">
                    <div className="text-4xl font-bold">{collabCount}</div>
                </CardContent>
            </Card>
            <Card className="relative aspect-vide">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Specialities</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center text-center">
                    <div className="text-4xl font-bold">{specialitysCount}</div>
                </CardContent>
            </Card>
            <Card className="relative aspect-vide">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center text-center">
                    <div className="text-4xl font-bold">{coursCount}</div>
                </CardContent>
            </Card>
            <Card className="relative aspect-vide">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Formations</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-center justify-center text-center">
                    <div className="text-4xl font-bold">{formationsCount}</div>
                </CardContent>
            </Card>
            {/* <Link href={route('tasks.index')} className="block">
                <Card className="relative aspect-video overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks for Review</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col items-center justify-center text-center">
                        <div className="text-4xl font-bold">{taskSummaries.submittedForReviewCount}</div>
                    </CardContent>
                </Card>
            </Link>
            <Link href={route('tasks.index', { status: 'overdue' })} className="block">
                <Card className="relative aspect-video overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Overdue Tasks</CardTitle>
                    </CardHeader>
                </Card>
            </Link> */}
        </div>
    );
}
