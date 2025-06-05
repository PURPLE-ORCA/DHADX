import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Data from './Data';

const breadcrumbs = [
    {
        title: 'Courses list',
        href: '/courses',
    },
];

export default function Cours({ cours }) {
    const [search, setSearch] = useState('');
    const [filteredCours, setFilteredCours] = useState(cours);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = cours.filter((cour) => {
            const matchesCourName = cour.name.toLowerCase().includes(value);
            const matchesFormationName = cour.formations?.some((formation) => formation.name.toLowerCase().includes(value));

            return matchesCourName || matchesFormationName;
        });

        setFilteredCours(filtered);
    };

    const handleDelete = (id) => {
        setFilteredCours((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cours" />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder="Search cours..." value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('cours.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        Add new
                    </Link>
                </div>

                <Data cours={filteredCours} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
