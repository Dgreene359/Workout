import { redirect } from "next/navigation";
import { Dumbbell, Flame, Timer } from "lucide-react";
import { SessionLogger } from "@/components/session-logger";
import { StatCard } from "@/components/stat-card";
import { getAppData } from "@/lib/data";
import { getProgressSummary } from "@/lib/progress";

export default async function TodayPage() {
  const data = await getAppData();
  if (data.configured && data.userId && !data.profile?.setupCompleted) redirect("/onboarding");
  const template = data.todayTemplate;
  if (!template) redirect("/onboarding");
  const summary = getProgressSummary(data.sessions);

  return (
    <div className="space-y-5">
      <header className="rounded-md bg-ink p-5 text-white shadow-soft">
        <p className="text-xs font-bold uppercase text-citron">Next up</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">{template.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">{template.summary}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Metric icon={<Timer size={17} />} label={`${template.durationMinutes} min`} />
          <Metric icon={<Dumbbell size={17} />} label={`${template.exercises.length} moves`} />
          <Metric icon={<Flame size={17} />} label="RPE 7-8" />
        </div>
      </header>
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Week" value={`${summary.completedThisWeek}/${template.trainingDays}`} />
        <StatCard label="Volume" value={`${Math.round(summary.totalVolume / 100) / 10}k`} />
        <StatCard label="Cardio" value={`${summary.cardioMinutes}m`} />
      </div>
      <SessionLogger template={template} sessions={data.sessions} exerciseCatalog={data.exerciseCatalog} />
    </div>
  );
}

function Metric({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-white/10 px-2 text-sm font-bold">
      {icon}
      <span>{label}</span>
    </div>
  );
}
