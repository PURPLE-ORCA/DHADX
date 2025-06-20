import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import Data from './Data';

export default function Collaborators({ collaborators, specialities, auth }) { // Added auth prop
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.collaborators.collaborators_list,
            href: '/collaborators',
        },
    ];

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
            <Head title={translations.collaborators.title} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.collaborators.search_placeholder} value={search} onChange={handleSearch} />
                    </div>
                    <Link
                        href={route('collaborators.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.collaborators.add_new}
                    </Link>
                </div>

                <Data collaborators={filteredCollaborators} onDeleted={handleDelete} auth={auth} /> {/* Passed auth prop */}
            </div>
        </AppLayout>
    );
}
