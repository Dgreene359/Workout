export type ExerciseCategory =
  | "lower"
  | "upper_push"
  | "upper_pull"
  | "full_body"
  | "core"
  | "conditioning"
  | "mobility";

export type Equipment =
  | "barbell"
  | "plates"
  | "squat rack"
  | "bench"
  | "pull-up bar"
  | "functional trainer"
  | "kettlebell"
  | "dumbbell"
  | "rower"
  | "treadmill"
  | "bike"
  | "box"
  | "bodyweight";

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  movementPattern: string;
  muscleFocus: string[];
  equipment: Equipment[];
  unilateral: boolean;
  defaultSets: number;
  defaultRepMin: number;
  defaultRepMax: number;
  substitutionGroup: string;
};

export type TemplateExercise = {
  exerciseId: string;
  orderIndex: number;
  block: "warmup" | "main" | "accessory" | "conditioning" | "mobility";
  sets: number;
  repMin: number;
  repMax: number;
  targetRpe: number;
  restSeconds: number;
  notes?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  dayType: string;
  durationMinutes: number;
  summary: string;
  exercises: TemplateExercise[];
};

export type SetLog = {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
};

export type WorkoutSession = {
  id: string;
  templateId: string;
  date: string;
  status: "planned" | "in_progress" | "completed";
  notes: string | null;
  durationMinutes: number | null;
  setLogs: SetLog[];
};

export type ProgressSummary = {
  completedThisWeek: number;
  totalVolume: number;
  cardioMinutes: number;
  streakDays: number;
  prs: Array<{ exerciseName: string; weight: number; reps: number; date: string }>;
};
