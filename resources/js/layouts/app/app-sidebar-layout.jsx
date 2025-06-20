import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header.jsx';
import { Toaster } from '@/components/ui/sonner';

export default function AppSidebarLayout({ children, breadcrumbs = [] }) {
    const dotColor = '#FF2D20';

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="relative isolate">
                {/* <div
                    className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle, ${dotColor} 0%, transparent 60%)`,
                    }}
                ></div> */}
                <div className="relative z-0">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </div>
            </AppContent>
            <Toaster richColors position="top-right" />
        </AppShell>
    );
}
