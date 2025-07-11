import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import SeanceHeader from './components/SeanceHeader';
import AttendanceList from './components/AttendanceList';
import ExerciseManager from './components/ExerciseManager';
import ExerciseList from './components/ExerciseList';

export default function Show({ seance, isMentor }) {
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.seances?.list_title || 'Seances list',
            href: '/seances',
        },
        {
            title: seance.topic,
            href: route('seances.show', seance.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={seance.topic} />

            <div className="p-4">
                <SeanceHeader seance={seance} />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isMentor ? (
                        <>
                            <AttendanceList attendees={seance.attendees} />
                            <ExerciseManager seance={seance} />
                        </>
                    ) : (
                        <div className="md:col-span-2">
                            <ExerciseList seance={seance} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
