import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Data from './Data';

const breadcrumbs = [
    {
        title: 'Formations list',
        href: '/formations',
    },
];

export default function Formations({ formations, cours }) {
    const [search, setSearch] = useState('');
    const [filteredFormations, setFilteredFormations] = useState(formations);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = formations.filter((formation) => formation.name.toLowerCase().includes(value));

        setFilteredFormations(filtered);
    };

    const handleDelete = (id) => {
        setFilteredFormations((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formations" />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder="Search formation..." value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('formations.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        Add new
                    </Link>
                </div>

                <Data formations={filteredFormations} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
