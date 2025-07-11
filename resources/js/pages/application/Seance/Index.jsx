import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useContext, useState } from 'react';
import Data from './Data';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Seance({ seances: { data: seancesData } }) {
    const { translations } = useContext(TranslationContext);
    const [search, setSearch] = useState('');
    const [filteredSeances, setFilteredSeances] = useState(seancesData);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = seancesData.filter((seance) => {
            const matchesTopic = seance.topic.toLowerCase().includes(value);
            const matchesCourseName = seance.course?.name.toLowerCase().includes(value);
            const matchesMentorName = seance.mentor?.name.toLowerCase().includes(value);

            return matchesTopic || matchesCourseName || matchesMentorName;
        });

        setFilteredSeances(filtered);
    };

    const handleDelete = (id) => {
        setFilteredSeances((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: translations.seances?.list_title || 'Seances list', href: '/seances' }]}>
            <Head title={translations.seances?.page_title || 'Seances'} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.seances?.search_placeholder || 'Search seances...'} value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('seances.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.seances?.add_new_button || 'Add New Seance'}
                    </Link>
                </div>

                <Data seances={filteredSeances} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
