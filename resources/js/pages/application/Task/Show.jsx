'use client';
import InputError from '@/components/input-error'; // Assuming you might need this for dialog
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/motion-primitives/dialog'; // Adjust path for motion-primitives dialog
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'; // Shadcn Textarea
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; // Removed useForm from here if not used for general actions
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle2, Clock, FileText, MessageSquare, Play, Send, Target, User, XCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react'; // Added useEffect
import { TranslationContext } from '@/context/TranslationProvider';

// Assuming useForm for comments is still needed
import { Link, useForm as useCommentForm } from '@inertiajs/react';

export default function Show({ task, auth }) {
    const { translations } = useContext(TranslationContext);
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');
    const isAssignee = auth.user.id === task.assignee_id;

    const {
        data: commentDataForForm, // Renamed to avoid confusion with revisionComment
        setData: setCommentDataForForm,
        post: postComment,
        processing: commentProcessing,
        errors: commentErrors,
        reset: resetCommentForm,
    } = useCommentForm({
        // Explicitly useCommentForm
        comment: '',
    });

    // State for the revision dialog
    const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
    const [revisionComment, setRevisionComment] = useState('');
    const [revisionCommentError, setRevisionCommentError] = useState(''); // For local validation
    const [actionProcessing, setActionProcessing] = useState(false); // For general status actions

    const handleAddComment = (e) => {
        e.preventDefault();
        postComment(route('tasks.storeComment', task.id), {
            onSuccess: () => resetCommentForm(),
        });
    };

    // General status action handler (for actions NOT needing a dialog comment)
    const handleSimpleStatusAction = (actionRoute) => {
        setActionProcessing(true);
        router.post(
            route(actionRoute, task.id),
            {},
            {
                // Empty data object
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => router.reload({ only: ['task'] }),
                onError: (errors) => console.error('Action failed', errors),
                onFinish: () => setActionProcessing(false),
            },
        );
    };

    // Handler for submitting the revision from the dialog
    const handleSubmitRevision = () => {
        if (!revisionComment.trim()) {
            setRevisionCommentError('Revision reason cannot be empty.');
            return;
        }
        setRevisionCommentError(''); // Clear error
        setActionProcessing(true);

        router.post(
            route('tasks.requestRevision', task.id),
            { comment: revisionComment },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    router.reload({ only: ['task'] });
                    setIsRevisionDialogOpen(false); // Close dialog
                    setRevisionComment(''); // Reset comment
                },
                onError: (errors) => {
                    console.error('Request Revision Action failed', errors);
                    if (errors.comment) {
                        setRevisionCommentError(errors.comment); // Show backend validation error
                    } else {
                        // Show a generic error toast/message
                    }
                },
                onFinish: () => {
                    setActionProcessing(false);
                },
            },
        );
    };

    // Reset revision comment when dialog closes
    useEffect(() => {
        if (!isRevisionDialogOpen) {
            setRevisionComment('');
            setRevisionCommentError('');
        }
    }, [isRevisionDialogOpen]);

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                variant: 'secondary',
                icon: Clock,
                color: 'text-gray-600',
                bg: 'bg-gray-100',
                label: translations.tasks.status.pending,
            },
            in_progress: {
                variant: 'default',
                icon: Play,
                color: 'text-[var(--brand-color)]',
                bg: 'bg-[var(--brand-color)]/10',
                label: translations.tasks.status.in_progress,
            },
            submitted: {
                variant: 'default',
                icon: Send,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                label: translations.tasks.status.submitted,
            },
            completed: {
                variant: 'default',
                icon: CheckCircle2,
                color: 'text-green-600',
                bg: 'bg-green-50',
                label: translations.tasks.status.completed,
            },
            needs_revision: {
                variant: 'destructive',
                icon: AlertCircle,
                color: 'text-orange-600',
                bg: 'bg-orange-50',
                label: translations.tasks.status.needs_revision,
            },
            overdue: {
                variant: 'destructive',
                icon: AlertCircle,
                color: 'text-red-600',
                bg: 'bg-red-50',
                label: translations.tasks.status.overdue,
            },
            cancelled: {
                variant: 'outline',
                icon: XCircle,
                color: 'text-gray-400',
                bg: 'bg-gray-50',
                label: translations.tasks.status.cancelled,
            },
        };
        return configs[status] || configs.pending;
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            low: { variant: 'secondary', color: 'text-gray-600', label: translations.tasks.priority.low },
            medium: { variant: 'default', color: 'text-[var(--brand-color)]', label: translations.tasks.priority.medium },
            high: { variant: 'destructive', color: 'text-red-600', label: translations.tasks.priority.high },
        };
        return configs[priority] || configs.low;
    };

    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);
    const StatusIcon = statusConfig.icon;

    // Define variants for motion-primitives dialog (example)
    const dialogVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95, y: 20 }, // Example custom exit
    };
    const dialogTransition = { duration: 0.3, ease: 'anticipate' };

    return (
        <AppLayout>
            <Head title={translations.tasks.show.page_title.replace(':task_title', task.title)} />
            <div className="min-h-screen bg-white dark:bg-black">
                {/* Header Section */}
                <div className="bg-white dark:bg-black">
                    <div className="px-6 py-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                {task.parent && (
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        {translations.tasks.show.part_of}:{' '}
                                        <Link href={route('tasks.show', task.parent.id)} className="text-[var(--brand-color)] hover:underline">
                                            {task.parent.title}
                                        </Link>
                                    </p>
                                )}
                                <h1 className="mb-4 text-4xl leading-tight font-bold text-black dark:text-white">{task.title}</h1>

                                <div className="mb-4 flex flex-wrap items-center gap-3">
                                    <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${statusConfig.bg}`}>
                                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                                        <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                                    </div>
                                    <Badge variant={priorityConfig.variant} className="px-3 py-1">
                                        {priorityConfig.label}
                                    </Badge>
                                </div>

                                <p className="max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                                    {task.description || translations.tasks.show.no_description_provided}
                                </p>

                                {task.sub_tasks && task.sub_tasks.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">{translations.tasks.show.sub_tasks_heading}</h2>
                                        <div className="space-y-4">
                                            {task.sub_tasks.map((subTask) => (
                                                <Card
                                                    key={subTask.id}
                                                    className="bg-white transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-xl dark:bg-[var(--background)]"
                                                >
                                                    <CardContent className="p-4">
                                                        <Link href={route('tasks.show', subTask.id)} className="block">
                                                            <h3 className="text-lg font-semibold text-black hover:text-[var(--brand-color)] dark:text-white">
                                                                {subTask.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <User className="h-4 w-4" />
                                                                <span>{subTask.assignee?.name || translations.tasks.show.unassigned}</span>
                                                                <Badge variant={getStatusConfig(subTask.status).variant} className="ml-auto">
                                                                    {getStatusConfig(subTask.status).label}
                                                                </Badge>
                                                            </div>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="min-w-[280px] rounded-xl bg-gray-50 p-6 dark:bg-black">
                                <h3 className="mb-4 font-semibold text-black dark:text-white">{translations.tasks.show.task_details_heading}</h3>
                                <div className="space-y-3">

                                    <div className="flex items-center gap-3">
                                        <Target className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.assigner_label}</div>
                                            <div className="font-medium text-black dark:text-white">{task.assigner?.name || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.due_date_label}</div>
                                            <div className="font-medium text-black dark:text-white">
                                                {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : translations.tasks.show.no_due_date}
                                            </div>
                                        </div>
                                    </div>
                                    {task.submitted_at && (
                                        <div className="flex items-center gap-3">
                                            <Send className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.submitted_label}</div>
                                                <div className="font-medium text-black dark:text-white">
                                                    {format(new Date(task.submitted_at), "MMM dd, yyyy 'at' h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {task.completed_at && (
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.completed_label}</div>
                                                <div className="font-medium text-black dark:text-white">
                                                    {format(new Date(task.completed_at), "MMM dd, yyyy 'at' h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 py-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="space-y-8 lg:col-span-2">
                                {/* Actions Card */}
                                <Card className="rounded-xl border border-white/20 bg-[var(--backgorund)] shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                            <Target className="h-5 w-5" />
                                            {translations.tasks.show.available_actions_heading}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-3">
                                            {isAssignee && task.status === 'pending' && (
                                                <Button
                                                    onClick={() => handleSimpleStatusAction('tasks.startProgress')}
                                                    disabled={actionProcessing}
                                                    className="bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90"
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    {translations.tasks.show.start_progress_button}
                                                </Button>
                                            )}
                                            {isAssignee && task.status === 'in_progress' && (
                                                <Button
                                                    onClick={() => handleSimpleStatusAction('tasks.submitForReview')}
                                                    disabled={actionProcessing}
                                                    className="bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90"
                                                >
                                                    <Send className="mr-2 h-4 w-4" />
                                                    {translations.tasks.show.submit_for_review_button}
                                                </Button>
                                            )}
                                            {isAdmin && task.status === 'submitted' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleSimpleStatusAction('tasks.approveCompletion')}
                                                        disabled={actionProcessing}
                                                        className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                                    >
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        {translations.tasks.show.approve_completion_button}
                                                    </Button>

                                                    {/* MODIFIED "REQUEST REVISION" BUTTON */}
                                                    <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="destructive" disabled={actionProcessing}>
                                                                <AlertCircle className="mr-2 h-4 w-4" />
                                                                {translations.tasks.show.request_revision_button}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent
                                                            className="border-neutral-200 bg-white p-6 sm:max-w-[425px] dark:border-neutral-800 dark:bg-neutral-900" // Added p-6
                                                            variants={dialogVariants}
                                                            transition={dialogTransition}
                                                        >
                                                            <DialogHeader className="mb-4">
                                                                {' '}
                                                                {/* Added margin bottom to header */}
                                                                <DialogTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                                                    {' '}
                                                                    {/* Styled Title */}
                                                                    {translations.tasks.show.request_revision_dialog_title}
                                                                </DialogTitle>
                                                                <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                    {' '}
                                                                    {/* Styled Description */}
                                                                    {translations.tasks.show.request_revision_dialog_description}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4">
                                                                {' '}
                                                                {/* Removed py-4, padding is on DialogContent now */}
                                                                <Textarea
                                                                    placeholder={translations.tasks.show.enter_reason_placeholder}
                                                                    value={revisionComment}
                                                                    onChange={(e) => {
                                                                        setRevisionComment(e.target.value);
                                                                        if (e.target.value.trim()) setRevisionCommentError('');
                                                                    }}
                                                                    rows={4}
                                                                    className="focus:border-primary focus:ring-primary w-full rounded-md border-neutral-300 bg-white p-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500" // More specific styling
                                                                />
                                                                {revisionCommentError && (
                                                                    <InputError message={revisionCommentError} className="mt-1 text-xs" />
                                                                )}{' '}
                                                                {/* Styled error */}
                                                            </div>
                                                            <div className="mt-6 flex justify-end gap-3">
                                                                {' '}
                                                                {/* Added mt-6 for spacing, gap-3 */}
                                                                <DialogClose asChild>
                                                                    {/* Standard Shadcn button styling for outline */}
                                                                    <Button
                                                                        variant="outline"
                                                                        className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                                    >
                                                                        {translations.tasks.show.cancel_button}
                                                                    </Button>
                                                                </DialogClose>
                                                                {/* Standard Shadcn button styling for primary */}
                                                                <Button
                                                                    onClick={handleSubmitRevision}
                                                                    disabled={actionProcessing || !revisionComment.trim()}
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                                >
                                                                    {actionProcessing ? translations.tasks.show.submitting_button : translations.tasks.show.submit_revision_button}
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </>
                                            )}
                                            {isAdmin && ['pending', 'in_progress', 'submitted', 'needs_revision'].includes(task.status) && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSimpleStatusAction('tasks.cancelTask')}
                                                    disabled={actionProcessing}
                                                    className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    {translations.tasks.show.cancel_task_button}
                                                </Button>
                                            )}
                                        </div>
                                        {!isAssignee && !isAdmin && (
                                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                                {translations.tasks.show.no_permission_message}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Comments Section */}
                                <Card className="rounded-xl border border-white/20 bg-white/30 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                            <MessageSquare className="h-5 w-5" />
                                            {translations.tasks.show.comments_heading.replace(':count', task.comments.length)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Comments List */}
                                        <div className="space-y-4">
                                            {task.comments.length > 0 ? (
                                                task.comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="rounded-lg border border-neutral-200/50 bg-neutral-100/50 p-4 dark:border-neutral-700/50 dark:bg-neutral-900/60"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                                                                    <span className="text-sm font-medium">
                                                                        {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                                                                    </span>
                                                                </div>
                                                                <span className="font-medium text-neutral-800 dark:text-neutral-100">
                                                                    {comment.user?.name || translations.tasks.show.unknown_user}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                {format(new Date(comment.created_at), "MMM dd, yyyy 'at' h:mm a")}
                                                            </span>
                                                        </div>
                                                        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{comment.comment}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center">
                                                    <MessageSquare className="mx-auto mb-3 h-12 w-12 text-neutral-400 dark:text-neutral-600" />
                                                    <p className="text-neutral-500 dark:text-gray-400">{translations.tasks.show.no_comments_yet}</p>
                                                </div>
                                            )}
                                        </div>

                                        <Separator className="bg-neutral-300/50 dark:bg-neutral-700/50" />

                                        {/* Add Comment Form */}
                                        <form onSubmit={handleAddComment} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                                    {translations.tasks.show.add_comment_label}
                                                </label>
                                                <Textarea
                                                    value={commentDataForForm.comment}
                                                    onChange={(e) => setCommentDataForForm('comment', e.target.value)}
                                                    placeholder={translations.tasks.show.share_thoughts_placeholder}
                                                    rows={4}
                                                    className="focus:border-primary focus:ring-primary border-neutral-300 bg-white/70 dark:border-neutral-600 dark:bg-neutral-800/70 dark:text-neutral-100"
                                                />
                                                <InputError message={commentErrors.comment} className="mt-2" />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={commentProcessing || !commentDataForForm.comment.trim()}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                {commentProcessing ? translations.tasks.show.adding_comment_button : translations.tasks.show.add_comment_button}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Task Timeline */}
                                <Card className="rounded-xl border border-white/20 bg-white/30 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                            <Clock className="h-5 w-5" />
                                            {translations.tasks.show.timeline_heading}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="dark:bg-blackrounded-full h-2 w-2 bg-gray-300"></div>
                                                <div>
                                                    <div className="text-sm font-medium text-black dark:text-white">{translations.tasks.show.task_created}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {format(new Date(task.created_at), 'MMM dd, yyyy')}
                                                    </div>
                                                </div>
                                            </div>

                                            {task.status !== 'pending' && (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-[var(--brand-color)]"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-black dark:text-white">{translations.tasks.show.in_progress_timeline}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{translations.tasks.show.status_updated}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {task.submitted_at && (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-700"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-black dark:text-white">{translations.tasks.show.submitted_timeline}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {format(new Date(task.submitted_at), 'MMM dd, yyyy')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {task.completed_at && (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-700"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-black dark:text-white">{translations.tasks.show.completed_timeline}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {format(new Date(task.completed_at), 'MMM dd, yyyy')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Info */}
                                <Card className="rounded-xl border border-white/20 bg-white/30 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-800/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                            <FileText className="h-5 w-5" />
                                            {translations.tasks.show.quick_info_heading}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.task_id_label}</div>
                                            <div className="font-mono text-sm text-black dark:text-white">#{task.id}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.created_label}</div>
                                            <div className="text-sm text-black dark:text-white">
                                                {format(new Date(task.created_at), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.show.last_updated_label}</div>
                                            <div className="text-sm text-black dark:text-white">
                                                {format(new Date(task.updated_at), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
