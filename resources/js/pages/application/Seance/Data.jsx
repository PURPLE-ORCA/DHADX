import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { format } from 'date-fns';
import SeanceStatusBadge from './components/SeanceStatusBadge';
import Delete from './Delete'; // Assuming a Delete component will be created for Seances

function Data({ seances, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{translations.seances?.data?.table_head_topic || 'Topic'}</TableHead>
                    <TableHead>{translations.seances?.data?.table_head_course || 'Course'}</TableHead>
                    <TableHead>{translations.seances?.data?.table_head_mentor || 'Mentor'}</TableHead>
                    <TableHead>{translations.seances?.data?.table_head_scheduled_for || 'Scheduled For'}</TableHead>
                    <TableHead>{translations.seances?.data?.table_head_status || 'Status'}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {seances.map((seance) => (
                    <TableRow key={seance.id}>
                        <TableCell className="font-medium">
                            <Link href={route('seances.show', seance.id)} className="text-blue-600 hover:underline">
                                {seance.topic}
                            </Link>
                        </TableCell>
                        <TableCell className="font-medium">{seance.course?.name}</TableCell>
                        <TableCell className="font-medium">{seance.mentor?.name}</TableCell>
                        <TableCell className="font-medium">
                            {seance.scheduled_at ? format(new Date(seance.scheduled_at), 'PPP p') : 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                            <SeanceStatusBadge status={seance.status} />
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex items-center justify-end gap-6">
                                <Link className="flex items-center gap-1" href={route('seances.edit', seance.id)}>
                                    <Pencil className="w-4" /> {translations.seances?.data?.edit_button || 'Edit'}
                                </Link>
                                <Delete seance={seance} onDeleted={onDeleted} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Data;
