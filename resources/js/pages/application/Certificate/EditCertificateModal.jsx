import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { useContext, useEffect } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function EditCertificateModal({ certificate, users, courses, isOpen, onClose, onUpdated }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        course_id: '',
        image: null,
        _method: 'put',
    });

    useEffect(() => {
        if (certificate) {
            setData({
                user_id: certificate.user_id,
                course_id: certificate.course_id,
                image: null,
                _method: 'put',
            });
        }
    }, [certificate]);

    const submit = (e) => {
        e.preventDefault();
        if (!certificate) return;
        post(route('certificates.update', certificate.id), {
            onSuccess: () => {
                reset();
                onClose();
                onUpdated();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{translations.certificates?.edit_certificate_title || 'Edit Certificate'}</DialogTitle>
                    <DialogDescription>
                        {translations.certificates?.edit_certificate_description || "Update the certificate's details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user_id" className="text-right">
                                {translations.certificates?.user || 'User'}
                            </Label>
                            <Select onValueChange={(value) => setData('user_id', value)} value={data.user_id}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={translations.certificates?.select_user || 'Select a user'}>
                                        {data.user_id ? users.find((user) => user.id === Number(data.user_id))?.name : translations.certificates?.select_user || 'Select a user'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.user_id} className="col-span-4" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="course_id" className="text-right">
                                {translations.certificates?.course || 'Course'}
                            </Label>
                            <Select onValueChange={(value) => setData('course_id', value)} value={data.course_id}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={translations.certificates?.select_course || 'Select a course'}>
                                        {(() => {
                                            const selectedCourse = courses.find((course) => course.id === Number(data.course_id));
                                            return selectedCourse?.name || (translations.certificates?.select_course || 'Select a course');
                                        })()}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.course_id} className="col-span-4" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">
                                {translations.certificates?.image || 'Image'}
                            </Label>
                            <Input id="image" type="file" onChange={(e) => setData('image', e.target.files[0])} className="col-span-3" />
                            <InputError message={errors.image} className="col-span-4" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {translations.certificates?.save_button || 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}