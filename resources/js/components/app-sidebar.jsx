import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, Layers, LayoutGrid, ListChecks, Shapes, Tent, Trophy, UsersRound, ClipboardList, Brush, CalendarDays } from 'lucide-react'; // Added CalendarDays for Seances
import AppLogo from './app-logo';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

// Define icons
const iconDashboard = LayoutGrid;
const iconCollaborators = UsersRound;
const iconSpecialities = BriefcaseBusiness;
const iconCours = Shapes;
const iconFormations = Layers;
const iconAdminTasks = ClipboardList; // Changed from iconCamps for clarity if "Tasks" is different from "Camps"
const iconCampsManagement = Tent; // Keep Tent if 'Camps' is a separate admin menu item
const iconLeaderboard = Trophy;
const iconMyTasks = ListChecks;
const iconWhiteboard = Brush;
const iconSeances = CalendarDays; // Icon for Seances

export function AppSidebar() {
    const { auth } = usePage().props;
    const { translations } = useContext(TranslationContext);
    const navItems = [];

    // --- Items everyone sees ---
    navItems.push({
        title: translations.sidebar.dashboard,
        url: route('dashboard'),
        routeName: 'dashboard',
        icon: iconDashboard,
    });

    // --- Items for Admins AND Collaborators ---
    if (auth.user && (auth.abilities?.isAdmin || auth.abilities?.isCollaborator)) {
        navItems.push({
            title: translations.sidebar.leaderboard,
            url: route('leaderboard.index'),
            routeName: 'leaderboard.index',
            icon: iconLeaderboard,
        });
    }

    if (auth.user && auth.abilities?.isCollaborator) {
        navItems.push({
            title: translations.sidebar.my_tasks,
            url: route('collaborator.tasks'), // You'll create this route & page
            routeName: 'collaborator.tasks',
            icon: iconMyTasks,
        });
        navItems.push({
            title: 'Whiteboards', // Or use translations: translations.sidebar.whiteboards
            url: route('whiteboards.index'),
            routeName: 'whiteboards.index',
            icon: iconWhiteboard,
        });
    }

    // --- Items SPECIFICALLY for Admins ---
    if (auth.user && auth.abilities?.isAdmin) {
        navItems.push(
            {
                title: translations.sidebar.tasks, // Admin view of all tasks/camps
                url: route('tasks.index'), // Assuming this is the "all tasks" view
                routeName: 'tasks.index', // This was previously just "Tasks"
                icon: iconAdminTasks, // Using a more generic "tasks" icon
            },
            {
                title: translations.sidebar.collaborators,
                url: route('collaborators.index'),
                routeName: 'collaborators.index',
                icon: iconCollaborators,
            },
            {
                title: translations.sidebar.specialities,
                url: route('specialities.index'),
                routeName: 'specialities.index',
                icon: iconSpecialities,
            },
            {
                title: translations.sidebar.cours,
                url: route('cours.index'),
                routeName: 'cours.index',
                icon: iconCours,
            },
            {
                title: translations.sidebar.formations,
                url: route('formations.index'),
                routeName: 'formations.index',
                icon: iconFormations,
            },
            {
                title: translations.sidebar.seances || 'Seances', // Add Seances link
                url: route('seances.index'),
                routeName: 'seances.index',
                icon: iconSeances,
            },
            {
                title: translations.sidebar.camps,
                url: route('camps.index'),
                routeName: 'camps.index',
                icon: iconCampsManagement,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
