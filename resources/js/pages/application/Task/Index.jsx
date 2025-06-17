"use client";

import { useContext, useState } from "react";
import { TranslationContext } from '@/context/TranslationProvider';
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
  const { translations } = useContext(TranslationContext);
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
      <AppLayout breadcrumbs={[{ title: translations.tasks.list_title, href: '/tasks' }]}>
          <Head title={translations.tasks.page_title} />
          <div className="min-h-screen bg-white dark:bg-black">
              {/* Header Section */}
              <div className="">
                  <div className="px-6 py-8">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                          <div></div>

                          <div className="flex flex-1 items-center gap-4">
                              <div className="relative max-w-md flex-1">
                                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                  <Input
                                      className="border-[var(--backgorund)] pl-10 focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] dark:border-[var(background)]"
                                      type="text"
                                      placeholder={translations.tasks.search_placeholder}
                                      value={search}
                                      onChange={handleSearch}
                                  />
                              </div>
                          </div>
                          {/* Controls Section */}
                          <div className="bg-gray-50 dark:border-gray-800 dark:bg-black">
                              <div className="">
                                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                      {isAdmin && (
                                          <Link
                                              href={route('tasks.create')}
                                              className="flex items-center gap-2 rounded-lg bg-[var(--brand-color)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-color)]/90"
                                          >
                                              <Plus className="h-4 w-4" />
                                              {translations.tasks.add_new_button}
                                          </Link>
                                      )}
                                  </div>
                              </div>
                          </div>
                          {/* Stats */}
                          <div className="flex items-center space-x-8">
                              <div className="text-center">
                                  <div className="text-2xl font-bold text-black dark:text-white">{filteredTasks.length}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.total_tasks}</div>
                              </div>
                              <div className="text-center">
                                  <div className="text-2xl font-bold text-[var(--brand-color)]">
                                      {filteredTasks.filter((t) => t.status === 'in_progress').length}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.in_progress}</div>
                              </div>
                              <div className="text-center">
                                  <div className="text-2xl font-bold text-black dark:text-white">
                                      {filteredTasks.filter((t) => t.status === 'completed').length}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{translations.tasks.completed}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Content Section */}
              <div className="px-6 py-2">
                  <TaskData tasks={filteredTasks} onDeleted={handleDelete} auth={auth} />
              </div>
          </div>
      </AppLayout>
  );
}
