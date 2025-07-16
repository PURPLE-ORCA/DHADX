import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { Video, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';

// A simple countdown component
function Countdown({ targetDate }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval] && interval !== 'days') return null;
        return <span key={interval}>{timeLeft[interval]} {interval}{" "}</span>;
    });

    return <div>{timerComponents.length ? timerComponents : <span>Starting soon...</span>}</div>;
}


export default function LiveSeanceWidget({ seance }) {
    if (!seance) {
        return (
            <Card className="col-span-1 lg:col-span-2 row-span-1 flex flex-col items-center justify-center p-6 min-h-[250px]">
                <CardTitle>No Active or Upcoming Seance</CardTitle>
                <p className="text-muted-foreground mt-2">Check back later for the next scheduled session.</p>
            </Card>
        );
    }

    const isLive = seance.status === 'live';

    return (
        <Card className={`col-span-1 lg:col-span-2 row-span-1 p-6 flex flex-col justify-between min-h-[250px] ${isLive ? 'border-green-500 border-2' : ''}`}>
            <div>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl mb-2">{seance.topic}</CardTitle>
                    {isLive && (
                        <div className="flex items-center gap-2 text-green-400 animate-pulse">
                            <Radio className="h-5 w-5"/>
                            <span className="font-bold">LIVE</span>
                        </div>
                    )}
                </div>
                <p className="text-muted-foreground">Course: {seance.course.name} | With: {seance.mentor.name}</p>
            </div>
            
            <div className="flex items-end justify-between">
                <div>
                    {!isLive && (
                        <>
                            <p className="text-sm font-semibold mb-1">Starts In:</p>
                            <div className="text-2xl font-bold text-primary">
                                <Countdown targetDate={seance.scheduled_at} />
                            </div>
                        </>
                    )}
                </div>
                <Button asChild size="lg">
                    <Link href={route('seances.show', seance.id)}>
                        {isLive ? 'Join Seance Now' : 'Go to Seance Page'}
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
