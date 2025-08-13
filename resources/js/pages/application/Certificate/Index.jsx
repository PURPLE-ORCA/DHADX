import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Search, Eye } from 'lucide-react';
import { useContext, useState } from 'react';
import Data from './Data';
import { TranslationContext } from '@/context/TranslationProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Certificate({ certificates = [], users }) {
    const { translations } = useContext(TranslationContext);
    const [search, setSearch] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState(certificates);
    const [viewingCertificate, setViewingCertificate] = useState(null);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = certificates.filter((certificate) => {
            const matchesCode = certificate.code.toLowerCase().includes(value);
            const matchesUserName = certificate.user?.name.toLowerCase().includes(value);

            return matchesCode || matchesUserName;
        });

        setFilteredCertificates(filtered);
    };

    const handleDelete = (id) => {
        setFilteredCertificates((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: translations.certificates?.list_title || 'Certificates list', href: '/certificates' }]}>
            <Head title={translations.certificates?.page_title || 'Certificates'} />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder={translations.certificates?.search_placeholder || 'Search certificates...'} value={search} onChange={handleSearch} />
                    </div>
                    {/* <Link
                        href={route('certificates.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                    >
                        {translations.certificates?.add_new_button || 'Add New Certificate'}
                    </Link> */}
                </div>

                <Data certificates={filteredCertificates} users={users} onDeleted={handleDelete} onViewCertificate={setViewingCertificate} />

                <Dialog open={!!viewingCertificate} onOpenChange={() => setViewingCertificate(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{translations.certificates?.view_title || 'View Certificate'}</DialogTitle>
                            <DialogDescription>
                                {translations.certificates?.view_description || 'Details of the selected certificate.'}
                            </DialogDescription>
                        </DialogHeader>
                        {viewingCertificate && (
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col items-center gap-2">
                                    <img src={viewingCertificate.image} alt="Certificate" className="max-w-full h-auto rounded-md" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium">{translations.certificates?.user || 'User'}:</span>
                                    <span className="col-span-3">{viewingCertificate.user?.name}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium">{translations.certificates?.code || 'Code'}:</span>
                                    <span className="col-span-3">{viewingCertificate.code}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right font-medium">{translations.certificates?.created_at || 'Creation Date'}:</span>
                                    <span className="col-span-3">{new Date(viewingCertificate.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button onClick={() => setViewingCertificate(null)}>
                                {translations.certificates?.close_button || 'Close'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
