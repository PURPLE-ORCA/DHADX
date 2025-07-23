import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Video } from 'lucide-react';

export default function UpcomingSeanceWidget({ seance }) {
    if (!seance) {
        // You can optionally render nothing or a "No upcoming seances" message
        return null; 
    }

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Next Seance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <h3 className="font-semibold text-lg">{seance.topic}</h3>
                <p className="text-sm text-muted-foreground">
                    Course: {seance.course.name}
                </p>
                <p className="text-sm text-muted-foreground">
                    With: {seance.mentor.name}
                </p>
                <p className="text-sm font-semibold">
                    {format(new Date(seance.scheduled_at), 'eeee, MMMM d \'at\' p')}
                </p>
                <div className="pt-2 flex gap-2">
                    <Button asChild>
                        <Link href={route('seances.show', seance.id)}>Go to Seance Page</Link>
                    </Button>
                    {seance.meeting_link && (
                         <Button variant="secondary" asChild>
                            <a href={seance.meeting_link} target="_blank" rel="noopener noreferrer">
                                <Video className="w-4 h-4 mr-2" />
                                Join Meeting
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
