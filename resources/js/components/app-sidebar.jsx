import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react'; // Import usePage
import { BriefcaseBusiness, Layers, LayoutGrid, Shapes, Tent, UsersRound, Trophy } from 'lucide-react';
import AppLogo from './app-logo';

// Define icons separately for clarity if needed, or keep inline as before
const iconDashboard = LayoutGrid;
const iconCollaborators = UsersRound;
const iconSpecialities = BriefcaseBusiness;
const iconCours = Shapes;
const iconFormations = Layers;
const iconCamps = Tent;
const iconLeaderboard = Trophy;

export function AppSidebar() {
    const { auth } = usePage().props; // Access auth and abilities

    // Start with items everyone sees
    const mainNavItems = [
        {
            title: 'Dashboard',
            url: '/dashboard', 
            routeName: 'dashboard', 
            icon: iconDashboard,
        },
        {
            title: 'Leaderboard',
            url: '/leaderboard',
            routeName: 'leaderboard.index',
            icon: iconLeaderboard,
        },
    ];

    // Add admin-specific items
    if (auth.user && auth.abilities?.isAdmin) {
        mainNavItems.push(
            {
                title: 'Collaborators',
                url: '/collaborators',
                routeName: 'collaborators.index', 
                icon: iconCollaborators,
            },
            {
                title: 'Specialities',
                url: '/specialities',
                routeName: 'specialities.index',
                icon: iconSpecialities,
            },
            {
                title: 'Cours',
                url: '/cours',
                routeName: 'cours.index',
                icon: iconCours,
            },
            {
                title: 'Formations',
                url: '/formations',
                routeName: 'formations.index',
                icon: iconFormations,
            },
            {
                title: 'Camps',
                url: '/camps',
                routeName: 'camps.index',
                icon: iconCamps,
            }
        );
    }

    // collaborator-specific items (if any, separate from admin)
    // if (auth.user && auth.abilities?.isCollaborator && !auth.abilities?.isAdmin) {
    //     mainNavItems.push({
    //         title: 'My Progress', // Example
    //         url: '/my-progress',
    //         routeName: 'my.progress',
    //         icon: SomeOtherIcon,
    //     });
    // }


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* Make sure AppLogo is wrapped in Link or is a Link itself */}
                            <Link href={route('dashboard')}> {/* Use route() helper */}
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* NavMain will receive the dynamically built list */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
