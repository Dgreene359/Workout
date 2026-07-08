"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/stat-card";
import { getDemoSessions } from "@/lib/demo-store";
import { getProgressSummary } from "@/lib/progress";
import { workoutTemplates } from "@/lib/seed-data";

export default function ProgressPage() {
  const sessions = getDemoSessions();
  const summary = getProgressSummary(sessions);
  const chartData = sessions.map((session) => {
    const template = workoutTemplates.find((item) => item.id === session.templateId);
    return {
      name: template?.dayType ?? "Workout",
      volume: session.setLogs.reduce((sum, set) => sum + set.weight * set.reps, 0)
    };
  });

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Progress</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Strength and consistency</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Track weekly completions, total volume, conditioning minutes, and best working sets.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="This week" value={`${summary.completedThisWeek}/4`} tone="dark" />
        <StatCard label="Volume" value={`${Math.round(summary.totalVolume / 100) / 10}k`} />
        <StatCard label="Cardio min" value={`${summary.cardioMinutes}`} />
        <StatCard label="Streak" value={`${summary.streakDays}`} />
      </div>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Volume trend</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#227c75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Best recent sets</h2>
        <div className="mt-3 space-y-2">
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
