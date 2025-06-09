import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

export default function Show({ task, auth }) {
    const isAdmin = auth.user.roles.some(role => role.name === 'admin');
    const isAssignee = auth.user.id === task.assignee_id;
    const isAssigner = auth.user.id === task.assigner_id;

    const { data: commentData, setData: setCommentData, post: postComment, processing: commentProcessing, errors: commentErrors, reset: resetComment } = useForm({
        comment: '',
    });

    const { post: postAction, processing: actionProcessing } = useForm({});

    const handleAddComment = (e) => {
        e.preventDefault();
        postComment(route('tasks.storeComment', task.id), {
            onSuccess: () => resetComment(),
        });
    };

    const handleStatusAction = (actionRoute, comment = null) => {
        postAction(route(actionRoute, task.id), {
            data: comment ? { comment } : {},
            onSuccess: () => {
                // Optionally refresh the page or update task data
            },
        });
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'in_progress':
                return 'default';
            case 'submitted':
                return 'info';
            case 'completed':
                return 'success';
            case 'needs_revision':
                return 'warning';
            case 'overdue':
                return 'destructive';
            case 'cancelled':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case 'low':
                return 'secondary';
            case 'medium':
                return 'default';
            case 'high':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Task Details</h2>}
        >
            <Head title={task.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">{task.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={getStatusBadgeVariant(task.status)}>{task.status.replace('_', ' ')}</Badge>
                                <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="text-gray-900 dark:text-gray-100">
                            <p className="mb-4">{task.description || 'No description provided.'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>Assignee:</strong> {task.assignee?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>Assigner:</strong> {task.assigner?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>Due Date:</strong> {task.due_date ? format(new Date(task.due_date), 'PPP') : 'N/A'}
                            </p>
                            {task.submitted_at && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <strong>Submitted At:</strong> {format(new Date(task.submitted_at), 'PPP p')}
                                </p>
                            )}
                            {task.completed_at && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <strong>Completed At:</strong> {format(new Date(task.completed_at), 'PPP p')}
                                </p>
                            )}

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Actions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {isAssignee && task.status === 'pending' && (
                                        <Button onClick={() => handleStatusAction('tasks.startProgress')} disabled={actionProcessing}>
                                            Mark In Progress
                                        </Button>
                                    )}
                                    {isAssignee && task.status === 'in_progress' && (
                                        <Button onClick={() => handleStatusAction('tasks.submitForReview')} disabled={actionProcessing}>
                                            Submit for Review
                                        </Button>
                                    )}
                                    {isAdmin && task.status === 'submitted' && (
                                        <>
                                            <Button onClick={() => handleStatusAction('tasks.approveCompletion')} disabled={actionProcessing}>
                                                Approve Completion
                                            </Button>
                                            <Button variant="destructive" onClick={() => {
                                                const comment = prompt('Enter reason for revision:');
                                                if (comment) handleStatusAction('tasks.requestRevision', comment);
                                            }} disabled={actionProcessing}>
                                                Request Revision
                                            </Button>
                                        </>
                                    )}
                                    {isAdmin && ['pending', 'in_progress', 'submitted', 'needs_revision'].includes(task.status) && (
                                        <Button variant="outline" onClick={() => handleStatusAction('tasks.cancelTask')} disabled={actionProcessing}>
                                            Cancel Task
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Comments</h3>
                                <div className="space-y-4">
                                    {task.comments.length > 0 ? (
                                        task.comments.map(comment => (
                                            <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                                <p className="text-sm font-semibold">{comment.user?.name || 'Unknown User'}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.comment}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {format(new Date(comment.created_at), 'PPP p')}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>
                                    )}
                                </div>

                                <form onSubmit={handleAddComment} className="mt-4 space-y-2">
                                    <Textarea
                                        value={commentData.comment}
                                        onChange={(e) => setCommentData('comment', e.target.value)}
                                        placeholder="Add a comment..."
                                        rows="3"
                                    />
                                    <InputError message={commentErrors.comment} className="mt-2" />
                                    <Button type="submit" disabled={commentProcessing}>
                                        Add Comment
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
