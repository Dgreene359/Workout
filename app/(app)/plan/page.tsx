import Link from "next/link";
import { redirect } from "next/navigation";
import { WorkoutCard } from "@/components/workout-card";
import { getAppData } from "@/lib/data";

export default async function PlanPage() {
  const data = await getAppData();
  if (data.configured && data.userId && !data.profile?.setupCompleted) redirect("/onboarding");

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Weekly plan</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">
          {data.profile?.trainingDays ?? data.templates[0]?.trainingDays ?? 4}-day balanced plan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
          Built from your selected equipment. Use swaps to replace individual exercises with compatible alternatives.
        </p>
        <Link className="mt-4 inline-flex min-h-11 items-center rounded-md bg-teal px-4 font-bold text-white" href="/onboarding">
          Rebuild plan
        </Link>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.templates.map((template) => (
          <WorkoutCard key={template.id} template={template} equipment={data.equipment} />
        ))}
      </div>
    </div>
  );
}
