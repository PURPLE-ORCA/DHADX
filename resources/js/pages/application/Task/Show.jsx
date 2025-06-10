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
      data: comment ? { comment } : {},
      onSuccess: () => {
        // Optionally refresh the page or update task data
      },
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
        <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
          <div className="px-6 py-8">
  

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-black dark:text-white mb-4 leading-tight">{task.title}</h1>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                  </div>
                  <Badge variant={priorityConfig.variant} className="px-3 py-1">
                    {priorityConfig.label}
                  </Badge>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 dark:bg-black rounded-xl p-6 min-w-[280px]">
                <h3 className="font-semibold text-black dark:text-white mb-4">Task Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Assignee</div>
                      <div className="font-medium text-black dark:text-white">{task.assignee?.name || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Assigner</div>
                      <div className="font-medium text-black dark:text-white">{task.assigner?.name || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Due Date</div>
                      <div className="font-medium text-black dark:text-white">
                        {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "No due date"}
                      </div>
                    </div>
                  </div>
                  {task.submitted_at && (
                    <div className="flex items-center gap-3">
                      <Send className="w-4 h-4 text-gray-400" />
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
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Actions Card */}
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                      <Target className="w-5 h-5" />
                      Available Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {isAssignee && task.status === "pending" && (
                        <Button
                          onClick={() => handleStatusAction("tasks.startProgress")}
                          disabled={actionProcessing}
                          className="bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Progress
                        </Button>
                      )}
                      {isAssignee && task.status === "in_progress" && (
                        <Button
                          onClick={() => handleStatusAction("tasks.submitForReview")}
                          disabled={actionProcessing}
                          className="bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit for Review
                        </Button>
                      )}
                      {isAdmin && task.status === "submitted" && (
                        <>
                          <Button
                            onClick={() => handleStatusAction("tasks.approveCompletion")}
                            disabled={actionProcessing}
                            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve Completion
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const comment = prompt("Enter reason for revision:")
                              if (comment) handleStatusAction("tasks.requestRevision", comment)
                            }}
                            disabled={actionProcessing}
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                        </>
                      )}
                      {isAdmin && ["pending", "in_progress", "submitted", "needs_revision"].includes(task.status) && (
                        <Button
                          variant="outline"
                          onClick={() => handleStatusAction("tasks.cancelTask")}
                          disabled={actionProcessing}
                          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Task
                        </Button>
                      )}
                    </div>
                    {!isAssignee && !isAdmin && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                        You don't have permission to perform actions on this task.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                      <MessageSquare className="w-5 h-5" />
                      Comments ({task.comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Comments List */}
                    <div className="space-y-4">
                      {task.comments.length > 0 ? (
                        task.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 dark:bg-blackrounded-lg p-4 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[var(--brand-color)] rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {comment.user?.name?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <span className="font-medium text-black dark:text-white">{comment.user?.name || "Unknown User"}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(comment.created_at), "MMM dd, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to add one!</p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-200 dark:bg-black" />

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-2">Add a comment</label>
                        <Textarea
                          value={commentData.comment}
                          onChange={(e) => setCommentData("comment", e.target.value)}
                          placeholder="Share your thoughts, updates, or questions..."
                          rows={4}
                          className="border-gray-200 dark:border-gray-700 focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                        />
                        <InputError message={commentErrors.comment} className="mt-2" />
                      </div>
                      <Button
                        type="submit"
                        disabled={commentProcessing || !commentData.comment.trim()}
                        className="bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {commentProcessing ? "Adding..." : "Add Comment"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Task Timeline */}
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                      <Clock className="w-5 h-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 dark:bg-blackrounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-black dark:text-white">Task Created</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(task.created_at), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>

                      {task.status !== "pending" && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[var(--brand-color)] rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-black dark:text-white">In Progress</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Status updated</div>
                          </div>
                        </div>
                      )}

                      {task.submitted_at && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-700 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-black dark:text-white">Submitted</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(task.submitted_at), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      )}

                      {task.completed_at && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 dark:bg-green-700 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-black dark:text-white">Completed</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(task.completed_at), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                      <FileText className="w-5 h-5" />
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
                      <div className="text-sm text-black dark:text-white">{format(new Date(task.created_at), "MMM dd, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                      <div className="text-sm text-black dark:text-white">{format(new Date(task.updated_at), "MMM dd, yyyy")}</div>
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
