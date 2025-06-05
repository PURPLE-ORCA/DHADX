import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Data from './Data';

const breadcrumbs = [
    {
        title: 'Camps list',
        href: '/camps',
    },
];

export default function Camps({ camps }) {
    const [search, setSearch] = useState('');
    const [filteredCamps, setFilteredCamps] = useState(camps);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = camps.filter(
            (camp) =>
                camp.formation?.name.toLowerCase().includes(value) ||
                camp.cour?.name.toLowerCase().includes(value) ||
                camp.cour?.label.toLowerCase().includes(value) ||
                camp.collaborator?.name.toLowerCase().includes(value),
        );
        setFilteredCamps(filtered);
    };

    const handleDelete = (id) => {
        setFilteredCamps((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Camps" />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder="Search camp..." value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('camps.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        Add new
                    </Link>
                </div>

                <Data camps={camps} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
