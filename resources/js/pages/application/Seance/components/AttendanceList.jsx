import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function AttendanceList({ attendees }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.seances?.show?.attendance_list_title || 'Attendees'}</CardTitle>
            </CardHeader>
            <CardContent>
                {attendees && attendees.length > 0 ? (
                    <ul className="space-y-2">
                        {attendees.map((attendee) => (
                            <li key={attendee.id} className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={attendee.profile_photo_url} alt={attendee.name} />
                                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{attendee.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">{translations.seances?.show?.no_attendees || 'No attendees yet.'}</p>
                )}
            </CardContent>
        </Card>
    );
}
