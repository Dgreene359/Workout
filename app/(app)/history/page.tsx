import { format, parseISO } from "date-fns";
import Link from "next/link";
import { CheckCircle2, Edit3, NotebookPen, Search } from "lucide-react";
import { getAppData } from "@/lib/data";
import type { WorkoutSession } from "@/lib/types";

export default async function HistoryPage({
  searchParams
}: {
  searchParams: Promise<{ range?: string; template?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const data = await getAppData();
  const range = filters.range ?? "all";
  const templateFilter = filters.template ?? "all";
  const query = (filters.q ?? "").trim().toLowerCase();
  const filteredSessions = data.sessions.filter((session) => {
    if (templateFilter !== "all" && session.templateId !== templateFilter) return false;
    if (!matchesRange(session.date, range)) return false;
    if (!query) return true;

    const names = [
      ...session.strengthLogs.map((log) => exerciseName(log.exerciseId, data.exerciseCatalog)),
      ...session.conditioningLogs.map((log) => exerciseName(log.exerciseId, data.exerciseCatalog))
    ];
    return names.some((name) => name.toLowerCase().includes(query)) || (session.notes ?? "").toLowerCase().includes(query);
  });

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">History</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Completed workouts</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">Saved workouts will appear here after each completed session.</p>
      </header>

      <form className="rounded-md bg-white p-4 shadow-soft">
        <div className="grid gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase text-ink/50">Find exercise or note</span>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-ink/10 bg-paper px-3">
              <Search size={16} className="text-ink/45" aria-hidden="true" />
              <input className="min-h-11 flex-1 bg-transparent text-sm outline-none" name="q" defaultValue={filters.q ?? ""} placeholder="Bench, swim, sore shoulder..." />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase text-ink/50">Date range</span>
              <select className="mt-1 min-h-11 w-full rounded-md border border-ink/10 bg-paper px-3 text-sm outline-none focus:border-teal" name="range" defaultValue={range}>
                <option value="all">All</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase text-ink/50">Workout</span>
              <select className="mt-1 min-h-11 w-full rounded-md border border-ink/10 bg-paper px-3 text-sm outline-none focus:border-teal" name="template" defaultValue={templateFilter}>
                <option value="all">All</option>
                {data.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="min-h-11 rounded-md bg-ink px-3 text-sm font-bold text-white">Apply filters</button>
            <Link className="flex min-h-11 items-center justify-center rounded-md bg-paper px-3 text-sm font-bold text-ink/70" href="/history">
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {data.sessions.length === 0 ? (
          <div className="rounded-md bg-white p-5 text-sm leading-6 text-ink/70 shadow-soft">No saved sessions yet. Log today&apos;s workout to start your history.</div>
        ) : null}
        {data.sessions.length > 0 && filteredSessions.length === 0 ? (
          <div className="rounded-md bg-white p-5 text-sm leading-6 text-ink/70 shadow-soft">No workouts match those filters.</div>
        ) : null}
        {filteredSessions.map((session) => {
          const totals = getSessionTotals(session);
          const templateName = data.templates.find((template) => template.id === session.templateId)?.name ?? "Workout complete";
          return (
            <article key={session.id} className="rounded-md bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-teal">{format(parseISO(session.date), "MMM d, yyyy")}</p>
                  <h2 className="mt-1 text-xl font-bold">{templateName}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="flex h-10 w-10 items-center justify-center rounded-md bg-paper text-ink/65" href={`/history/${session.id}/edit`} aria-label="Edit workout">
                    <Edit3 size={17} />
                  </Link>
                  <CheckCircle2 className="text-teal" size={22} aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <HistoryMetric label="Sets" value={String(totals.sets)} />
                <HistoryMetric label="Volume" value={`${Math.round(totals.volume).toLocaleString()} lb`} />
                <HistoryMetric label="Cardio" value={`${totals.cardioMinutes}m`} />
              </div>
              <div className="mt-4 grid gap-2">
                {session.strengthLogs.map((set) => (
                  <div key={set.id} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                    <span className="font-semibold">{exerciseName(set.exerciseId, data.exerciseCatalog)}</span>
                    <span className="text-ink/65">
                      {set.weight} lb x {set.reps} @ {set.rpe}
                    </span>
                  </div>
                ))}
                {session.conditioningLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
                    <span className="font-semibold">{exerciseName(log.exerciseId, data.exerciseCatalog)}</span>
                    <span className="text-ink/65">
                      {log.durationMinutes}m{log.distance ? ` - ${log.distance} mi` : ""}
                      {log.effort ? ` - RPE ${log.effort}` : ""}
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
          );
        })}
      </div>
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-paper p-2 text-center">
      <p className="text-[0.65rem] font-bold uppercase text-ink/45">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function getSessionTotals(session: WorkoutSession) {
  return {
    sets: session.strengthLogs.filter((log) => log.completed).length,
    volume: session.strengthLogs.filter((log) => log.completed).reduce((total, log) => total + log.weight * log.reps, 0),
    cardioMinutes: session.conditioningLogs.filter((log) => log.completed).reduce((total, log) => total + log.durationMinutes, 0)
  };
}

function exerciseName(slug: string, catalog: { id: string; name: string }[]) {
  return catalog.find((exercise) => exercise.id === slug || exercise.name === slug)?.name ?? slug;
}

function matchesRange(date: string, range: string) {
  if (range === "all") return true;
  const days = Number(range);
  if (!days) return true;
  const sessionTime = new Date(`${date}T00:00:00`).getTime();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return sessionTime >= cutoff.getTime();
}
