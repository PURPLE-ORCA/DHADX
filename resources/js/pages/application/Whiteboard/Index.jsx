import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';

export default function Index({ whiteboards }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Whiteboards</h1>
                    <Link as="button" method="post" href={route('whiteboards.store')}>
                        <Button>Create New Whiteboard</Button>
                    </Link>
                </div>

                {whiteboards.length === 0 ? (
                    <p className="text-center text-gray-500">You haven't created any whiteboards yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {whiteboards.map((board) => (
                            <Card key={board.id} className="flex flex-col">
                                <CardHeader>
                                    <Link href={route('whiteboards.show', board.id)}>
                                        <CardTitle className="truncate">{board.title}</CardTitle>
                                    </Link>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Badge variant={board.is_public ? 'default' : 'secondary'}>{board.is_public ? 'Public' : 'Private'}</Badge>
                                        <span className="text-sm text-gray-500">Created: {format(new Date(board.created_at), 'MMM dd, yyyy')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {/* Add a preview or description here if available */}
                                    <p className="text-sm text-gray-600">{board.scene_data ? 'Contains content' : 'Empty whiteboard'}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end space-x-2">
                                    <Link
                                        as="button"
                                        method="delete"
                                        href={route('whiteboards.destroy', board.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Button variant="destructive" size="sm">
                                            Delete
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
