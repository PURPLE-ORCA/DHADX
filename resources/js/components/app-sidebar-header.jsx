import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TranslationContext } from '@/context/TranslationProvider';
import { router, usePage } from '@inertiajs/react';
import { useContext } from 'react';
import NotificationBadge from './notification-badge';

export function AppSidebarHeader({ breadcrumbs = [] }) {
    const { auth} = usePage().props;
    const user = auth.user;

    const { translations, switchLanguage } = useContext(TranslationContext);
    const currentUiLang = localStorage.getItem('lang') || 'en';

    const locals = [
        { locale: 'en', label: translations?.language_english || 'English' },
        { locale: 'fr', label: translations?.language_french || 'Français' },
        { locale: 'ar', label: translations?.language_arabic || 'العربية' },
    ];

    return (
        <header className="border-sidebar-border/50 bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1.5 md:-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex flex-1 items-center justify-end gap-1.5 md:gap-2">
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <Icon icon="fa-solid:language" className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)]">
                        {locals.map((loc) => (
                            <DropdownMenuItem
                                key={loc.locale}
                                onClick={() => switchLanguage(loc.locale)}
                                className={`flex items-center justify-between data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-[var(--accent-foreground)] ${loc.locale === 'ar' ? 'font-arabic flex-row-reverse justify-end' : ''}`}
                            >
                                <span>{loc.label}</span>
                                {loc.locale === currentUiLang && <Icon icon="mdi:check" className="h-4 w-4 text-[var(--primary)]" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu> */}

                <NotificationBadge />
            </div>
        </header>
    );
}
