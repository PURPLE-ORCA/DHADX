"use client";
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { format } from "date-fns";
import {
  Calendar,
  User,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Play,
  Send,
  XCircle,
  FileText,
  Target,
} from "lucide-react";

export default function Show({ task, auth }) {
  const isAdmin = auth.user.roles.some((role) => role.name === "admin");
  const isAssignee = auth.user.id === task.assignee_id;

  const {
    data: commentData,
    setData: setCommentData,
    post: postComment,
    processing: commentProcessing,
    errors: commentErrors,
    reset: resetComment,
  } = useForm({
    comment: "",
  });

  const { post: postAction, processing: actionProcessing } = useForm({});

  const handleAddComment = (e) => {
    e.preventDefault();
    postComment(route("tasks.storeComment", task.id), {
      onSuccess: () => resetComment(),
    });
  };

  const handleStatusAction = (actionRoute, comment = null) => {
    postAction(route(actionRoute, task.id), {
        data: actionRoute === 'tasks.requestRevision' && comment ? { comment } : {},
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            router.reload({ only: ['task'] });
            // Optionally, show a success toast here if you're using Sonner/react-hot-toast
            // toast.success("Task status updated!");
        },
        onError: (errors) => {
            console.error("Action failed", errors);
            // Optionally show an error toast
            // toast.error("Failed to update task status.");
        }
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        variant: "secondary",
        icon: Clock,
        color: "text-gray-600",
        bg: "bg-gray-100",
        label: "Pending",
      },
      in_progress: {
        variant: "default",
        icon: Play,
        color: "text-[var(--brand-color)]",
        bg: "bg-[var(--brand-color)]/10",
        label: "In Progress",
      },
      submitted: {
        variant: "default",
        icon: Send,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "Submitted",
      },
      completed: {
        variant: "default",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "Completed",
      },
      needs_revision: {
        variant: "destructive",
        icon: AlertCircle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        label: "Needs Revision",
      },
      overdue: {
        variant: "destructive",
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        label: "Overdue",
      },
      cancelled: {
        variant: "outline",
        icon: XCircle,
        color: "text-gray-400",
        bg: "bg-gray-50",
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { variant: "secondary", color: "text-gray-600", label: "Low Priority" },
      medium: { variant: "default", color: "text-[var(--brand-color)]", label: "Medium Priority" },
      high: { variant: "destructive", color: "text-red-600", label: "High Priority" },
    };
    return configs[priority] || configs.low;
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = statusConfig.icon;

  return (
      <AppLayout>
          <Head title={task.title} />
          <div className="min-h-screen bg-white dark:bg-black">
              {/* Header Section */}
              <div className="bg-white dark:bg-black">
                  <div className="px-6 py-8">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
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
                                  {task.description || 'No description provided.'}
                              </p>
                          </div>

                          {/* Quick Stats */}
                          <div className="min-w-[280px] rounded-xl bg-gray-50 p-6 dark:bg-black">
                              <h3 className="mb-4 font-semibold text-black dark:text-white">Task Details</h3>
                              <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                      <User className="h-4 w-4 text-gray-400" />
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Assignee</div>
                                          <div className="font-medium text-black dark:text-white">{task.assignee?.name || 'N/A'}</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <Target className="h-4 w-4 text-gray-400" />
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Assigner</div>
                                          <div className="font-medium text-black dark:text-white">{task.assigner?.name || 'N/A'}</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Due Date</div>
                                          <div className="font-medium text-black dark:text-white">
                                              {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                                          </div>
                                      </div>
                                  </div>
                                  {task.submitted_at && (
                                      <div className="flex items-center gap-3">
                                          <Send className="h-4 w-4 text-gray-400" />
                                          <div>
                                              <div className="text-sm text-gray-500 dark:text-gray-400">Submitted</div>
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
                                              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
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
                                          Available Actions
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="flex flex-wrap gap-3">
                                          {isAssignee && task.status === 'pending' && (
                                              <Button
                                                  onClick={() => handleStatusAction('tasks.startProgress')}
                                                  disabled={actionProcessing}
                                                  className="bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90"
                                              >
                                                  <Play className="mr-2 h-4 w-4" />
                                                  Start Progress
                                              </Button>
                                          )}
                                          {isAssignee && task.status === 'in_progress' && (
                                              <Button
                                                  onClick={() => handleStatusAction('tasks.submitForReview')}
                                                  disabled={actionProcessing}
                                                  className="bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90"
                                              >
                                                  <Send className="mr-2 h-4 w-4" />
                                                  Submit for Review
                                              </Button>
                                          )}
                                          {isAdmin && task.status === 'submitted' && (
                                              <>
                                                  <Button
                                                      onClick={() => handleStatusAction('tasks.approveCompletion')}
                                                      disabled={actionProcessing}
                                                      className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                                  >
                                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                                      Approve Completion
                                                  </Button>
                                                  <Button
                                                      variant="destructive"
                                                      onClick={() => {
                                                          const comment = prompt('Enter reason for revision:');
                                                          if (comment) handleStatusAction('tasks.requestRevision', comment);
                                                      }}
                                                      disabled={actionProcessing}
                                                  >
                                                      <AlertCircle className="mr-2 h-4 w-4" />
                                                      Request Revision
                                                  </Button>
                                              </>
                                          )}
                                          {isAdmin && ['pending', 'in_progress', 'submitted', 'needs_revision'].includes(task.status) && (
                                              <Button
                                                  variant="outline"
                                                  onClick={() => handleStatusAction('tasks.cancelTask')}
                                                  disabled={actionProcessing}
                                                  className="border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                              >
                                                  <XCircle className="mr-2 h-4 w-4" />
                                                  Cancel Task
                                              </Button>
                                          )}
                                      </div>
                                      {!isAssignee && !isAdmin && (
                                          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                              You don't have permission to perform actions on this task.
                                          </p>
                                      )}
                                  </CardContent>
                              </Card>

                              {/* Comments Section */}
                              <Card className="rounded-xl border border-white/20 bg-white/30 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-800/50">
                                  <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                          <MessageSquare className="h-5 w-5" />
                                          Comments ({task.comments.length})
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
                                                                  {comment.user?.name || 'Unknown User'}
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
                                                  <p className="text-neutral-500 dark:text-gray-400">No comments yet. Be the first to add one!</p>
                                              </div>
                                          )}
                                      </div>

                                      <Separator className="bg-neutral-300/50 dark:bg-neutral-700/50" />

                                      {/* Add Comment Form */}
                                      <form onSubmit={handleAddComment} className="space-y-4">
                                          <div>
                                              <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                                  Add a comment
                                              </label>
                                              <Textarea
                                                  value={commentData.comment}
                                                  onChange={(e) => setCommentData('comment', e.target.value)}
                                                  placeholder="Share your thoughts, updates, or questions..."
                                                  rows={4}
                                                  className="focus:border-primary focus:ring-primary border-neutral-300 bg-white/70 dark:border-neutral-600 dark:bg-neutral-800/70 dark:text-neutral-100"
                                              />
                                              <InputError message={commentErrors.comment} className="mt-2" />
                                          </div>
                                          <Button
                                              type="submit"
                                              disabled={commentProcessing || !commentData.comment.trim()}
                                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                                          >
                                              <MessageSquare className="mr-2 h-4 w-4" />
                                              {commentProcessing ? 'Adding...' : 'Add Comment'}
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
                                          Timeline
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="space-y-4">
                                          <div className="flex items-center gap-3">
                                              <div className="dark:bg-blackrounded-full h-2 w-2 bg-gray-300"></div>
                                              <div>
                                                  <div className="text-sm font-medium text-black dark:text-white">Task Created</div>
                                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                                      {format(new Date(task.created_at), 'MMM dd, yyyy')}
                                                  </div>
                                              </div>
                                          </div>

                                          {task.status !== 'pending' && (
                                              <div className="flex items-center gap-3">
                                                  <div className="h-2 w-2 rounded-full bg-[var(--brand-color)]"></div>
                                                  <div>
                                                      <div className="text-sm font-medium text-black dark:text-white">In Progress</div>
                                                      <div className="text-xs text-gray-500 dark:text-gray-400">Status updated</div>
                                                  </div>
                                              </div>
                                          )}

                                          {task.submitted_at && (
                                              <div className="flex items-center gap-3">
                                                  <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-700"></div>
                                                  <div>
                                                      <div className="text-sm font-medium text-black dark:text-white">Submitted</div>
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
                                                      <div className="text-sm font-medium text-black dark:text-white">Completed</div>
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
                                          Quick Info
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Task ID</div>
                                          <div className="font-mono text-sm text-black dark:text-white">#{task.id}</div>
                                      </div>
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                                          <div className="text-sm text-black dark:text-white">
                                              {format(new Date(task.created_at), 'MMM dd, yyyy')}
                                          </div>
                                      </div>
                                      <div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
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
