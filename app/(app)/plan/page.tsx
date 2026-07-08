import { WorkoutCard } from "@/components/workout-card";
import { workoutTemplates } from "@/lib/seed-data";

export default function PlanPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Weekly plan</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">4-day balanced strength</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
          Built around barbell strength, cable accessories, kettlebell carryover, conditioning, and mobility.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {workoutTemplates.map((template) => (
          <WorkoutCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
