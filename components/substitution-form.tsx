import { createCustomExerciseAndSubstitute, substituteExercise } from "@/app/actions";
import { getSubstitutions } from "@/lib/seed-data";
import type { Equipment, Exercise } from "@/lib/types";

export function SubstitutionForm({
  templateExerciseId,
  exerciseId,
  equipment,
  exerciseCatalog
}: {
  templateExerciseId?: string;
  exerciseId: string;
  equipment: Equipment[];
  exerciseCatalog?: Exercise[];
}) {
  if (!templateExerciseId) return null;
  const substitutions = [
    ...getSubstitutions(exerciseId, equipment),
    ...(exerciseCatalog ?? []).filter((exercise) => !getSubstitutions(exerciseId, equipment).some((sub) => sub.id === exercise.id) && exercise.id !== exerciseId)
  ].slice(0, 60);

  return (
    <div className="mt-3 space-y-3">
      <form action={substituteExercise} className="flex gap-2">
        <input type="hidden" name="templateExerciseId" value={templateExerciseId} />
        <select name="replacement" className="min-h-10 flex-1 rounded-md border border-ink/10 bg-paper px-2 text-sm outline-none">
          {substitutions.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <button className="rounded-md bg-teal px-3 text-sm font-bold text-white">Swap</button>
      </form>
      <details className="rounded-md bg-paper p-3">
        <summary className="cursor-pointer text-sm font-bold text-teal">Add custom exercise</summary>
        <form action={createCustomExerciseAndSubstitute} className="mt-3 grid gap-3">
          <input type="hidden" name="templateExerciseId" value={templateExerciseId} />
          <input type="hidden" name="substitutionGroup" value="custom" />
          <input className="min-h-10 rounded-md border border-ink/10 px-3 outline-none" name="name" placeholder="Exercise name" required />
          <div className="grid grid-cols-2 gap-2">
            <select className="min-h-10 rounded-md border border-ink/10 px-3 outline-none" name="category">
              {["lower", "upper_push", "upper_pull", "full_body", "core", "conditioning", "mobility", "other"].map((value) => (
                <option key={value} value={value}>
                  {value.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <input className="min-h-10 rounded-md border border-ink/10 px-3 outline-none" name="movementPattern" placeholder="Pattern, e.g. swim" />
          </div>
          <input className="min-h-10 rounded-md border border-ink/10 px-3 outline-none" name="equipment" defaultValue="bodyweight" placeholder="Equipment or none" />
          <div className="grid grid-cols-3 gap-2 text-sm">
            {["time", "distance", "weight", "reps", "effort", "notes"].map((field) => (
              <label key={field} className="flex items-center gap-2 rounded-md bg-white px-2 py-2 capitalize">
                <input type="checkbox" name="trackFields" value={field} defaultChecked={field === "notes" || field === "time"} />
                {field}
              </label>
            ))}
          </div>
          <textarea className="min-h-20 rounded-md border border-ink/10 p-3 outline-none" name="notes" placeholder="Notes, instructions, swim type, class type, etc." />
          <button className="min-h-10 rounded-md bg-ink px-3 text-sm font-bold text-white">Add and swap</button>
        </form>
      </details>
    </div>
  );
}
