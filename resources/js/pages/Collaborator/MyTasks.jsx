import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function MyTasks({ myCamps }) {
    return (
        <AppLayout>
            <Head title="My Tasks" />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

                {myCamps.length === 0 ? (
                    <p>You have no assigned camps or tasks at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCamps.map(camp => (
                            <Card key={camp.id}>
                                <CardHeader>
                                    <CardTitle>{camp.name}</CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {camp.cour ? camp.cour.name : 'N/A'} - {camp.formation ? camp.formation.name : 'N/A'}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                        Status: {camp.status}
                                    </p>
                                    <Separator className="my-4" />
                                    <h3 className="font-semibold mb-2">Tasks:</h3>
                                    {/* Assuming a camp might have associated tasks, if not, this part can be removed or adapted */}
                                    {/* For now, just showing camp details. If tasks are separate, they need to be passed */}
                                    <p>Details about tasks for this camp would go here.</p>
                                    {/* Example: Link to a detailed task view for this camp */}
                                    {/* <Link href={route('collaborator.camp.tasks', camp.id)} className="text-blue-500 hover:underline">View Tasks</Link> */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
