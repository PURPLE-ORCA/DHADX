import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const getStatusConfig = (status) => {
    const configs = {
        pending: {
            variant: 'outline',
            icon: Clock,
            color: 'text-black dark:text-white',
            bg: 'bg-white dark:bg-black border-2 border-black dark:border-white',
            badgeClass: 'border-black dark:border-white text-black dark:text-white',
        },
        in_progress: {
            variant: 'default',
            icon: AlertCircle,
            color: 'text-white',
            bg: 'bg-[var(--brand-color)]',
            badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
        },
        submitted: {
            variant: 'default',
            icon: CheckCircle2,
            color: 'text-white',
            bg: 'bg-black dark:bg-white',
            badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
        },
        completed: {
            variant: 'default',
            icon: CheckCircle2,
            color: 'text-white',
            bg: 'bg-black dark:bg-white',
            badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
        },
        needs_revision: {
            variant: 'destructive',
            icon: AlertCircle,
            color: 'text-white',
            bg: 'bg-[var(--brand-color)]',
            badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
        },
        overdue: {
            variant: 'destructive',
            icon: AlertCircle,
            color: 'text-white',
            bg: 'bg-[var(--brand-color)]',
            badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
        },
        cancelled: {
            variant: 'outline',
            icon: Clock,
            color: 'text-black dark:text-white',
            bg: 'bg-white dark:bg-black border-2 border-black dark:border-white',
            badgeClass: 'border-black dark:border-white text-black dark:text-white',
        },
    };
    return configs[status] || configs.pending;
};

export default function TaskStatusBadge({ status }) {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
        <Badge className={config.badgeClass}>
            <StatusIcon className=" h-2 w-2" />
            {status.replace('_', ' ').toUpperCase()}
        </Badge>
    );
}
