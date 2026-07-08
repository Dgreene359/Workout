import { ExternalLink } from "lucide-react";
import { getAppData } from "@/lib/data";
import { getAvailableExercises } from "@/lib/seed-data";

export default async function LibraryPage() {
  const data = await getAppData();
  const available = getAvailableExercises(data.equipment.length ? data.equipment : ["bodyweight"]);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Exercise library</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Movements and demos</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Exercises are filtered to your selected equipment. Each movement includes form notes and a YouTube demo link.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {available.map((exercise) => (
          <article key={exercise.id} className="rounded-md bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-moss">{exercise.trackType}</p>
                <h2 className="mt-1 text-lg font-bold">{exercise.name}</h2>
              </div>
              <a className="flex h-10 w-10 items-center justify-center rounded-md bg-paper text-teal" href={exercise.demoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${exercise.name} demo`}>
                <ExternalLink size={18} />
              </a>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/70">{exercise.instructions}</p>
            <p className="mt-3 text-xs font-semibold capitalize text-ink/50">{exercise.equipment.join(", ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
