import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import SeanceStatusBadge from './SeanceStatusBadge';

export default function SeanceHeader({ seance }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{seance.topic}</CardTitle>
                    <SeanceStatusBadge status={seance.status} />
                </div>
                <CardDescription className="mt-2">
                    {translations.seances?.show?.mentor_label || 'Mentor'}: {seance.mentor?.name}
                </CardDescription>
                <CardDescription>
                    {translations.seances?.show?.course_label || 'Course'}: {seance.course?.name}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {translations.seances?.show?.scheduled_at_label || 'Scheduled For'}: {seance.scheduled_at ? new Date(seance.scheduled_at).toLocaleString() : 'N/A'}
                </p>
                {seance.meeting_link && (
                    <Link href={seance.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Button>{translations.seances?.show?.join_meeting_button || 'Join Meeting'}</Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}
