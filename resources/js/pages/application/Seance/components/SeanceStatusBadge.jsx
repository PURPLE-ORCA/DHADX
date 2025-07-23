import { Badge } from '@/components/ui/badge';

export default function SeanceStatusBadge({ status }) {
    let variant = 'default';
    let text = status;

    switch (status) {
        case 'scheduled':
            variant = 'outline';
            text = 'Scheduled';
            break;
        case 'live':
            variant = 'success'; // Assuming a 'success' variant for live status
            text = 'Live';
            break;
        case 'finished':
            variant = 'secondary'; // Assuming a 'secondary' variant for finished status
            text = 'Finished';
            break;
        case 'cancelled':
            variant = 'destructive'; // Assuming a 'destructive' variant for cancelled status
            text = 'Cancelled';
            break;
        default:
            variant = 'default';
            text = status;
            break;
    }

    return (
        <Badge variant={variant}>
            {text}
        </Badge>
    );
}
