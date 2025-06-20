import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Delete from './Delete';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

function Data({ specialities, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{translations.specialities.data.table_head_name}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {specialities.map((speciality) => (
                    <TableRow key={speciality.id}>
                        <TableCell className="font-medium">{speciality.name}</TableCell>
                        <TableCell className="font-medium">
                            <div className="flex items-center justify-end gap-6">
                                <Link className="flex items-center gap-1" href={route('specialities.edit', speciality.id)}>
                                    <Pencil className="w-4" /> {translations.specialities.data.edit_button}
                                </Link>
                                <Delete speciality={speciality} onDeleted={onDeleted} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Data;
