import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { Hand } from 'lucide-react';

export default function AttendanceList({ attendees, handRaiseQueue }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.seances?.show?.attendance_list_title || 'Attendees'}</CardTitle>
            </CardHeader>
            <CardContent>
                {attendees && attendees.length > 0 ? (
                    <ul className="space-y-2">
                        {attendees.map((attendee) => {
                            const hasHandRaised = handRaiseQueue.some(c => c.id === attendee.id); // Check if hand is raised
                            return (
                                <li key={attendee.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={attendee.profile_photo_url} alt={attendee.user?.name || 'N/A'} />
                                            <AvatarFallback>{attendee.user?.name?.charAt(0) || '?'}</AvatarFallback>
                                        </Avatar>
                                        <span>{attendee.user?.name || 'N/A'}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2"> {/* New div to group hand icon and status */}
                                        {hasHandRaised && <Hand className="h-4 w-4 text-yellow-500" />} {/* Hand icon */}
                                        {attendee.pivot?.status === 'present' ? (
                                            <span className="flex items-center text-xs text-green-400">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                Present
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-xs text-gray-500">
                                                <div className="w-2 h-2 rounded-full bg-gray-600 mr-2"></div>
                                                Absent
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">{translations.seances?.show?.no_attendees || 'No attendees yet.'}</p>
                )}
            </CardContent>
        </Card>
    );
}
