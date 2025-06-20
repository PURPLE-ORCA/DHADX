import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useContext, useState } from 'react';
import Data from './Data';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Specialities({ specialities }) {
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.specialities.list_title,
            href: '/specialities',
        },
    ];

    const [search, setSearch] = useState('');
    const [filteredSpecialities, setFilteredSpecialities] = useState(specialities);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = specialities.filter((speciality) => speciality.name.toLowerCase().includes(value));

        setFilteredSpecialities(filtered);
    };

    const handleDelete = (id) => {
        setFilteredSpecialities((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.specialities.title} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.specialities.search_placeholder} value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('specialities.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.specialities.add_new_button}
                    </Link>
                </div>

                <Data specialities={filteredSpecialities} onDeleted={handleDelete} />
            </div>
        </AppLayout>
    );
}
