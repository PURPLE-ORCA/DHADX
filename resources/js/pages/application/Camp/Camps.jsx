import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import Data from './Data';

export default function Camps({ camps: initialCamps }) {
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.camps.camps_list,
            href: '/camps',
        },
    ];

    const [search, setSearch] = useState('');
    const [filteredCamps, setFilteredCamps] = useState(initialCamps);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        if (value === '') {
            setFilteredCamps(initialCamps);
        } else {
            const filtered = initialCamps.filter(
                (camp) =>
                    camp.formation?.name.toLowerCase().includes(value) ||
                    camp.cour?.name.toLowerCase().includes(value) ||
                    camp.cour?.label.toLowerCase().includes(value) ||
                    camp.collaborator?.name.toLowerCase().includes(value),
            );
            setFilteredCamps(filtered);
        }
    };

    const handleDelete = (deletedCampId) => {
        setFilteredCamps((prev) => prev.filter((c) => c.id !== deletedCampId));
    };

    useEffect(() => {
        if (search === '') {
            setFilteredCamps(initialCamps);
        } else {
            const reFiltered = initialCamps.filter(
                (camp) =>
                    camp.formation?.name.toLowerCase().includes(search) ||
                    camp.cour?.name.toLowerCase().includes(search) ||
                    camp.cour?.label.toLowerCase().includes(search) ||
                    camp.collaborator?.name.toLowerCase().includes(search),
            );
            setFilteredCamps(reFiltered);
        }
    }, [initialCamps, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.camps.title} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.camps.search_placeholder} value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('camps.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.camps.add_new}
                    </Link>
                </div>

                <Data camps={filteredCamps} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
