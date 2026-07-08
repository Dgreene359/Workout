export type TrackType = "strength" | "conditioning" | "mobility" | "carry";

export type ExerciseCategory =
  | "lower"
  | "upper_push"
  | "upper_pull"
  | "full_body"
  | "core"
  | "conditioning"
  | "mobility";

export type Equipment =
  | "bodyweight"
  | "dumbbell"
  | "kettlebell"
  | "barbell"
  | "plates"
  | "squat rack"
  | "bench"
  | "pull-up bar"
  | "functional trainer"
  | "rower"
  | "treadmill"
  | "bike"
  | "box";

export type EquipmentTier = "bodyweight" | "minimal" | "garage" | "full";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type WorkoutBlock = "warmup" | "main" | "accessory" | "conditioning" | "mobility";

export type Exercise = {
  id: string;
  slug: string;
  name: string;
  category: ExerciseCategory;
  trackType: TrackType;
  movementPattern: string;
  muscleFocus: string[];
  equipment: Equipment[];
  unilateral: boolean;
  defaultSets: number;
  defaultRepMin: number;
  defaultRepMax: number;
  defaultDurationSeconds?: number;
  substitutionGroup: string;
  demoUrl: string;
  instructions: string;
  difficulty: Difficulty;
  equipmentTier: EquipmentTier;
  isGlobal: boolean;
};

export type TemplateExercise = {
  id?: string;
  exerciseId: string;
  orderIndex: number;
  block: WorkoutBlock;
  sets: number;
  repMin?: number;
  repMax?: number;
  durationSeconds?: number;
  targetRpe: number;
  restSeconds: number;
  notes?: string;
};

export type WorkoutTemplate = {
  id: string;
  slug: string;
  name: string;
  dayType: string;
  durationMinutes: number;
  summary: string;
  trainingDays: 3 | 4 | 5 | 6;
  exercises: TemplateExercise[];
};

export type PlanGenerationInput = {
  equipment: Equipment[];
  trainingDays: 3 | 4 | 5 | 6;
};

export type GeneratedPlan = {
  equipment: Equipment[];
  trainingDays: 3 | 4 | 5 | 6;
  templates: WorkoutTemplate[];
};

export type UserEquipment = {
  name: Equipment;
  quantity: number;
  notes?: string;
};

export type StrengthSetLog = {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
};

export type ConditioningLog = {
  id: string;
  exerciseId: string;
  durationMinutes: number;
  distance?: number | null;
  effort?: number | null;
  notes?: string | null;
  completed: boolean;
};

export type WorkoutSession = {
  id: string;
  templateId: string;
  date: string;
  status: "planned" | "in_progress" | "completed";
  notes: string | null;
  durationMinutes: number | null;
  strengthLogs: StrengthSetLog[];
  conditioningLogs: ConditioningLog[];
};

export type ProgressSummary = {
  completedThisWeek: number;
  totalVolume: number;
  cardioMinutes: number;
  streakDays: number;
  prs: Array<{ exerciseName: string; weight: number; reps: number; date: string }>;
};
