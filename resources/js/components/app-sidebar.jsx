import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, Layers, LayoutGrid, ListChecks, Shapes, Tent, Trophy, UsersRound, ClipboardList } from 'lucide-react'; // Added ListChecks for My Tasks
import AppLogo from './app-logo';

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

export function AppSidebar() {
    const { auth } = usePage().props;
    const navItems = [];

    // --- Items everyone sees ---
    navItems.push({
        title: 'Dashboard',
        url: route('dashboard'),
        routeName: 'dashboard',
        icon: iconDashboard,
    });

    // --- Items for Admins AND Collaborators ---
    if (auth.user && (auth.abilities?.isAdmin || auth.abilities?.isCollaborator)) {
        navItems.push({
            title: 'Leaderboard',
            url: route('leaderboard.index'),
            routeName: 'leaderboard.index',
            icon: iconLeaderboard,
        });
    }

    if (auth.user && auth.abilities?.isCollaborator) {
        navItems.push({
            title: 'My Tasks',
            url: route('collaborator.tasks'), // You'll create this route & page
            routeName: 'collaborator.tasks',
            icon: iconMyTasks,
        });
    }

    // --- Items SPECIFICALLY for Admins ---
    if (auth.user && auth.abilities?.isAdmin) {
        navItems.push(
            {
                title: 'Tasks', // Admin view of all tasks/camps
                url: route('tasks.index'), // Assuming this is the "all tasks" view
                routeName: 'tasks.index', // This was previously just "Tasks"
                icon: iconAdminTasks, // Using a more generic "tasks" icon
            },
            {
                title: 'Collaborators',
                url: route('collaborators.index'),
                routeName: 'collaborators.index',
                icon: iconCollaborators,
            },
            {
                title: 'Specialities',
                url: route('specialities.index'),
                routeName: 'specialities.index',
                icon: iconSpecialities,
            },
            {
                title: 'Cours',
                url: route('cours.index'),
                routeName: 'cours.index',
                icon: iconCours,
            },
            {
                title: 'Formations',
                url: route('formations.index'),
                routeName: 'formations.index',
                icon: iconFormations,
            },
            {
                title: 'Camps',
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
