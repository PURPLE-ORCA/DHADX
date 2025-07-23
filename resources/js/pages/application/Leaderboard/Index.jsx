import AppLayout from '@/Layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Index({ leaderboardEntries }) {
    const { translations } = useContext(TranslationContext);
    const breadcrumbs = [
        // { label: 'Dashboard', href: route('dashboard') },
        // { label: 'Leaderboard', href: route('leaderboard.index') },
    ];

    return (
        <AppLayout>
            <Head title={translations.leaderboard.title} />
            <div className="p-4 md:p-6 lg:p-8">
                <h1 className="mb-6 text-2xl font-bold">{translations.leaderboard.title}</h1>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">{translations.leaderboard.rank}</TableHead>
                                <TableHead>{translations.leaderboard.collaborator}</TableHead>
                                <TableHead>{translations.leaderboard.highest_class_level}</TableHead>
                                <TableHead className="text-right">{translations.leaderboard.progress_in_class}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardEntries.map((entry, index) => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{entry.name}</TableCell>
                                    <TableCell>
                                        {entry.max_cour_level !== null ? entry.max_cour_level : translations.leaderboard.no_camp_yet}
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
