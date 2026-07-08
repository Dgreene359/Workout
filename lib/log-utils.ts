import type { WorkoutSession } from "@/lib/types";

export function getLastStrengthValues(sessions: WorkoutSession[], exerciseId: string) {
  const match = sessions
    .flatMap((session) => session.strengthLogs.map((log) => ({ ...log, date: session.date })))
    .filter((log) => log.exerciseId === exerciseId && log.completed)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return match ? { weight: match.weight, reps: match.reps, rpe: match.rpe } : null;
}
