import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useForm, router } from '@inertiajs/react';
import { useContext, useState } from 'react';
import { Eye, Trash, Pencil } from 'lucide-react';
import { TranslationContext } from '@/context/TranslationProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import ViewCertificateModal from './ViewCertificateModal';
import EditCertificateModal from './EditCertificateModal';
import DeleteCertificateModal from './DeleteCertificateModal';

export default function Data({ certificates = [], users, courses = [], onDeleted, onUpdated }) {
    const { translations } = useContext(TranslationContext);
    const [viewingCertificate, setViewingCertificate] = useState(null);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        course_id: '', 
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('certificates.store'), {
            onSuccess: () => {
                reset();
                window.location.reload();
            },
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{translations.certificates?.list_title || 'Certificates List'}</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>{translations.certificates?.add_new_button || 'Add New Certificate'}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{translations.certificates?.add_new_button || 'Add New Certificate'}</DialogTitle>
                                <DialogDescription>
                                    {translations.certificates?.add_new_description || 'Fill in the details to create a new certificate.'}
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
                                                    {data.user_id ? users.find(user => user.id === Number(data.user_id))?.name : translations.certificates?.select_user || 'Select a user'}
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
                                                        const selectedCourse = courses.find(course => course.id === Number(data.course_id));
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
                                            {translations.certificates?.image || 'Image URL'}
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files[0])}
                                            className="col-span-3"
                                        />
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
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{translations.certificates?.user || 'User'}</TableHead>
                                <TableHead>{translations.certificates?.course || 'Course'}</TableHead> {/* New Course Header */}
                                <TableHead>{translations.certificates?.code || 'Code'}</TableHead>
                                <TableHead>{translations.certificates?.created_at || 'Created At'}</TableHead>
                                <TableHead className="text-right">{translations.certificates?.actions || 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.length > 0 ? (
                                certificates.map((certificate) => (
                                    <TableRow key={certificate.id}>
                                        <TableCell>{certificate.user?.name}</TableCell>
                                        <TableCell>{certificate.course?.name || 'N/A'}</TableCell> {/* New Course Cell */}
                                        <TableCell>{certificate.code}</TableCell>
                                        <TableCell>{new Date(certificate.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setViewingCertificate(certificate)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setEditingCertificate(certificate)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteCertificateModal certificate={certificate} onDeleted={() => onDeleted(certificate.id)} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        {translations.certificates?.no_certificates || 'No certificates found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ViewCertificateModal
                certificate={viewingCertificate}
                onClose={() => setViewingCertificate(null)}
            />
            <EditCertificateModal
                certificate={editingCertificate}
                users={users}
                courses={courses}
                isOpen={!!editingCertificate}
                onClose={() => setEditingCertificate(null)}
                onUpdated={onUpdated}
            />
        </>
    );
}