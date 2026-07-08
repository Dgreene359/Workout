import { Clock, Dumbbell, Repeat2 } from "lucide-react";
import { getExercise, getSubstitutions } from "@/lib/seed-data";
import { SubstitutionForm } from "@/components/substitution-form";
import type { Equipment, WorkoutTemplate } from "@/lib/types";

export function WorkoutCard({ template, equipment = [] }: { template: WorkoutTemplate; equipment?: Equipment[] }) {
  return (
    <article className="rounded-md bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-clay">{template.dayType}</p>
          <h2 className="mt-1 text-xl font-bold">{template.name}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">{template.summary}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-teal/10 px-2 py-1 text-xs font-bold text-teal">
          <Clock size={14} /> {template.durationMinutes}m
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {template.exercises.map((item) => {
          const exercise = getExercise(item.exerciseId);
          if (!exercise) return null;
          const substitutions = getSubstitutions(item.exerciseId, equipment);
          return (
            <div key={`${template.id}-${item.exerciseId}`} className="rounded-md border border-ink/10 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="mt-1 text-xs text-ink/60">
                    {item.sets} x {item.repMin}-{item.repMax} · RPE {item.targetRpe}
                  </p>
                </div>
                <Dumbbell className="mt-1 text-teal" size={18} aria-hidden="true" />
              </div>
              {substitutions.length > 0 ? (
                <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-ink/60">
                  <Repeat2 className="mt-0.5 shrink-0 text-moss" size={14} aria-hidden="true" />
                  Swap: {substitutions.slice(0, 2).map((sub) => sub.name).join(", ")}
                </p>
              ) : null}
              <SubstitutionForm templateExerciseId={item.id} exerciseId={item.exerciseId} equipment={equipment} />
            </div>
          );
        })}
      </div>
    </article>
  );
}
