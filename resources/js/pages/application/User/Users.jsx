import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import Data from './Data';

export default function Users({ users, specialities, auth }) { 
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.users.users_list,
            href: '/users',
        },
    ];

    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = users.filter((user) => user.name.toLowerCase().includes(value));

        setFilteredUsers(filtered);
    };

    const handleDelete = (id) => {
        setFilteredUsers((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.users.title} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.users.search_placeholder} value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('users.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.users.add_new}
                    </Link>
                </div>

                <Data users={filteredUsers} onDeleted={handleDelete} auth={auth} /> {/* Passed auth prop */}
            </div>
        </AppLayout>
    );
}
