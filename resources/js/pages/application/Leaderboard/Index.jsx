import AppLayout from '@/Layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Index({ leaderboardEntries }) {
    const breadcrumbs = [
        // { label: 'Dashboard', href: route('dashboard') },
        // { label: 'Leaderboard', href: route('leaderboard.index') },
    ];

    return (
        <AppLayout>
            <Head title="Collaborators" />
            <div className="p-4 md:p-6 lg:p-8">
                <h1 className="mb-6 text-2xl font-bold">Collaborator Leaderboard</h1>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Collaborator</TableHead>
                                <TableHead>Highest Class Level</TableHead>
                                <TableHead className="text-right">Progress in Class (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardEntries.map((entry, index) => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{entry.name}</TableCell>
                                    <TableCell>
                                        {/* This part for 'Highest Class Level' remains the same logic,
                                            but if max_cour_level is NULL from the DB, it shows 'No camp yet'
                                            Otherwise, it shows the level number.
                                        */}
                                        {entry.max_cour_level !== null ? entry.max_cour_level : 'No camp yet'}
                                    </TableCell>
                                    {/* Use the new average_progress_in_max_cour field */}
                                    <TableCell className="text-right">
                                        {entry.max_cour_level !== null ? `${entry.average_progress_in_max_cour || 0}%` : '0%'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
