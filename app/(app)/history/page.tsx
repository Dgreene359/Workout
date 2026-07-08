import { format, parseISO } from "date-fns";
import { CheckCircle2, NotebookPen } from "lucide-react";
import { exerciseName, getAppData } from "@/lib/data";

export default async function HistoryPage() {
  const data = await getAppData();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">History</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Completed workouts</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">Saved workouts will appear here after each completed session.</p>
      </header>
      <div className="space-y-4">
        {data.sessions.length === 0 ? (
          <div className="rounded-md bg-white p-5 text-sm leading-6 text-ink/70 shadow-soft">No saved sessions yet. Log today’s workout to start your history.</div>
        ) : null}
        {data.sessions.map((session) => (
          <article key={session.id} className="rounded-md bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-teal">{format(parseISO(session.date), "MMM d, yyyy")}</p>
                <h2 className="mt-1 text-xl font-bold">Workout complete</h2>
              </div>
              <CheckCircle2 className="text-teal" size={22} aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-2">
              {session.strengthLogs.map((set) => (
                <div key={set.id} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                  <span className="font-semibold">{exerciseName(set.exerciseId)}</span>
                  <span className="text-ink/65">
                    {set.weight} lb x {set.reps} @ {set.rpe}
                  </span>
                </div>
              ))}
              {session.conditioningLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                  <span className="font-semibold">{exerciseName(log.exerciseId)}</span>
                  <span className="text-ink/65">
                    {log.durationMinutes}m{log.distance ? ` · ${log.distance} mi` : ""}{log.effort ? ` · RPE ${log.effort}` : ""}
                  </span>
                </div>
              ))}
            </div>
            {session.notes ? (
              <p className="mt-4 flex gap-2 rounded-md border border-ink/10 p-3 text-sm leading-6 text-ink/70">
                <NotebookPen className="mt-0.5 shrink-0 text-clay" size={16} aria-hidden="true" />
                {session.notes}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
