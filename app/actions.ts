"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createGeneratedPlanForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { AgeRange, ConditioningLog, Equipment, Goal, Sex, StrengthSetLog, TrackField } from "@/lib/types";

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
  const goals = formData.getAll("goals").map(String) as Goal[];
  const primaryGoal = String(formData.get("primaryGoal") ?? "") as Goal;
  await createGeneratedPlanForUser(supabase, user.id, equipment.length ? equipment : ["bodyweight"], trainingDays, {
    sex: String(formData.get("sex") ?? "") as Sex,
    ageRange: String(formData.get("ageRange") ?? "") as AgeRange,
    goals,
    primaryGoal: primaryGoal || goals[0] || "general_health"
  });
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
        distance_unit: log.distanceUnit ?? null,
        custom_values: log.customValues ?? null,
        notes: log.notes,
        completed: true
      }))
    );
    if (cardioError) throw new Error(cardioError.message);
  }

  revalidatePath("/");
  redirect("/today");
}

export async function updateWorkout(formData: FormData) {
  const { supabase, user } = await requireUser();
  const sessionId = String(formData.get("sessionId"));
  const templateId = String(formData.get("templateId"));
  const sessionDate = String(formData.get("sessionDate"));
  const notes = String(formData.get("notes") ?? "");
  const strengthLogs = JSON.parse(String(formData.get("strengthLogs") ?? "[]")) as StrengthSetLog[];
  const conditioningLogs = JSON.parse(String(formData.get("conditioningLogs") ?? "[]")) as ConditioningLog[];

  const { data: existing, error: existingError } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (!existing) throw new Error("Workout not found.");

  const { error: sessionError } = await supabase
    .from("workout_sessions")
    .update({
      template_id: templateId || null,
      session_date: sessionDate || new Date().toISOString().slice(0, 10),
      status: "completed",
      notes,
      updated_at: new Date().toISOString()
    })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (sessionError) throw new Error(sessionError.message);

  const [{ error: deleteSetError }, { error: deleteCardioError }] = await Promise.all([
    supabase.from("set_logs").delete().eq("session_id", sessionId).eq("user_id", user.id),
    supabase.from("cardio_logs").delete().eq("session_id", sessionId).eq("user_id", user.id)
  ]);

  if (deleteSetError) throw new Error(deleteSetError.message);
  if (deleteCardioError) throw new Error(deleteCardioError.message);

  const completedStrength = strengthLogs.filter((log) => log.completed);
  if (completedStrength.length > 0) {
    const { error: setError } = await supabase.from("set_logs").insert(
      completedStrength.map((log) => ({
        user_id: user.id,
        session_id: sessionId,
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
        session_id: sessionId,
        exercise_slug: log.exerciseId,
        modality: log.exerciseId,
        duration_minutes: log.durationMinutes,
        distance: log.distance,
        effort: log.effort,
        distance_unit: log.distanceUnit ?? null,
        custom_values: log.customValues ?? null,
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

export async function createCustomExerciseAndSubstitute(formData: FormData) {
  const { supabase, user } = await requireUser();
  const templateExerciseId = String(formData.get("templateExerciseId"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Exercise name is required.");
  const trackFields = formData.getAll("trackFields").map(String) as TrackField[];
  const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `custom-${slugBase || "exercise"}-${Date.now()}`;
  const wantsStrength = trackFields.includes("weight") || trackFields.includes("reps");
  const wantsDistance = trackFields.includes("distance") && !wantsStrength;
  const trackType = wantsStrength ? "strength" : wantsDistance ? "distance" : trackFields.includes("time") ? "conditioning" : "custom";

  const { error: insertError } = await supabase.from("exercises").insert({
    user_id: user.id,
    slug,
    name,
    category: String(formData.get("category") ?? "other"),
    track_type: trackType,
    movement_pattern: String(formData.get("movementPattern") ?? "other"),
    muscle_focus: ["custom"],
    equipment: [String(formData.get("equipment") ?? "bodyweight")],
    unilateral: false,
    default_sets: wantsStrength ? 3 : 1,
    default_rep_min: wantsStrength ? 8 : 0,
    default_rep_max: wantsStrength ? 12 : 0,
    default_duration_seconds: trackFields.includes("time") ? 900 : null,
    track_fields: trackFields.length ? trackFields : ["notes"],
    substitution_group: String(formData.get("substitutionGroup") ?? "custom"),
    demo_url: null,
    instructions: String(formData.get("notes") ?? ""),
    difficulty: "beginner",
    equipment_tier: "bodyweight",
    is_global: false
  });
  if (insertError) throw new Error(insertError.message);

  if (templateExerciseId) {
    const { error: updateError } = await supabase
      .from("template_exercises")
      .update({ exercise_slug: slug })
      .eq("id", templateExerciseId)
      .eq("user_id", user.id);
    if (updateError) throw new Error(updateError.message);
  }

  revalidatePath("/");
}
