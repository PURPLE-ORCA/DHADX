import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function HandRaiseQueue({ queue, seanceId }) {
    if (queue.length === 0) return null; // Don't render anything if the queue is empty

    const handleDismiss = (userId) => {
        axios.post(route('seances.hand.dismiss', { seance: seanceId, user: userId }));
    };

    return (
        <Card className="border-yellow-500 border-2">
            <CardHeader><CardTitle>Hand Raise Queue</CardTitle></CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {queue.map(user => (
                        <li key={user.id} className="flex items-center justify-between">
                            <span>{user.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleDismiss(user.id)}>Dismiss</Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
