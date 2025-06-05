import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Delete from './Delete';

function Data({ collaborators, onDeleted }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialities</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {collaborators.map((collaborator) => (
                    <TableRow key={collaborator.id}>
                        <TableCell className="font-medium">{collaborator.name}</TableCell>
                        <TableCell className="font-medium">
                            <div className="flex flex-wrap gap-2">
                                {collaborator.specialities.map((e, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-neutral-200 px-2 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    >
                                        # {e.name}
                                    </span>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex items-center justify-end gap-6">
                                <Link className="flex items-center gap-1" href={route('collaborators.edit', collaborator.id)}>
                                    <Pencil className="w-4" /> Edit
                                </Link>
                                <Delete collaborator={collaborator} onDeleted={onDeleted} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Data;
