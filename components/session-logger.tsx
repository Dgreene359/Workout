"use client";

import { useMemo, useState } from "react";
import { Check, ExternalLink, Minus, Plus, Save } from "lucide-react";
import { saveWorkout } from "@/app/actions";
import { getExerciseFromCatalog } from "@/lib/exercise-utils";
import { getLastStrengthValues } from "@/lib/log-utils";
import { getProgressionHint } from "@/lib/progress";
import type { ConditioningLog, Exercise, StrengthSetLog, WorkoutSession, WorkoutTemplate } from "@/lib/types";

export function SessionLogger({
  template,
  sessions,
  exerciseCatalog
}: {
  template: WorkoutTemplate;
  sessions: WorkoutSession[];
  exerciseCatalog: Exercise[];
}) {
  const [notes, setNotes] = useState("");
  const [strengthLogs, setStrengthLogs] = useState<StrengthSetLog[]>(() => buildStrengthLogs(template, sessions, exerciseCatalog));
  const [conditioningLogs, setConditioningLogs] = useState<ConditioningLog[]>(() => buildConditioningLogs(template, exerciseCatalog));

  const grouped = useMemo(
    () =>
      template.exercises.map((entry) => ({
        entry,
        exercise: getExerciseFromCatalog(exerciseCatalog, entry.exerciseId),
        strength: strengthLogs.filter((log) => log.exerciseId === entry.exerciseId),
        conditioning: conditioningLogs.find((log) => log.exerciseId === entry.exerciseId)
      })),
    [conditioningLogs, exerciseCatalog, strengthLogs, template.exercises]
  );

  function adjustStrength(id: string, field: "weight" | "reps" | "rpe", delta: number) {
    setStrengthLogs((current) =>
      current.map((log) =>
        log.id === id
          ? {
              ...log,
              [field]: Math.max(0, field === "rpe" ? Math.min(10, log[field] + delta) : log[field] + delta)
            }
          : log
      )
    );
  }

  function updateStrength(id: string, field: "weight" | "reps" | "rpe", value: number) {
    setStrengthLogs((current) => current.map((log) => (log.id === id ? { ...log, [field]: Math.max(0, value) } : log)));
  }

  function toggleStrength(id: string) {
    setStrengthLogs((current) => current.map((log) => (log.id === id ? { ...log, completed: !log.completed } : log)));
  }

  function updateConditioning(exerciseId: string, patch: Partial<ConditioningLog>) {
    setConditioningLogs((current) => current.map((log) => (log.exerciseId === exerciseId ? { ...log, ...patch } : log)));
  }

  return (
    <form action={saveWorkout} className="space-y-4">
      <input type="hidden" name="templateId" value={template.id} />
      <input type="hidden" name="strengthLogs" value={JSON.stringify(strengthLogs)} />
      <input type="hidden" name="conditioningLogs" value={JSON.stringify(conditioningLogs)} />
      {grouped.map(({ entry, exercise, strength, conditioning }) => {
        if (!exercise) return null;
        const isConditioning = exercise.trackType !== "strength" || !exercise.trackFields.includes("weight") || !exercise.trackFields.includes("reps");
        return (
          <section key={`${entry.id ?? entry.exerciseId}-${entry.orderIndex}`} className="rounded-md bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-moss">{exercise.trackType}</p>
                <h2 className="mt-1 text-lg font-bold">{exercise.name}</h2>
                <p className="mt-1 text-sm text-ink/65">
                  {isConditioning
                    ? `Target ${Math.round((entry.durationSeconds ?? 900) / 60)} minutes · RPE ${entry.targetRpe}`
                    : `Target ${entry.sets} x ${entry.repMin}-${entry.repMax} · RPE ${entry.targetRpe}`}
                </p>
              </div>
              <a className="flex h-10 w-10 items-center justify-center rounded-md bg-paper text-teal" href={exercise.demoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${exercise.name} demo`}>
                <ExternalLink size={18} />
              </a>
            </div>
            <p className="mt-3 rounded-md bg-paper p-3 text-sm leading-6 text-ink/70">
              {isConditioning ? exercise.instructions : getProgressionHint(exercise.id, sessions, entry.repMax)}
            </p>
            {isConditioning && conditioning ? (
              <ConditioningInputs log={conditioning} onChange={(patch) => updateConditioning(exercise.id, patch)} />
            ) : (
              <div className="mt-4 space-y-3">
                {strength.map((log) => (
                  <div key={log.id} className="rounded-md border border-ink/10 p-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                          log.completed ? "border-teal bg-teal text-white" : "border-ink/15 bg-white text-ink/60"
                        }`}
                        onClick={() => toggleStrength(log.id)}
                        aria-label={`Mark set ${log.setNumber} complete`}
                      >
                        <Check size={18} />
                      </button>
                      <p className="font-semibold">Set {log.setNumber}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <NumberControl label="lb" value={log.weight} step={5} onChange={(value) => updateStrength(log.id, "weight", value)} onMinus={() => adjustStrength(log.id, "weight", -5)} onPlus={() => adjustStrength(log.id, "weight", 5)} />
                      <NumberControl label="reps" value={log.reps} step={1} onChange={(value) => updateStrength(log.id, "reps", value)} onMinus={() => adjustStrength(log.id, "reps", -1)} onPlus={() => adjustStrength(log.id, "reps", 1)} />
                      <NumberControl label="RPE" value={log.rpe} step={1} onChange={(value) => updateStrength(log.id, "rpe", value)} onMinus={() => adjustStrength(log.id, "rpe", -1)} onPlus={() => adjustStrength(log.id, "rpe", 1)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
      <label className="block rounded-md bg-white p-4 shadow-soft">
        <span className="text-sm font-bold">Workout notes</span>
        <textarea className="mt-2 min-h-24 w-full rounded-md border border-ink/10 bg-paper p-3 outline-none focus:border-teal" name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything to remember for next time?" />
      </label>
      <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-white shadow-soft">
        <Save size={18} />
        Save workout
      </button>
    </form>
  );
}

function ConditioningInputs({ log, onChange }: { log: ConditioningLog; onChange: (patch: Partial<ConditioningLog>) => void }) {
  return (
    <div className="mt-4 grid gap-3">
      <label className="block">
        <span className="text-xs font-bold uppercase text-ink/50">Duration minutes</span>
        <input className="mt-1 min-h-11 w-full rounded-md border border-ink/10 bg-paper px-3 outline-none focus:border-teal" type="number" min={0} value={log.durationMinutes} onChange={(event) => onChange({ durationMinutes: Number(event.target.value), completed: Number(event.target.value) > 0 })} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-bold uppercase text-ink/50">Distance optional</span>
          <input className="mt-1 min-h-11 w-full rounded-md border border-ink/10 bg-paper px-3 outline-none focus:border-teal" type="number" min={0} step="0.1" value={log.distance ?? ""} onChange={(event) => onChange({ distance: event.target.value ? Number(event.target.value) : null })} />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase text-ink/50">Effort</span>
          <input className="mt-1 min-h-11 w-full rounded-md border border-ink/10 bg-paper px-3 outline-none focus:border-teal" type="number" min={0} max={10} value={log.effort ?? ""} onChange={(event) => onChange({ effort: event.target.value ? Number(event.target.value) : null })} />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-bold uppercase text-ink/50">Notes</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-ink/10 bg-paper p-3 outline-none focus:border-teal" value={log.notes ?? ""} onChange={(event) => onChange({ notes: event.target.value })} placeholder="Stroke type, route, class notes, substitutions, or details" />
      </label>
    </div>
  );
}

function NumberControl({
  label,
  value,
  step,
  onChange,
  onMinus,
  onPlus
}: {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="rounded-md bg-paper p-2">
      <p className="text-center text-[0.65rem] font-bold uppercase text-ink/50">{label}</p>
      <div className="mt-1 grid grid-cols-[1fr_2fr_1fr] items-center gap-1">
        <button type="button" className="flex h-8 items-center justify-center rounded-md bg-white text-ink/70" onClick={onMinus} aria-label={`Decrease ${label}`}>
          <Minus size={14} />
        </button>
        <input className="h-8 min-w-0 rounded-md border border-ink/10 bg-white text-center text-sm font-bold outline-none" type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <button type="button" className="flex h-8 items-center justify-center rounded-md bg-white text-ink/70" onClick={onPlus} aria-label={`Increase ${label}`}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function buildStrengthLogs(template: WorkoutTemplate, sessions: WorkoutSession[], exerciseCatalog: Exercise[]): StrengthSetLog[] {
  return template.exercises.flatMap((entry) => {
    const exercise = getExerciseFromCatalog(exerciseCatalog, entry.exerciseId);
    if (!exercise || exercise.trackType !== "strength" || !exercise.trackFields.includes("weight") || !exercise.trackFields.includes("reps")) return [];
    const last = getLastStrengthValues(sessions, exercise.id);
    return Array.from({ length: entry.sets }, (_, index) => ({
      id: `${entry.id ?? entry.exerciseId}-${index + 1}`,
      exerciseId: exercise.id,
      setNumber: index + 1,
      weight: last?.weight ?? 0,
      reps: last?.reps ?? entry.repMin ?? exercise.defaultRepMin,
      rpe: last?.rpe ?? entry.targetRpe,
      completed: false
    }));
  });
}

function buildConditioningLogs(template: WorkoutTemplate, exerciseCatalog: Exercise[]): ConditioningLog[] {
  return template.exercises.flatMap((entry) => {
    const exercise = getExerciseFromCatalog(exerciseCatalog, entry.exerciseId);
    if (!exercise || (exercise.trackType === "strength" && exercise.trackFields.includes("weight") && exercise.trackFields.includes("reps"))) return [];
    return [
      {
        id: `${entry.id ?? entry.exerciseId}-conditioning`,
        exerciseId: exercise.id,
        durationMinutes: Math.round((entry.durationSeconds ?? exercise.defaultDurationSeconds ?? 900) / 60),
        distance: null,
        effort: entry.targetRpe,
        notes: null,
        completed: true
      }
    ];
  });
}
