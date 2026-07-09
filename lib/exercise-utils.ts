import { getExercise } from "@/lib/seed-data";
import type { Exercise } from "@/lib/types";

export function getExerciseFromCatalog(catalog: Exercise[], slug: string) {
  return catalog.find((exercise) => exercise.id === slug || exercise.slug === slug) ?? getExercise(slug);
}
