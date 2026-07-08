import { isAfter, parseISO, startOfWeek, subDays } from "date-fns";
import { exercises } from "@/lib/seed-data";
import type { ProgressSummary, WorkoutSession } from "@/lib/types";

export function getProgressSummary(sessions: WorkoutSession[]): ProgressSummary {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const completedSessions = sessions.filter((session) => session.status === "completed");
  const completedThisWeek = completedSessions.filter((session) => isAfter(parseISO(session.date), weekStart)).length;
  const totalVolume = completedSessions.reduce(
    (sum, session) => sum + session.strengthLogs.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
    0
  );
  const cardioMinutes = completedSessions.reduce(
    (sum, session) => sum + session.conditioningLogs.reduce((logSum, log) => logSum + log.durationMinutes, 0),
    0
  );

  const prs = exercises
    .map((exercise) => {
      const best = completedSessions
        .flatMap((session) => session.strengthLogs.map((set) => ({ ...set, date: session.date })))
        .filter((set) => set.exerciseId === exercise.id && set.completed)
        .sort((a, b) => b.weight * b.reps - a.weight * a.reps)[0];
      return best ? { exerciseName: exercise.name, weight: best.weight, reps: best.reps, date: best.date } : null;
    })
    .filter(Boolean)
    .slice(0, 8) as ProgressSummary["prs"];

  const streakDays = completedSessions.some((session) => isAfter(parseISO(session.date), subDays(new Date(), 7)))
    ? Math.min(completedSessions.length, 30)
    : 0;

  return { completedThisWeek, totalVolume, cardioMinutes, streakDays, prs };
}

export function getProgressionHint(exerciseId: string, sessions: WorkoutSession[], repMax?: number) {
  const recentSets = sessions
    .flatMap((session) => session.strengthLogs.map((set) => ({ ...set, date: session.date })))
    .filter((set) => set.exerciseId === exerciseId && set.completed)
    .slice(-4);

  if (!repMax || recentSets.length < 2) return "Enter your starting weight here; future workouts will prefill from your last completed sets.";
  const allStrong = recentSets.every((set) => set.reps >= repMax && set.rpe <= 8);
  if (allStrong) return "Ready to add a small amount of weight next time.";
  const tooHeavy = recentSets.some((set) => set.rpe >= 9);
  if (tooHeavy) return "Hold or reduce weight until reps move cleanly again.";
  return "Stay here and try to add one rep before increasing load.";
}
