import AppLayout from '@/layouts/app-layout';
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, GraduationCap } from "lucide-react";

export default function MyTasks({ myCamps }) {
  return (
    <AppLayout>
      <Head title="My Tasks" />
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header Section */}
        <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">My Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your assigned camps and tasks</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-black dark:text-white">{myCamps.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Camps</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-8">
          {myCamps.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">No tasks assigned</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                You have no assigned camps or tasks at the moment. Check back later for new assignments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCamps.map((camp) => (
                <Card
                  key={camp.id}
                  className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-black dark:text-white group-hover:text-[var(--brand-color)] transition-colors">
                        {camp.name}
                      </CardTitle>
                      <Badge
                        variant={camp.status === "active" ? "default" : "secondary"}
                        className={
                          camp.status === "active" ? "bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/90" : ""
                        }
                      >
                        {camp.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Course and Formation Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{camp.cour ? camp.cour.name : "No course assigned"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{camp.formation ? camp.formation.name : "No formation assigned"}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-800"></div>

                    {/* Tasks Section */}
                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">Tasks Overview</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Task details and progress for this camp will be displayed here.
                        </p>
                        <button className="text-sm font-medium text-[var(--brand-color)] hover:underline">
                          View all tasks →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
