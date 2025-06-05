import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Delete from './Delete';

function Data({ specialities, onDeleted }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
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
                                    <Pencil className="w-4" /> Edit
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
