import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Data from './Data';

const breadcrumbs = [
    {
        title: 'Collaborators list',
        href: '/collaborators',
    },
];

export default function Collaborators({ collaborators, specialities }) {
    const [search, setSearch] = useState('');
    const [filteredCollaborators, setFilteredCollaborators] = useState(collaborators);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = collaborators.filter((collaborator) => collaborator.name.toLowerCase().includes(value));

        setFilteredCollaborators(filtered);
    };

    const handleDelete = (id) => {
        setFilteredCollaborators((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaborators" />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder="Search collaborator..." value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('collaborators.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        Add new
                    </Link>
                </div>

                <Data collaborators={filteredCollaborators} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
