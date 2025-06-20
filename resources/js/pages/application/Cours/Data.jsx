import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Delete from './Delete';
import { Icon } from '@iconify/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

function Data({ cours, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{translations.courses.data.table_head_name}</TableHead>
                    <TableHead>{translations.courses.data.table_head_label}</TableHead>
                    <TableHead>{translations.courses.data.table_head_color}</TableHead>
                    <TableHead>{translations.courses.data.table_head_formations}</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cours.map((cour) => (
                    <TableRow key={cour.id}>
                        <TableCell className="font-medium">{cour.name}</TableCell>
                        <TableCell className="font-medium">{cour.label}</TableCell>
                        <TableCell className="font-medium">
                            <div className="aspect-video w-5 rounded-full" style={{ backgroundColor: cour.color }}></div>
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex flex-wrap gap-2">
                                {cour.formations.map((formation, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-neutral-200 px-2 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    >
                                         {formation.icon_name && <Icon icon={formation.icon_name} className="w-5 h-5" />}
                                    </span>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex items-center justify-end gap-6">
                                <Link className="flex items-center gap-1" href={route('cours.edit', cour.id)}>
                                    <Pencil className="w-4" /> {translations.courses.data.edit_button}
                                </Link>
                                <Delete cour={cour} onDeleted={onDeleted} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default Data;
