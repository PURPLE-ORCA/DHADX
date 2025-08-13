import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { Transition } from '@headlessui/react';

export default function DeleteCertificateModal({ certificate, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);
    const {
        delete: destroy,
        processing,
        reset,
        clearErrors,
        recentlySuccessful,
    } = useForm();

    const deleteCertificate = (e) => {
        e.preventDefault();
        destroy(route('certificates.destroy', { certificate: certificate.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                if (onDeleted) {
                    onDeleted();
                }
                toast.success(
                    translations.certificates?.delete?.deleted_successfully ||
                        'Certificate deleted successfully.'
                );
            },
            onError: () => {
                toast.error(
                    translations.certificates?.delete?.error_deleting ||
                        'An error occurred while deleting the certificate.'
                );
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <>
            <Transition
                show={recentlySuccessful}
                enter='transition-opacity duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition-opacity duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <div className='fixed top-12 right-3 rounded bg-green-500 p-2 whitespace-nowrap'>
                    <p className='text-sm font-semibold text-white'>
                        {translations.certificates?.delete?.deleted_successfully ||
                            'Certificate deleted successfully.'}
                    </p>
                </div>
            </Transition>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant='ghost' size='icon'>
                        <Trash className='h-4 w-4' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        {translations.certificates?.delete?.dialog_title || 'Delete Certificate'}
                    </DialogTitle>
                    <DialogDescription>
                        {translations.certificates?.delete?.dialog_description ||
                            'Are you sure you want to delete this certificate? This action cannot be undone.'}
                    </DialogDescription>
                    <form onSubmit={deleteCertificate}>
                        <DialogFooter className='mt-4 gap-2'>
                            <DialogClose asChild>
                                <Button variant='secondary' onClick={closeModal}>
                                    {translations.certificates?.delete?.cancel_button || 'Cancel'}
                                </Button>
                            </DialogClose>
                            <Button type='submit' variant='destructive' disabled={processing}>
                                {translations.certificates?.delete?.delete_button_confirm || 'Delete'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}