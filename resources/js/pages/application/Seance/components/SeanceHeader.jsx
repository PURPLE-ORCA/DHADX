import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import SeanceStatusBadge from './SeanceStatusBadge';
import { Play, StopCircle, XCircle, UserCheck, Video } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SeanceHeader({ seance, isMentor, onStartCheck }) {
    
    const renderMentorControls = () => (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                {/* Start/End/Cancel Controls */}
                {seance.status === 'scheduled' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={route('seances.start', seance.id)} method="post" as="button">
                                    <Play className="h-5 w-5 text-green-500" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Start Seance</p></TooltipContent>
                    </Tooltip>
                )}
                {seance.status === 'live' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={route('seances.finish', seance.id)} method="post" as="button">
                                    <StopCircle className="h-5 w-5" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>End Seance</p></TooltipContent>
                    </Tooltip>
                )}

                {/* Presence Check Button */}
                {seance.status === 'live' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onStartCheck}>
                                <UserCheck className="h-5 w-5 text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Start Presence Check</p></TooltipContent>
                    </Tooltip>
                )}

                {/* Cancel Button */}
                {(seance.status === 'scheduled' || seance.status === 'live') && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={route('seances.cancel', seance.id)} method="post" as="button">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Cancel Seance</p></TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="mb-2 text-2xl">{seance.topic}</CardTitle>
                    <CardDescription>Mentor: {seance.mentor?.name}</CardDescription>
                    <CardDescription>Course: {seance.course?.name}</CardDescription>
                    <CardDescription>Scheduled For: {seance.scheduled_at ? new Date(seance.scheduled_at).toLocaleString() : 'N/A'}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <SeanceStatusBadge status={seance.status} />
                    {isMentor && renderMentorControls()}
                </div>
            </CardHeader>
            {seance.meeting_link && (
                 <CardContent>
                     <a href={seance.meeting_link} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">
                            <Video className="w-4 h-4 mr-2"/>
                            Join Meeting
                        </Button>
                    </a>
                 </CardContent>
            )}
        </Card>
    );
}
