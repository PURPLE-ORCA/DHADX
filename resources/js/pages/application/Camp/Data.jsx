import CampCard from './CampCard';

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

    const handleCampDeletedForData = (deletedCampId) => {
        if (onDeleted) {
            onDeleted(deletedCampId);
        }
    };

    const handleCampUpdated = () => {
        console.log("A camp was updated, potentially refresh camps data");
        if (onDeleted) {
        }
    };

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
                                    <CampCard
                                        key={camp.id}
                                        camp={camp}
                                        courseColor={courseData.color}
                                        onCampUpdated={handleCampUpdated}
                                        onCampDeleted={handleCampDeletedForData}
                                    />
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
