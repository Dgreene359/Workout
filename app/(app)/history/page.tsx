import { format, parseISO } from "date-fns";
import { CheckCircle2, NotebookPen } from "lucide-react";
import { getDemoSessions } from "@/lib/demo-store";
import { getExercise, workoutTemplates } from "@/lib/seed-data";

export default function HistoryPage() {
  const sessions = getDemoSessions();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">History</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Completed workouts</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Supabase-backed history will appear here after you add project keys. The preview is seeded with sample logs.
        </p>
      </header>
      <div className="space-y-4">
        {sessions.map((session) => {
          const template = workoutTemplates.find((item) => item.id === session.templateId);
          return (
            <article key={session.id} className="rounded-md bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-teal">{format(parseISO(session.date), "MMM d, yyyy")}</p>
                  <h2 className="mt-1 text-xl font-bold">{template?.name}</h2>
                </div>
                <CheckCircle2 className="text-teal" size={22} aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2">
                {session.setLogs.map((set) => {
                  const exercise = getExercise(set.exerciseId);
                  return (
                    <div key={set.id} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                      <span className="font-semibold">{exercise?.name}</span>
                      <span className="text-ink/65">
                        {set.weight} lb x {set.reps} @ {set.rpe}
                      </span>
                    </div>
                  );
                })}
              </div>
              {session.notes ? (
                <p className="mt-4 flex gap-2 rounded-md border border-ink/10 p-3 text-sm leading-6 text-ink/70">
                  <NotebookPen className="mt-0.5 shrink-0 text-clay" size={16} aria-hidden="true" />
                  {session.notes}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
