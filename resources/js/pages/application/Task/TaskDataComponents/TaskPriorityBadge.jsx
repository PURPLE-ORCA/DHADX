import { Badge } from '@/components/ui/badge';

export const getPriorityConfig = (priority) => {
    const configs = {
        low: {
            variant: 'outline',
            color: 'text-black dark:text-white',
            badgeClass: 'border-black dark:border-white text-black dark:text-white',
        },
        medium: {
            variant: 'default',
            color: 'text-white',
            badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
        },
        high: {
            variant: 'default',
            color: 'text-white',
            badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
        },
    };
    return configs[priority] || configs.low;
};

export default function TaskPriorityBadge({ priority }) {
    const config = getPriorityConfig(priority);

    return (
        <Badge className={` shrink-0 font-semibold ${config.badgeClass}`}>
            {priority.toUpperCase()}
        </Badge>
    );
}
