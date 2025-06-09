"use client";

import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from "lucide-react";
import TaskData from "./TaskData";

const breadcrumbs = [
  {
    title: "Tasks Hub",
    href: "/tasks",
  },
];

export default function Index({ tasks, auth }) {
  const [search, setSearch] = useState("");
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

  const isAdmin = auth.user.roles.some((role) => role.name === "admin");

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tasks Hub" />
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Tasks Hub</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAdmin ? "Manage and oversee all tasks" : "Track your assigned tasks and progress"}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black dark:text-white">{filteredTasks.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-color)]">
                    {filteredTasks.filter((t) => t.status === "in_progress").length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {filteredTasks.filter((t) => t.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]"
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {isAdmin && (
                <Link
                  href={route("tasks.create")}
                  className="bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Task
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8">
          <TaskData tasks={filteredTasks} onDeleted={handleDelete} auth={auth} />
        </div>
      </div>
    </AppLayout>
  );
}
