import { Card } from '@/components/ui/card';
import Delete from './Delete';

// Helper: Group by collaborator and course
function groupCamps(camps) {
    const groups = {};

    camps.forEach((camp) => {
        const collabName = camp.collaborator.name;
        const courName = camp.cour.name;

        if (!groups[collabName]) {
            groups[collabName] = {};
        }

        if (!groups[collabName][courName]) {
            groups[collabName][courName] = {
                label: camp.cour.label,
                color: camp.cour.color,
                items: [],
            };
        }

        groups[collabName][courName].items.push(camp);
    });

    return groups;
}

function Data({ camps, onDeleted }) {
    const grouped = groupCamps(camps);

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([collaboratorName, courses]) => (
                <div key={collaboratorName}>
                    <h2 className="mb-2 text-xl font-bold">{collaboratorName}</h2>

                    {Object.entries(courses).map(([courseName, courseData]) => (
                        <div key={courseName} className="mb-4 last:mb-0">
                            <h3 className="text-md mb-1 font-semibold text-neutral-700 dark:text-neutral-200">{courseName}</h3>
                            <small className="mb-2 block text-neutral-500 dark:text-neutral-400">{courseData.label}</small>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {courseData.items.map((camp) => (
                                    <Card key={camp.id} className="relative gap-0 border-l-2 p-4" style={{ borderLeftColor: courseData.color }}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{camp.formation.name}</span>
                                        </div>

                                        <div className="mt-4 h-fit overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            <div
                                                className="h-full rounded-full bg-red-600 text-center text-xs font-bold text-white transition-all duration-500"
                                                style={{ width: `${camp.progress}%` }}
                                            >
                                                <small>{camp.progress}%</small>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <Delete camp={camp} onDeleted={onDeleted} />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Data;
