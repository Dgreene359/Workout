"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, Save } from "lucide-react";
import { createEmptySession, getDemoSessions } from "@/lib/demo-store";
import { getExercise } from "@/lib/seed-data";
import { getProgressionHint } from "@/lib/progress";
import type { SetLog, WorkoutTemplate } from "@/lib/types";

export function SessionLogger({ template }: { template: WorkoutTemplate }) {
  const [sets, setSets] = useState<SetLog[]>(() => createEmptySession(template.id).setLogs);
  const [saved, setSaved] = useState(false);
  const demoSessions = useMemo(() => getDemoSessions(), []);

  function adjust(id: string, field: "weight" | "reps" | "rpe", delta: number) {
    setSaved(false);
    setSets((current) =>
      current.map((set) =>
        set.id === id
          ? {
              ...set,
              [field]: Math.max(0, field === "rpe" ? Math.min(10, set[field] + delta) : set[field] + delta)
            }
          : set
      )
    );
  }

  function toggle(id: string) {
    setSaved(false);
    setSets((current) => current.map((set) => (set.id === id ? { ...set, completed: !set.completed } : set)));
  }

  const grouped = template.exercises.map((item) => ({
    templateExercise: item,
    exercise: getExercise(item.exerciseId),
    sets: sets.filter((set) => set.exerciseId === item.exerciseId)
  }));

  return (
    <div className="space-y-4">
      {grouped.map(({ templateExercise, exercise, sets: exerciseSets }) => {
        if (!exercise) return null;
        return (
          <section key={exercise.id} className="rounded-md bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-moss">{templateExercise.block}</p>
                <h2 className="mt-1 text-lg font-bold">{exercise.name}</h2>
                <p className="mt-1 text-sm text-ink/65">
                  Target {templateExercise.sets} x {templateExercise.repMin}-{templateExercise.repMax}, RPE{" "}
                  {templateExercise.targetRpe}
                </p>
              </div>
              <span className="rounded-md bg-citron px-2 py-1 text-xs font-bold text-ink">
                {exercise.equipment[0]}
              </span>
            </div>
            <p className="mt-3 rounded-md bg-paper p-3 text-sm leading-6 text-ink/70">
              {getProgressionHint(exercise.id, demoSessions, templateExercise.repMax)}
            </p>
            <div className="mt-4 space-y-3">
              {exerciseSets.map((set) => (
                <div key={set.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-ink/10 p-2">
                  <button
                    className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                      set.completed ? "border-teal bg-teal text-white" : "border-ink/15 bg-white text-ink/60"
                    }`}
                    onClick={() => toggle(set.id)}
                    aria-label={`Mark set ${set.setNumber} complete`}
                  >
                    <Check size={18} />
                  </button>
                  <div>
                    <p className="text-sm font-semibold">Set {set.setNumber}</p>
                    <p className="text-xs text-ink/60">
                      {set.weight} lb · {set.reps} reps · RPE {set.rpe}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Stepper label="Weight" onMinus={() => adjust(set.id, "weight", -5)} onPlus={() => adjust(set.id, "weight", 5)} />
                    <Stepper label="Reps" onMinus={() => adjust(set.id, "reps", -1)} onPlus={() => adjust(set.id, "reps", 1)} />
                    <Stepper label="RPE" onMinus={() => adjust(set.id, "rpe", -1)} onPlus={() => adjust(set.id, "rpe", 1)} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-white shadow-soft"
        onClick={() => setSaved(true)}
      >
        <Save size={18} />
        {saved ? "Saved locally for preview" : "Save workout"}
      </button>
    </div>
  );
}

function Stepper({ label, onMinus, onPlus }: { label: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center rounded-md bg-paper">
      <button className="flex h-8 w-7 items-center justify-center text-ink/70" onClick={onMinus} aria-label={`Decrease ${label}`}>
        <Minus size={14} />
      </button>
      <button className="flex h-8 w-7 items-center justify-center text-ink/70" onClick={onPlus} aria-label={`Increase ${label}`}>
        <Plus size={14} />
      </button>
    </div>
  );
}
