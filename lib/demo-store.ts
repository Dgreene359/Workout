import { formatISO } from "date-fns";
import { workoutTemplates } from "@/lib/seed-data";
import type { SetLog, WorkoutSession } from "@/lib/types";

const demoSessions: WorkoutSession[] = [
  {
    id: "demo-session-1",
    templateId: "lower-strength-core",
    date: formatISO(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), { representation: "date" }),
    status: "completed",
    notes: "Squats moved well. Keep the hinge conservative next time.",
    durationMinutes: 54,
    setLogs: [
      { id: "s1", exerciseId: "back-squat", setNumber: 1, weight: 135, reps: 6, rpe: 7, completed: true },
      { id: "s2", exerciseId: "back-squat", setNumber: 2, weight: 135, reps: 6, rpe: 8, completed: true },
      { id: "s3", exerciseId: "romanian-deadlift", setNumber: 1, weight: 115, reps: 8, rpe: 7, completed: true },
      { id: "s4", exerciseId: "lunges", setNumber: 1, weight: 45, reps: 10, rpe: 8, completed: true }
    ]
  },
  {
    id: "demo-session-2",
    templateId: "upper-strength",
    date: formatISO(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), { representation: "date" }),
    status: "completed",
    notes: "Add 5 lb to bench if warmups feel the same.",
    durationMinutes: 58,
    setLogs: [
      { id: "s5", exerciseId: "bench-press", setNumber: 1, weight: 115, reps: 8, rpe: 7, completed: true },
      { id: "s6", exerciseId: "bench-press", setNumber: 2, weight: 115, reps: 8, rpe: 8, completed: true },
      { id: "s7", exerciseId: "pull-ups", setNumber: 1, weight: 0, reps: 6, rpe: 8, completed: true },
      { id: "s8", exerciseId: "dumbbell-row", setNumber: 1, weight: 30, reps: 12, rpe: 8, completed: true }
    ]
  }
];

export function getDemoSessions() {
  return demoSessions;
}

export function createEmptySession(templateId: string): WorkoutSession {
  const template = workoutTemplates.find((item) => item.id === templateId) ?? workoutTemplates[0];
  const setLogs: SetLog[] = template.exercises.flatMap((item) =>
    Array.from({ length: item.sets }, (_, index) => ({
      id: `${templateId}-${item.exerciseId}-${index + 1}`,
      exerciseId: item.exerciseId,
      setNumber: index + 1,
      weight: 0,
      reps: item.repMin,
      rpe: item.targetRpe,
      completed: false
    }))
  );

  return {
    id: "draft",
    templateId,
    date: formatISO(new Date(), { representation: "date" }),
    status: "in_progress",
    notes: null,
    durationMinutes: template.durationMinutes,
    setLogs
  };
}
