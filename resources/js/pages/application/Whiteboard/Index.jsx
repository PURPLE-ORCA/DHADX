import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { AnimatedBackground } from '@/components/motion-primitives/animated-background'; 

export default function Index({ myWhiteboards, publicWhiteboards }) {
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'public'
    const { auth } = usePage().props;

    const TABS = [
        { id: 'my', label: 'My Whiteboards' },
        { id: 'public', label: 'Public Whiteboards' },
    ];

    // Determine which list of boards to display
    const displayedBoards = activeTab === 'my' ? myWhiteboards : publicWhiteboards;

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Whiteboards</h1>
                    {/* Only show the create button on the "My Whiteboards" tab */}
                    {activeTab === 'my' && (
                        <Link as="button" method="post" href={route('whiteboards.store')}>
                            <Button>Create New Whiteboard</Button>
                        </Link>
                    )}
                </div>

                {/* Tab/Segmented Control */}
                <div className="mb-6 flex justify-center">
                    <AnimatedBackground
                        defaultValue={activeTab}
                        onValueChange={setActiveTab}
                        className="rounded-full bg-neutral-100 p-1 dark:bg-neutral-800 flex"
                        enableHover={false}
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                data-id={tab.id}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none
                                            ${activeTab === tab.id
                                                ? 'text-black dark:text-white'
                                                : 'text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                                            }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </AnimatedBackground>
                </div>

                {/* Grid of Whiteboards */}
                {displayedBoards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedBoards.map(board => (
                            <Card key={board.id} className="flex flex-col">
                                <CardHeader>
                                    <Link href={route('whiteboards.show', board.id)}>
                                        <CardTitle className="truncate">{board.title}</CardTitle>
                                    </Link>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Badge variant={board.is_public ? 'default' : 'secondary'}>{board.is_public ? 'Public' : 'Private'}</Badge>
                                        {activeTab === 'public' && board.user && (
                                            <span className="text-sm text-gray-500">By {board.user.name}</span>
                                        )}
                                        <span className="text-sm text-gray-500">Created: {format(new Date(board.created_at), 'MMM dd, yyyy')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {/* Add a preview or description here if available */}
                                    <p className="text-sm text-gray-600">{board.scene_data ? 'Contains content' : 'Empty whiteboard'}</p>
                                </CardContent>
                                {activeTab === 'my' && (
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
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {activeTab === 'my'
                                ? "You haven't created any whiteboards yet."
                                : "There are no public whiteboards to display."}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
