"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createGeneratedPlanForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { ConditioningLog, Equipment, StrengthSetLog } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function completeOnboarding(formData: FormData) {
  const { supabase, user } = await requireUser();
  const equipment = formData.getAll("equipment").map(String) as Equipment[];
  const trainingDays = Number(formData.get("trainingDays")) as 3 | 4 | 5 | 6;
  await createGeneratedPlanForUser(supabase, user.id, equipment.length ? equipment : ["bodyweight"], trainingDays);
  revalidatePath("/");
  redirect("/today");
}

export async function saveWorkout(formData: FormData) {
  const { supabase, user } = await requireUser();
  const templateId = String(formData.get("templateId"));
  const notes = String(formData.get("notes") ?? "");
  const strengthLogs = JSON.parse(String(formData.get("strengthLogs") ?? "[]")) as StrengthSetLog[];
  const conditioningLogs = JSON.parse(String(formData.get("conditioningLogs") ?? "[]")) as ConditioningLog[];

  const { data: session, error } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: user.id,
      template_id: templateId,
      session_date: new Date().toISOString().slice(0, 10),
      status: "completed",
      notes,
      duration_minutes: null
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const completedStrength = strengthLogs.filter((log) => log.completed);
  if (completedStrength.length > 0) {
    const { error: setError } = await supabase.from("set_logs").insert(
      completedStrength.map((log) => ({
        user_id: user.id,
        session_id: session.id,
        exercise_slug: log.exerciseId,
        set_number: log.setNumber,
        weight: log.weight,
        reps: log.reps,
        rpe: log.rpe,
        completed: true
      }))
    );
    if (setError) throw new Error(setError.message);
  }

  const completedConditioning = conditioningLogs.filter((log) => log.completed && log.durationMinutes > 0);
  if (completedConditioning.length > 0) {
    const { error: cardioError } = await supabase.from("cardio_logs").insert(
      completedConditioning.map((log) => ({
        user_id: user.id,
        session_id: session.id,
        exercise_slug: log.exerciseId,
        modality: log.exerciseId,
        duration_minutes: log.durationMinutes,
        distance: log.distance,
        effort: log.effort,
        notes: log.notes,
        completed: true
      }))
    );
    if (cardioError) throw new Error(cardioError.message);
  }

  revalidatePath("/");
  redirect("/history");
}

export async function substituteExercise(formData: FormData) {
  const { supabase, user } = await requireUser();
  const templateExerciseId = String(formData.get("templateExerciseId"));
  const replacement = String(formData.get("replacement"));
  const { error } = await supabase
    .from("template_exercises")
    .update({ exercise_slug: replacement })
    .eq("id", templateExerciseId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
