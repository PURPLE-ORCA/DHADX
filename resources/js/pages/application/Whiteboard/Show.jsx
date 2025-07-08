import { Excalidraw } from '@excalidraw/excalidraw';
import { usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import '@excalidraw/excalidraw/index.css';
import axios from 'axios';

export default function Show({ whiteboard }) {
    const { auth } = usePage().props;
    const isOwner = auth.user.id === whiteboard.user_id;

    const [title, setTitle] = useState(whiteboard.title);
    const [isPublic, setIsPublic] = useState(whiteboard.is_public);
    const [saveStatus, setSaveStatus] = useState('Saved');

    const [currentTheme, setCurrentTheme] = useState('light');

    // This effect runs once when the component mounts to check the document's theme.
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setCurrentTheme(isDarkMode ? 'dark' : 'light');
    }, []); // Empty dependency array means it runs only once on mount

    const debouncedSave = useCallback(
        debounce((newSceneData) => {
            setSaveStatus('Saving...');
            axios.put(route('whiteboards.update', whiteboard.id), {
                scene_data: newSceneData,
            })
            .then(response => {
                setSaveStatus('Saved');
            })
            .catch(error => {
                console.error('Auto-save error:', error);
                setSaveStatus('Error!');
            });
        }, 1500),
        [whiteboard.id]
    );

    const handleExcalidrawChange = useCallback((elements, appState, files) => {
        if (isOwner) {
            // Instead of just sending appState...
            // We create the complete scene object that Excalidraw expects.
            const completeScene = {
                elements: elements,
                appState: appState,
                files: files // Might as well include files for future-proofing
            };

            // Now, we pass this complete object to our save function.
            debouncedSave(completeScene);
        }
    }, [isOwner, debouncedSave]);

    const handleTitleBlur = () => {
        setSaveStatus('Saving...');
        axios.put(route('whiteboards.update', whiteboard.id), { title: title })
            .then(() => setSaveStatus('Saved'))
            .catch(error => {
                console.error('Title update error:', error);
                setSaveStatus('Error!');
            });
    };


    return (
        <div className="flex flex-col h-screen">
            {isOwner && (
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="whiteboard-title" className="sr-only">Whiteboard Title</Label>
                        <Input
                            id="whiteboard-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            className="w-64 bg-white dark:bg-gray-900"
                        />
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is-public-toggle"
                                checked={isPublic}
                                onCheckedChange={() => {
                                    axios.patch(route('whiteboards.togglePublic', whiteboard.id))
                                        .then(response => {
                                            setIsPublic(response.data.is_public);
                                        });
                                }}
                            />
                            <Label htmlFor="is-public-toggle">
                                {isPublic ? 'Public' : 'Private'}
                            </Label>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {saveStatus}
                    </div>
                </div>
            )}

            <div className="flex-grow" style={{ height: 'calc(100vh - 5rem)' }}>
                <Excalidraw
                    initialData={{
                        elements: whiteboard.scene_data?.elements || [],
                        appState: whiteboard.scene_data?.appState || {},
                    }}
                    viewModeEnabled={!isOwner}
                    onChange={handleExcalidrawChange}
                    theme={currentTheme}
                />
            </div>
        </div>
    );
}
