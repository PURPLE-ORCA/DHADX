import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Layers,
    LayoutGrid,
    ListChecks,
    Shapes,
    Tent,
    Trophy,
    UsersRound,
    ClipboardList,
    Brush,
    CalendarDays,
    Users,
    Award 
} from 'lucide-react';
import AppLogo from './app-logo';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

// Define icons
const iconDashboard = LayoutGrid;
const iconCollaborators = UsersRound;
const iconSpecialities = BriefcaseBusiness;
const iconCours = Shapes;
const iconFormations = Layers;
const iconAdminTasks = ClipboardList;
const iconCampsManagement = Tent; 
const iconLeaderboard = Trophy;
const iconMyTasks = ListChecks;
const iconWhiteboard = Brush;
const iconSeances = CalendarDays;
const iconUsers = Users;
const iconCertificates = Award; // Define the new icon

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

    // --- Items for Admins AND Users ---
    if (auth.user && (auth.abilities?.isAdmin || auth.abilities?.isStudent)) {
        navItems.push({
            title: translations.sidebar.leaderboard,
            url: route('leaderboard.index'),
            routeName: 'leaderboard.index',
            icon: iconLeaderboard,
        });
    }

    if (auth.user && auth.abilities?.isStudent) {
        // navItems.push({
        //     title: translations.sidebar.my_tasks,
        //     url: route('user.tasks'), // You'll create this route & page
        //     routeName: 'user.tasks',
        //     icon: iconMyTasks,
        // });
        // * I COMMENTED THE MY TASKS LINK TEMPORARY UNTIL I MAKE MY MIND ON THE NEW TASKS LOGIC
        navItems.push({
            title: translations.sidebar.whiteboards,
            url: route('whiteboards.index'),
            routeName: 'whiteboards.index',
            icon: iconWhiteboard,
        });
    }

    // --- Items SPECIFICALLY for Admins ---
    if (auth.user && auth.abilities?.isAdmin) {
        navItems.push(
            // {
            //     title: translations.sidebar.tasks, // Admin view of all tasks/camps
            //     url: route('tasks.index'), // Assuming this is the "all tasks" view
            //     routeName: 'tasks.index', // This was previously just "Tasks"
            //     icon: iconAdminTasks, // Using a more generic "tasks" icon
            // },
            // * I COMMENTED THE TASKS LINK TEMPORARY UNTIL I MAKE DECISIONS ON THE NEW TASKS LOGIC
            {
                title: translations.sidebar.users,
                url: route('users.index'),
                routeName: 'users.index',
                icon: iconUsers,
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
                title: translations.sidebar.seances || 'Seances', 
                url: route('seances.index'),
                routeName: 'seances.index',
                icon: iconSeances,
            },
            {
                title: translations.sidebar.camps,
                url: route('camps.index'),
                routeName: 'camps.index',
                icon: iconCampsManagement,
            },
            {
                title: translations.sidebar.certificates || 'Certificates',
                url: route('certificates.index'),
                routeName: 'certificates.index',
                icon: iconCertificates,
            },
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
