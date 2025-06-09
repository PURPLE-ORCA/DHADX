import { Link } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { Eye, Pencil, Clock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import DeleteTask from "./DeleteTask";

export default function TaskData({ tasks, auth, onDeleted }) {
  const isAdmin = auth.user.roles.some((role) => role.name === "admin");

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        variant: "secondary",
        icon: Clock,
        color: "text-gray-600",
        bg: "bg-gray-100",
      },
      in_progress: {
        variant: "default",
        icon: AlertCircle,
        color: "text-[var(--brand-color)]",
        bg: "bg-[var(--brand-color)]/10",
      },
      submitted: {
        variant: "default",
        icon: CheckCircle2,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      completed: {
        variant: "default",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      needs_revision: {
        variant: "destructive",
        icon: AlertCircle,
        color: "text-orange-600",
        bg: "bg-orange-50",
      },
      overdue: {
        variant: "destructive",
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
      },
      cancelled: {
        variant: "outline",
        icon: Clock,
        color: "text-gray-400",
        bg: "bg-gray-50",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { variant: "secondary", color: "text-gray-600" },
      medium: { variant: "default", color: "text-[var(--brand-color)]" },
      high: { variant: "destructive", color: "text-red-600" },
    };
    return configs[priority] || configs.low;
  };

  const TaskCard = ({ task }) => {
    const statusConfig = getStatusConfig(task.status);
    const priorityConfig = getPriorityConfig(task.priority);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="group hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-black dark:text-white group-hover:text-[var(--brand-color)] transition-colors line-clamp-2">
              {task.title}
            </CardTitle>
            <Badge variant={priorityConfig.variant} className="ml-2 shrink-0">
              {task.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className={`flex items-center gap-2 p-2 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {task.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Due: {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "No due date"}</span>
          </div>

          {/* Assigner */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>Assigned by: {task.assigner?.name || "N/A"}</span>
          </div>

          {/* Action */}
          <Link href={route("tasks.show", task.id)}>
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-200 dark:border-gray-700 hover:bg-[var(--brand-color)] hover:text-white hover:border-[var(--brand-color)] transition-colors"
            >
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  const KanbanBoard = ({ tasks }) => {
    const statuses = ["pending", "in_progress", "submitted", "needs_revision", "completed", "overdue", "cancelled"];
    const tasksByStatus = statuses.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statuses.map((status) => {
          const statusConfig = getStatusConfig(status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={status} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                <h3 className="text-lg font-semibold text-black dark:text-white capitalize">{status.replace("_", " ")}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {tasksByStatus[status].length}
                </Badge>
              </div>

              <div className="space-y-3">
                {tasksByStatus[status].length > 0 ? (
                  tasksByStatus[status].map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
                      <StatusIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks in this status</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const AdminTableView = ({ tasks }) => (
    <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <TableHead className="font-semibold text-black dark:text-white">Title</TableHead>
              <TableHead className="font-semibold text-black dark:text-white">Assignee</TableHead>
              <TableHead className="font-semibold text-black dark:text-white">Assigner</TableHead>
              <TableHead className="font-semibold text-black dark:text-white">Due Date</TableHead>
              <TableHead className="font-semibold text-black dark:text-white">Status</TableHead>
              <TableHead className="font-semibold text-black dark:text-white">Priority</TableHead>
              <TableHead className="font-semibold text-black dark:text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);

              return (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <TableCell className="font-medium text-black dark:text-white">{task.title}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{task.assignee?.name || "N/A"}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{task.assigner?.name || "N/A"}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig.variant}
                      className={
                        task.status === "in_progress" ? "bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90" : ""
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityConfig.variant}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={route("tasks.show", task.id)}>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={route("tasks.edit", task.id)}>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteTask task={task} onDeleted={onDeleted} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-950">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {isAdmin ? "Create your first task to get started." : "No tasks match your current search criteria."}
          </p>
        </div>
      ) : isAdmin ? (
        <AdminTableView tasks={tasks} />
      ) : (
        <KanbanBoard tasks={tasks} />
      )}
    </>
  );
}
