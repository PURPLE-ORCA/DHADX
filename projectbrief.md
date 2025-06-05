# Project Brief: DHADX - The Collaborator Corral

## 1. Project Title:
DHADXTRACK Pronounced "Dhaddix"

## 2. Objective/Purpose:
To stop admins from losing their minds (and spreadsheets) trying to track what the heck our "collaborators" (read: interns, newbies, code-curious individuals) are actually learning. We're building a digital sheepdog to herd these collaborators through their designated "Formations" within various "Cours."

## 3. Scope:

### In Scope (What We're Actually Building, Probably):
*   **Admin Overlord Dashboard:** A central hub for admins to gaze upon their domain.
*   **Collaborator Catalog:** Adding, viewing, and maybe even acknowledging the existence of collaborators.
*   **Curriculum Construction Kit:**
    *   Defining "Cours" 
    *   Defining "Formations" within those Cours .
    *   Linking formations to courses 
*   **"Camp" Creation & Tracking:**
    *   "Enrolling" a collaborator into a Cour, which spawns "Camps" for each Formation. A "Camp" is basically a record of "Person X vs. Formation Y."
    *   Displaying these Camps, grouped by collaborator and then by course, because otherwise, it's chaos.
    *   Visual progress bars for each Camp because pictures are easier than reading.
    *   **Manual Progress Manipulation:** Admins can click a progress bar and, via a slick popover with a slider and input, declare "You are now 67% complete!"
    *   **Visually Stimulating Progress Bars:** Colors change based on progress percentage. Red for "Uh oh," green for "Nailed it," and a rainbow in between.
*   **Speciality Tagging:** Assigning specialities to collaborators.
*   **Basic Search:** Because scrolling is for suckers.
*   **Dark Mode Everything:** Because our eyes are precious.

### Out of Scope (What We're NOT Doing, Unless Someone Gets Ambitious/Desperate):
*   Collaborators logging in to see their own despair.
*   Automated progress tracking based on actual task completion (that's v2).
*   Actual content delivery (videos, quizzes within DHADX). This is a tracker, not a university.
*   Complex prerequisite chains (unless things get *really* out of hand).
*   Gamification, badges, leaderboards (we're not *that* fun).
*   Direct coffee-fetching integration.

## 4. Target Audience:
*   **Admins:** The long-suffering folks tasked with teaching and managing collaborators. They need this to be simple, fast, and not add to their already monumental stress levels.

## 5. Key Features/Functionalities (The Shiny Bits):
*   CRUD operations for Collaborators, Cours, Formations, Specialities.
*   Intuitive "Camp" management and progress visualization.
*   The aforementioned glorious manual progress editing via popover.
*   Dynamic, color-coded progress bars that are easy on the eyes (and tell a story).
*   A clean, dark-themed UI that doesn't burn retinas at 2 AM.

## 6. Technology Stack (The Nerdy Stuff):
*   **Backend:** Laravel.
*   **Frontend:** React with jsx.
*   **The Glue:** Inertia.js.
*   **Pretty Things:** Shadcn/ui, tailwind .
*   **Database:**  PostgreSQL

## 7. Success Metrics (How We Know We Haven't Wasted Our Time):
*   Admins actually *use* it instead of reverting to their eldritch spreadsheet rituals.
*   Fewer instances of admins asking, "Wait, did [Collaborator Name] ever do the Git thing?"
*   The "Add new" button gets clicked more often than the "Uninstall" button (if one existed).
*   Progress bars generally trend upwards.

## 8. Future Considerations (The "Wouldn't It Be Cool If..." Pile):
*   Granular task tracking within Formations.
*   Collaborator-facing views.
*   Automated reminders for slackers.
*   Reports that make managers happy.

---

**Overall Vibe:** Keep it sleek, keep it functional, modern adn clean.