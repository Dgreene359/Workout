import { createClient } from "@/lib/supabase/server";
import { exercises, generatePlan, getExercise, workoutTemplates } from "@/lib/seed-data";
import type { ConditioningLog, Equipment, GeneratedPlan, StrengthSetLog, WorkoutSession, WorkoutTemplate } from "@/lib/types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export type AppProfile = {
  id: string;
  displayName: string;
  setupCompleted: boolean;
  trainingDays: 3 | 4 | 5 | 6 | null;
  activePlanId: string | null;
};

export type AppData = {
  userId: string | null;
  profile: AppProfile | null;
  equipment: Equipment[];
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  configured: boolean;
};

export async function getAppData(): Promise<AppData> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      userId: null,
      profile: null,
      equipment: ["bodyweight", "dumbbell", "kettlebell", "barbell", "plates", "squat rack", "bench", "pull-up bar", "functional trainer", "rower", "treadmill", "bike", "box"],
      templates: workoutTemplates,
      sessions: [],
      configured: false
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, profile: null, equipment: [], templates: [], sessions: [], configured: true };
  }

  const [{ data: profileRow }, { data: equipmentRows }, { data: templateRows }, { data: sessionRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("equipment").select("*").eq("user_id", user.id).order("name"),
    supabase.from("workout_templates").select("*, template_exercises(*)").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase
      .from("workout_sessions")
      .select("*, set_logs(*), cardio_logs(*)")
      .eq("user_id", user.id)
      .order("session_date", { ascending: false })
      .limit(30)
  ]);

  const profile: AppProfile | null = profileRow
    ? {
        id: profileRow.id,
        displayName: profileRow.display_name,
        setupCompleted: profileRow.setup_completed,
        trainingDays: profileRow.training_days,
        activePlanId: profileRow.active_plan_id
      }
    : null;

  return {
    userId: user.id,
    profile,
    equipment: ((equipmentRows ?? []).map((row) => row.name) as Equipment[]) ?? [],
    templates: (templateRows ?? []).map(mapTemplate),
    sessions: (sessionRows ?? []).map(mapSession),
    configured: true
  };
}

export async function createGeneratedPlanForUser(supabase: Supabase, userId: string, equipment: Equipment[], trainingDays: 3 | 4 | 5 | 6) {
  const plan = generatePlan({ equipment, trainingDays });

  await supabase.from("profiles").upsert({
    id: userId,
    display_name: "Me",
    units: "lb",
    setup_completed: false
  });

  await supabase.from("equipment").delete().eq("user_id", userId);
  await supabase.from("workout_templates").delete().eq("user_id", userId);

  if (plan.equipment.length > 0) {
    await supabase.from("equipment").insert(
      plan.equipment.map((name) => ({
        user_id: userId,
        name,
        quantity: 1
      }))
    );
  }

  let firstTemplateId: string | null = null;
  for (const template of plan.templates) {
    const { data: insertedTemplate, error } = await supabase
      .from("workout_templates")
      .insert({
        user_id: userId,
        slug: template.slug,
        name: template.name,
        day_type: template.dayType,
        training_days: trainingDays,
        duration_minutes: template.durationMinutes,
        summary: template.summary,
        active: true,
        is_global: false
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    if (!firstTemplateId) firstTemplateId = insertedTemplate.id;

    await supabase.from("template_exercises").insert(
      template.exercises.map((entry) => ({
        user_id: userId,
        template_id: insertedTemplate.id,
        exercise_slug: entry.exerciseId,
        order_index: entry.orderIndex,
        block: entry.block,
        sets: entry.sets,
        rep_min: entry.repMin,
        rep_max: entry.repMax,
        duration_seconds: entry.durationSeconds,
        target_rpe: entry.targetRpe,
        rest_seconds: entry.restSeconds,
        notes: entry.notes
      }))
    );
  }

  await supabase
    .from("profiles")
    .update({
      setup_completed: true,
      training_days: trainingDays,
      active_plan_id: firstTemplateId,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);

  return plan;
}

export function buildPreviewPlan(equipment: Equipment[], trainingDays: 3 | 4 | 5 | 6): GeneratedPlan {
  return generatePlan({ equipment, trainingDays });
}

function mapTemplate(row: any): WorkoutTemplate {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    dayType: row.day_type,
    trainingDays: row.training_days,
    durationMinutes: row.duration_minutes,
    summary: row.summary,
    exercises: [...(row.template_exercises ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map((entry) => ({
        id: entry.id,
        exerciseId: entry.exercise_slug,
        orderIndex: entry.order_index,
        block: entry.block,
        sets: entry.sets,
        repMin: entry.rep_min ?? undefined,
        repMax: entry.rep_max ?? undefined,
        durationSeconds: entry.duration_seconds ?? undefined,
        targetRpe: Number(entry.target_rpe),
        restSeconds: entry.rest_seconds,
        notes: entry.notes ?? undefined
      }))
  };
}

function mapSession(row: any): WorkoutSession {
  return {
    id: row.id,
    templateId: row.template_id,
    date: row.session_date,
    status: row.status,
    notes: row.notes,
    durationMinutes: row.duration_minutes,
    strengthLogs: (row.set_logs ?? []).map((log: any): StrengthSetLog => ({
      id: log.id,
      exerciseId: log.exercise_slug,
      setNumber: log.set_number,
      weight: Number(log.weight),
      reps: log.reps,
      rpe: Number(log.rpe),
      completed: log.completed
    })),
    conditioningLogs: (row.cardio_logs ?? []).map((log: any): ConditioningLog => ({
      id: log.id,
      exerciseId: log.exercise_slug,
      durationMinutes: log.duration_minutes,
      distance: log.distance == null ? null : Number(log.distance),
      effort: log.effort == null ? null : Number(log.effort),
      notes: log.notes,
      completed: log.completed
    }))
  };
}

export function exerciseName(slug: string) {
  return getExercise(slug)?.name ?? slug;
}

export { exercises };
