import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button'; // Import Button component
import { Pencil, Plus } from 'lucide-react'; // Import Pencil and Plus icon
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import Delete from './Delete';

function Data({ users, onDeleted, auth }) { // Added auth prop
    const { translations } = useContext(TranslationContext);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{translations.users.table_head_name}</TableHead>
                    <TableHead>{translations.users.table_head_specialities}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-medium">
                            <div className="flex flex-wrap gap-2">
                                {user.specialities.map((e, i) => (
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
                                <Link className="flex items-center gap-1"
                                href={route('users.edit', user.id)}
                                >
                                    <Pencil className="w-4" /> {translations.users.edit_button}
                                </Link>
                                <Delete user={user} onDeleted={onDeleted} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Data;
