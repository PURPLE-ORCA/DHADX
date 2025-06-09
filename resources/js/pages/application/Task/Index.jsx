import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TaskData from './TaskData';

const breadcrumbs = [
    {
        title: 'Tasks list',
        href: '/tasks',
    },
];

export default function Index({ tasks, auth }) {
    const [search, setSearch] = useState('');
    const [filteredTasks, setFilteredTasks] = useState(tasks);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = tasks.filter((task) => task.title.toLowerCase().includes(value));

        setFilteredTasks(filtered);
    };

    const handleDelete = (id) => {
        setFilteredTasks((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="h-full rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute top-[50%] h-4 w-4 translate-x-2 translate-y-[-50%] text-neutral-500" />
                        <Input className="pl-8" type="text" placeholder="Search task..." value={search} onChange={handleSearch} />
                    </div>
                    {auth.user.roles.some(role => role.name === 'admin') && (
                        <Link
                            href={route('tasks.create')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center rounded-md px-3 text-sm font-semibold shadow-xs has-[>svg]:px-2.5"
                        >
                            Add new
                        </Link>
                    )}
                </div>

                <TaskData tasks={filteredTasks} onDeleted={handleDelete} auth={auth} />
            </div>
        </AppLayout>
    );
}
