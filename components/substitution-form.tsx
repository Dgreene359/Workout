import { substituteExercise } from "@/app/actions";
import { getSubstitutions } from "@/lib/seed-data";
import type { Equipment } from "@/lib/types";

export function SubstitutionForm({
  templateExerciseId,
  exerciseId,
  equipment
}: {
  templateExerciseId?: string;
  exerciseId: string;
  equipment: Equipment[];
}) {
  if (!templateExerciseId) return null;
  const substitutions = getSubstitutions(exerciseId, equipment);
  if (substitutions.length === 0) return <p className="mt-2 text-xs text-ink/50">No compatible swaps for your selected equipment.</p>;

  return (
    <form action={substituteExercise} className="mt-3 flex gap-2">
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
  );
}
