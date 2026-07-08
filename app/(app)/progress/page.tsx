import { format, parseISO } from "date-fns";
import { StatCard } from "@/components/stat-card";
import { VolumeChart } from "@/components/volume-chart";
import { getAppData } from "@/lib/data";
import { getProgressSummary } from "@/lib/progress";

export default async function ProgressPage() {
  const data = await getAppData();
  const summary = getProgressSummary(data.sessions);
  const chartData = data.sessions
    .slice()
    .reverse()
    .map((session) => ({
      name: format(parseISO(session.date), "M/d"),
      volume: session.strengthLogs.reduce((sum, set) => sum + set.weight * set.reps, 0)
    }));

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Progress</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Strength and consistency</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">Progress now reflects saved workout logs.</p>
      </header>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="This week" value={`${summary.completedThisWeek}/${data.profile?.trainingDays ?? 4}`} tone="dark" />
        <StatCard label="Volume" value={`${Math.round(summary.totalVolume / 100) / 10}k`} />
        <StatCard label="Cardio min" value={`${summary.cardioMinutes}`} />
        <StatCard label="Streak" value={`${summary.streakDays}`} />
      </div>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Volume trend</h2>
        <div className="mt-4 h-64">{chartData.length ? <VolumeChart data={chartData} /> : <p className="pt-20 text-center text-sm text-ink/60">Save workouts to build a trend.</p>}</div>
      </section>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Best recent sets</h2>
        <div className="mt-3 space-y-2">
          {summary.prs.length === 0 ? <p className="text-sm text-ink/60">No strength sets saved yet.</p> : null}
          {summary.prs.map((pr) => (
            <div key={`${pr.exerciseName}-${pr.date}`} className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm">
              <span className="font-semibold">{pr.exerciseName}</span>
              <span className="text-ink/65">
                {pr.weight} lb x {pr.reps}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
