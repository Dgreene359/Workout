import { createClient } from "@/lib/supabase/server";
import { getExerciseFromCatalog } from "@/lib/exercise-utils";
import { exercises, generatePlan, getExercise, workoutTemplates } from "@/lib/seed-data";
import type { AgeRange, ConditioningLog, Equipment, Exercise, GeneratedPlan, Goal, Sex, StrengthSetLog, WorkoutSession, WorkoutTemplate } from "@/lib/types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export type AppProfile = {
  id: string;
  displayName: string;
  setupCompleted: boolean;
  trainingDays: 3 | 4 | 5 | 6 | null;
  activePlanId: string | null;
  sex: Sex | null;
  ageRange: AgeRange | null;
  goals: Goal[];
  primaryGoal: Goal | null;
};

export type AppData = {
  userId: string | null;
  profile: AppProfile | null;
  equipment: Equipment[];
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  exerciseCatalog: Exercise[];
  todayTemplate: WorkoutTemplate | null;
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
      exerciseCatalog: exercises,
      todayTemplate: workoutTemplates[0] ?? null,
      configured: false
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, profile: null, equipment: [], templates: [], sessions: [], exerciseCatalog: exercises, todayTemplate: null, configured: true };
  }

  const [{ data: profileRow }, { data: equipmentRows }, { data: templateRows }, { data: sessionRows }, { data: customExerciseRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("equipment").select("*").eq("user_id", user.id).order("name"),
    supabase.from("workout_templates").select("*, template_exercises(*)").eq("user_id", user.id).eq("active", true).order("day_type"),
    supabase
      .from("workout_sessions")
      .select("*, set_logs(*), cardio_logs(*)")
      .eq("user_id", user.id)
      .order("session_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30)
    ,
    supabase.from("exercises").select("*").eq("user_id", user.id).order("name")
  ]);

  const profile: AppProfile | null = profileRow
    ? {
        id: profileRow.id,
        displayName: profileRow.display_name,
        setupCompleted: profileRow.setup_completed,
        trainingDays: profileRow.training_days,
        activePlanId: profileRow.active_plan_id,
        sex: profileRow.sex,
        ageRange: profileRow.age_range,
        goals: profileRow.goals ?? [],
        primaryGoal: profileRow.primary_goal
      }
    : null;
  const templates = (templateRows ?? []).map(mapTemplate).sort(compareTemplates);
  const sessions = (sessionRows ?? []).map(mapSession);
  const exerciseCatalog = [...exercises, ...(customExerciseRows ?? []).map(mapExercise)];

  return {
    userId: user.id,
    profile,
    equipment: ((equipmentRows ?? []).map((row) => row.name) as Equipment[]) ?? [],
    templates,
    sessions,
    exerciseCatalog,
    todayTemplate: getNextTemplate(templates, sessions),
    configured: true
  };
}

export async function createGeneratedPlanForUser(
  supabase: Supabase,
  userId: string,
  equipment: Equipment[],
  trainingDays: 3 | 4 | 5 | 6,
  profile: { sex?: Sex | null; ageRange?: AgeRange | null; goals?: Goal[]; primaryGoal?: Goal | null } = {}
) {
  const plan = generatePlan({ equipment, trainingDays, goals: profile.goals, primaryGoal: profile.primaryGoal });

  await supabase.from("profiles").upsert({
    id: userId,
    display_name: "Me",
    units: "lb",
    setup_completed: false,
    sex: profile.sex ?? null,
    age_range: profile.ageRange ?? null,
    goals: profile.goals ?? [],
    primary_goal: profile.primaryGoal ?? null
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
      sex: profile.sex ?? null,
      age_range: profile.ageRange ?? null,
      goals: profile.goals ?? [],
      primary_goal: profile.primaryGoal ?? null,
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

function mapExercise(row: any): Exercise {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    trackType: row.track_type,
    movementPattern: row.movement_pattern,
    muscleFocus: row.muscle_focus ?? [],
    equipment: row.equipment ?? ["bodyweight"],
    unilateral: row.unilateral,
    defaultSets: row.default_sets,
    defaultRepMin: row.default_rep_min,
    defaultRepMax: row.default_rep_max,
    defaultDurationSeconds: row.default_duration_seconds ?? undefined,
    trackFields: row.track_fields ?? ["time", "distance", "weight", "reps", "effort", "notes"],
    substitutionGroup: row.substitution_group,
    demoUrl: row.demo_url ?? "https://www.youtube.com/",
    instructions: row.instructions ?? "Custom exercise. Use notes to capture details.",
    difficulty: row.difficulty,
    equipmentTier: row.equipment_tier,
    isGlobal: row.is_global
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
      distanceUnit: log.distance_unit,
      customValues: log.custom_values,
      notes: log.notes,
      completed: log.completed
    }))
  };
}

export function exerciseName(slug: string) {
  return getExercise(slug)?.name ?? slug;
}

export function getNextTemplate(templates: WorkoutTemplate[], sessions: WorkoutSession[]) {
  if (templates.length === 0) return null;
  const latest = sessions.find((session) => session.status === "completed" && session.templateId);
  if (!latest) return templates[0];
  const index = templates.findIndex((template) => template.id === latest.templateId);
  if (index < 0) return templates[0];
  return templates[(index + 1) % templates.length];
}

function compareTemplates(a: WorkoutTemplate, b: WorkoutTemplate) {
  const aNum = Number(a.dayType.match(/\d+/)?.[0] ?? 0);
  const bNum = Number(b.dayType.match(/\d+/)?.[0] ?? 0);
  return aNum - bNum || a.dayType.localeCompare(b.dayType);
}

export { exercises };
