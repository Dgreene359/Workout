import type { Equipment, Exercise, GeneratedPlan, PlanGenerationInput, TemplateExercise, WorkoutTemplate } from "@/lib/types";

export const equipmentList: Equipment[] = [
  "bodyweight",
  "dumbbell",
  "kettlebell",
  "barbell",
  "plates",
  "squat rack",
  "bench",
  "pull-up bar",
  "functional trainer",
  "rower",
  "treadmill",
  "bike",
  "box"
];

const yt = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} form tutorial`)}`;

function exercise(input: Omit<Exercise, "id" | "isGlobal" | "demoUrl"> & { demoUrl?: string }): Exercise {
  return {
    ...input,
    id: input.slug,
    demoUrl: input.demoUrl ?? yt(input.name),
    isGlobal: true
  };
}

export const exercises: Exercise[] = [
  exercise({
    slug: "bodyweight-squat",
    name: "Bodyweight Squat",
    category: "lower",
    trackType: "strength",
    movementPattern: "squat",
    muscleFocus: ["quads", "glutes", "core"],
    equipment: ["bodyweight"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 15,
    substitutionGroup: "squat",
    instructions: "Sit between the hips, keep the whole foot planted, and stand tall without letting the knees cave.",
    difficulty: "beginner",
    equipmentTier: "bodyweight"
  }),
  exercise({
    slug: "push-up",
    name: "Push-up",
    category: "upper_push",
    trackType: "strength",
    movementPattern: "horizontal press",
    muscleFocus: ["chest", "triceps", "core"],
    equipment: ["bodyweight"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 6,
    defaultRepMax: 15,
    substitutionGroup: "horizontal-press",
    instructions: "Brace, lower with elbows about 45 degrees from the torso, and press the floor away.",
    difficulty: "beginner",
    equipmentTier: "bodyweight"
  }),
  exercise({
    slug: "inverted-row",
    name: "Inverted Row",
    category: "upper_pull",
    trackType: "strength",
    movementPattern: "horizontal pull",
    muscleFocus: ["upper back", "lats", "biceps"],
    equipment: ["bodyweight", "pull-up bar"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 6,
    defaultRepMax: 12,
    substitutionGroup: "horizontal-pull",
    instructions: "Keep the body rigid and pull the chest toward the bar or straps.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "plank",
    name: "Plank",
    category: "core",
    trackType: "mobility",
    movementPattern: "anti-extension",
    muscleFocus: ["core"],
    equipment: ["bodyweight"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 20,
    defaultRepMax: 45,
    defaultDurationSeconds: 30,
    substitutionGroup: "core-brace",
    instructions: "Keep ribs down, squeeze glutes, and breathe without letting the low back sag.",
    difficulty: "beginner",
    equipmentTier: "bodyweight"
  }),
  exercise({
    slug: "reverse-lunge",
    name: "Reverse Lunge",
    category: "lower",
    trackType: "strength",
    movementPattern: "single-leg squat",
    muscleFocus: ["quads", "glutes", "balance"],
    equipment: ["bodyweight", "dumbbell", "kettlebell"],
    unilateral: true,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "single-leg",
    instructions: "Step back under control, kiss the rear knee down, and drive through the front foot.",
    difficulty: "beginner",
    equipmentTier: "bodyweight"
  }),
  exercise({
    slug: "cossack-squat",
    name: "Cossack Squat",
    category: "lower",
    trackType: "strength",
    movementPattern: "lateral squat",
    muscleFocus: ["hips", "adductors", "quads"],
    equipment: ["bodyweight", "kettlebell"],
    unilateral: true,
    defaultSets: 3,
    defaultRepMin: 5,
    defaultRepMax: 8,
    substitutionGroup: "lateral-leg",
    instructions: "Shift side to side, keep the working foot planted, and use a range you can control.",
    difficulty: "intermediate",
    equipmentTier: "bodyweight"
  }),
  exercise({
    slug: "dumbbell-row",
    name: "Dumbbell Row",
    category: "upper_pull",
    trackType: "strength",
    movementPattern: "horizontal pull",
    muscleFocus: ["lats", "upper back"],
    equipment: ["dumbbell", "bench"],
    unilateral: true,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "horizontal-pull",
    instructions: "Brace on the bench, pull the elbow toward the hip, and pause without twisting.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "dumbbell-floor-press",
    name: "Dumbbell Floor Press",
    category: "upper_push",
    trackType: "strength",
    movementPattern: "horizontal press",
    muscleFocus: ["chest", "triceps"],
    equipment: ["dumbbell"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "horizontal-press",
    instructions: "Lower until upper arms touch the floor, pause, then press smoothly.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "goblet-squat",
    name: "Goblet Squat",
    category: "lower",
    trackType: "strength",
    movementPattern: "squat",
    muscleFocus: ["quads", "glutes", "core"],
    equipment: ["dumbbell", "kettlebell"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "squat",
    instructions: "Hold the weight high, squat between the hips, and keep the torso tall.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "kettlebell-deadlift",
    name: "Kettlebell Deadlift",
    category: "lower",
    trackType: "strength",
    movementPattern: "hinge",
    muscleFocus: ["hamstrings", "glutes", "back"],
    equipment: ["kettlebell"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "hinge",
    instructions: "Hinge back, keep the bell close, and stand by driving the hips through.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: "full_body",
    trackType: "strength",
    movementPattern: "ballistic hinge",
    muscleFocus: ["glutes", "hamstrings", "conditioning"],
    equipment: ["kettlebell"],
    unilateral: false,
    defaultSets: 4,
    defaultRepMin: 10,
    defaultRepMax: 15,
    substitutionGroup: "power-hinge",
    instructions: "Hike the bell, snap the hips, and let the arms guide rather than lift.",
    difficulty: "intermediate",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "farmer-carry",
    name: "Farmer Carry",
    category: "core",
    trackType: "carry",
    movementPattern: "loaded carry",
    muscleFocus: ["grip", "traps", "core"],
    equipment: ["dumbbell", "kettlebell"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 30,
    defaultRepMax: 60,
    defaultDurationSeconds: 40,
    substitutionGroup: "carry",
    instructions: "Stand tall, walk slowly, and keep the ribs stacked over the pelvis.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "back-squat",
    name: "Back Squat",
    category: "lower",
    trackType: "strength",
    movementPattern: "squat",
    muscleFocus: ["quads", "glutes", "core"],
    equipment: ["barbell", "plates", "squat rack"],
    unilateral: false,
    defaultSets: 4,
    defaultRepMin: 4,
    defaultRepMax: 6,
    substitutionGroup: "squat",
    instructions: "Brace, control the descent, hit depth you own, and drive up evenly.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "bench-press",
    name: "Bench Press",
    category: "upper_push",
    trackType: "strength",
    movementPattern: "horizontal press",
    muscleFocus: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "plates", "bench"],
    unilateral: false,
    defaultSets: 4,
    defaultRepMin: 4,
    defaultRepMax: 8,
    substitutionGroup: "horizontal-press",
    instructions: "Set the shoulder blades, lower to the lower chest, and press with feet planted.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "lower",
    trackType: "strength",
    movementPattern: "hinge",
    muscleFocus: ["hamstrings", "glutes", "back"],
    equipment: ["barbell", "plates"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 6,
    defaultRepMax: 10,
    substitutionGroup: "hinge",
    instructions: "Soften the knees, push hips back, and keep the bar close to the legs.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "deadlift",
    name: "Deadlift",
    category: "lower",
    trackType: "strength",
    movementPattern: "hinge",
    muscleFocus: ["hamstrings", "glutes", "back"],
    equipment: ["barbell", "plates"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 3,
    defaultRepMax: 5,
    substitutionGroup: "hinge",
    instructions: "Wedge into the bar, push the floor away, and lock out without leaning back.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "overhead-press",
    name: "Overhead Press",
    category: "upper_push",
    trackType: "strength",
    movementPattern: "vertical press",
    muscleFocus: ["shoulders", "triceps", "core"],
    equipment: ["barbell", "plates"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 5,
    defaultRepMax: 8,
    substitutionGroup: "vertical-press",
    instructions: "Brace hard, press in a straight path, and finish with biceps near ears.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "pull-up",
    name: "Pull-up",
    category: "upper_pull",
    trackType: "strength",
    movementPattern: "vertical pull",
    muscleFocus: ["lats", "biceps", "upper back"],
    equipment: ["pull-up bar", "bodyweight"],
    unilateral: false,
    defaultSets: 4,
    defaultRepMin: 3,
    defaultRepMax: 8,
    substitutionGroup: "vertical-pull",
    instructions: "Start from a dead hang, pull chest toward the bar, and lower under control.",
    difficulty: "intermediate",
    equipmentTier: "garage"
  }),
  exercise({
    slug: "cable-row",
    name: "Cable Row",
    category: "upper_pull",
    trackType: "strength",
    movementPattern: "horizontal pull",
    muscleFocus: ["upper back", "lats", "biceps"],
    equipment: ["functional trainer"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "horizontal-pull",
    instructions: "Pull elbows back, pause with shoulder blades together, and avoid leaning.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "face-pull",
    name: "Face Pull",
    category: "upper_pull",
    trackType: "strength",
    movementPattern: "rear delt pull",
    muscleFocus: ["rear delts", "upper back"],
    equipment: ["functional trainer"],
    unilateral: false,
    defaultSets: 3,
    defaultRepMin: 12,
    defaultRepMax: 15,
    substitutionGroup: "shoulder-health",
    instructions: "Pull toward the face with elbows high and finish with shoulder blades back.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "pallof-press",
    name: "Pallof Press",
    category: "core",
    trackType: "strength",
    movementPattern: "anti-rotation",
    muscleFocus: ["obliques", "deep core"],
    equipment: ["functional trainer"],
    unilateral: true,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "anti-rotation",
    instructions: "Stand tall, press the handle out, and resist rotation through the torso.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "rower",
    name: "Rowing",
    category: "conditioning",
    trackType: "conditioning",
    movementPattern: "cardio",
    muscleFocus: ["conditioning"],
    equipment: ["rower"],
    unilateral: false,
    defaultSets: 1,
    defaultRepMin: 10,
    defaultRepMax: 20,
    defaultDurationSeconds: 900,
    substitutionGroup: "conditioning",
    instructions: "Drive with legs, swing the torso, then pull with the arms. Reverse that order on the return.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "treadmill",
    name: "Treadmill Run or Walk",
    category: "conditioning",
    trackType: "conditioning",
    movementPattern: "cardio",
    muscleFocus: ["conditioning"],
    equipment: ["treadmill"],
    unilateral: false,
    defaultSets: 1,
    defaultRepMin: 10,
    defaultRepMax: 30,
    defaultDurationSeconds: 1200,
    substitutionGroup: "conditioning",
    instructions: "Choose a pace you can sustain with steady breathing unless the workout calls for intervals.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "bike",
    name: "Bike",
    category: "conditioning",
    trackType: "conditioning",
    movementPattern: "cardio",
    muscleFocus: ["conditioning"],
    equipment: ["bike"],
    unilateral: false,
    defaultSets: 1,
    defaultRepMin: 10,
    defaultRepMax: 30,
    defaultDurationSeconds: 1200,
    substitutionGroup: "conditioning",
    instructions: "Keep cadence smooth and adjust resistance to match the target effort.",
    difficulty: "beginner",
    equipmentTier: "full"
  }),
  exercise({
    slug: "box-step-up",
    name: "Box Step-up",
    category: "lower",
    trackType: "strength",
    movementPattern: "single-leg squat",
    muscleFocus: ["quads", "glutes"],
    equipment: ["box", "dumbbell", "kettlebell"],
    unilateral: true,
    defaultSets: 3,
    defaultRepMin: 8,
    defaultRepMax: 12,
    substitutionGroup: "single-leg",
    instructions: "Plant the full foot on the box and stand through the working leg without bouncing.",
    difficulty: "beginner",
    equipmentTier: "minimal"
  }),
  exercise({
    slug: "hip-shoulder-mobility",
    name: "Hip and Shoulder Mobility",
    category: "mobility",
    trackType: "mobility",
    movementPattern: "mobility",
    muscleFocus: ["hips", "shoulders", "thoracic spine"],
    equipment: ["bodyweight"],
    unilateral: false,
    defaultSets: 1,
    defaultRepMin: 5,
    defaultRepMax: 10,
    defaultDurationSeconds: 600,
    substitutionGroup: "mobility",
    instructions: "Move slowly through hips, shoulders, and upper back without forcing end ranges.",
    difficulty: "beginner",
    equipmentTier: "bodyweight"
  })
];

export const conditioningSlugs = ["rower", "treadmill", "bike"];

export function getExercise(id: string) {
  return exercises.find((item) => item.id === id || item.slug === id);
}

export function getAvailableExercises(userEquipment: Equipment[]) {
  const selected = new Set<Equipment>(["bodyweight", ...userEquipment]);
  return exercises.filter((item) => item.equipment.every((equipment) => selected.has(equipment)));
}

export function getSubstitutions(exerciseId: string, userEquipment: Equipment[] = equipmentList) {
  const current = getExercise(exerciseId);
  if (!current) return [];
  return getAvailableExercises(userEquipment).filter(
    (candidate) => candidate.substitutionGroup === current.substitutionGroup && candidate.id !== current.id
  );
}

function item(exerciseId: string, orderIndex: number, block: TemplateExercise["block"], overrides: Partial<TemplateExercise> = {}): TemplateExercise {
  const found = getExercise(exerciseId);
  return {
    exerciseId,
    orderIndex,
    block,
    sets: found?.defaultSets ?? 3,
    repMin: found?.defaultRepMin,
    repMax: found?.defaultRepMax,
    durationSeconds: found?.defaultDurationSeconds,
    targetRpe: block === "mobility" ? 5 : block === "conditioning" ? 7 : 8,
    restSeconds: block === "main" ? 120 : 60,
    ...overrides
  };
}

function choose(equipment: Equipment[], preferred: string[], fallback: string) {
  const available = getAvailableExercises(equipment);
  return preferred.find((slug) => available.some((exercise) => exercise.slug === slug)) ?? fallback;
}

function template(slug: string, trainingDays: 3 | 4 | 5 | 6, dayType: string, name: string, summary: string, exerciseIds: string[]): WorkoutTemplate {
  return {
    id: slug,
    slug,
    trainingDays,
    dayType,
    name,
    durationMinutes: 45,
    summary,
    exercises: exerciseIds.map((exerciseId, index) => {
      const exercise = getExercise(exerciseId);
      const block: TemplateExercise["block"] =
        exercise?.trackType === "conditioning" ? "conditioning" : index < 2 ? "main" : index === exerciseIds.length - 1 ? "mobility" : "accessory";
      return item(exerciseId, index + 1, block);
    })
  };
}

export function generatePlan(input: PlanGenerationInput): GeneratedPlan {
  const equipment = Array.from(new Set<Equipment>(["bodyweight", ...input.equipment]));
  const squat = choose(equipment, ["back-squat", "goblet-squat", "bodyweight-squat"], "bodyweight-squat");
  const hinge = choose(equipment, ["romanian-deadlift", "kettlebell-deadlift"], "reverse-lunge");
  const push = choose(equipment, ["bench-press", "dumbbell-floor-press", "push-up"], "push-up");
  const pull = choose(equipment, ["pull-up", "cable-row", "dumbbell-row", "inverted-row"], "inverted-row");
  const verticalPush = choose(equipment, ["overhead-press", "push-up"], "push-up");
  const conditioning = choose(equipment, ["rower", "bike", "treadmill"], "hip-shoulder-mobility");
  const carry = choose(equipment, ["farmer-carry", "plank"], "plank");
  const singleLeg = choose(equipment, ["box-step-up", "reverse-lunge"], "reverse-lunge");

  const library = [
    template("generated-day-1", input.trainingDays, "Day 1", "Full Body Strength", "Squat, push, pull, and core baseline.", [
      squat,
      push,
      pull,
      carry,
      "hip-shoulder-mobility"
    ]),
    template("generated-day-2", input.trainingDays, "Day 2", "Hinge + Conditioning", "Posterior chain work with time-based conditioning.", [
      hinge,
      singleLeg,
      pull,
      conditioning,
      "hip-shoulder-mobility"
    ]),
    template("generated-day-3", input.trainingDays, "Day 3", "Volume Full Body", "Moderate-rep strength across the major patterns.", [
      squat,
      verticalPush,
      pull,
      "cossack-squat",
      carry
    ]),
    template("generated-day-4", input.trainingDays, "Day 4", "Upper + Lower Assistance", "Upper strength, single-leg work, and easy conditioning.", [
      push,
      pull,
      singleLeg,
      conditioning,
      "hip-shoulder-mobility"
    ]),
    template("generated-day-5", input.trainingDays, "Day 5", "Power + Core", "Kettlebell or bodyweight power with trunk work.", [
      choose(equipment, ["kettlebell-swing", hinge], hinge),
      push,
      pull,
      carry,
      conditioning
    ]),
    template("generated-day-6", input.trainingDays, "Day 6", "Conditioning + Mobility", "Aerobic work, mobility, and low-fatigue accessories.", [
      conditioning,
      singleLeg,
      "plank",
      "hip-shoulder-mobility"
    ])
  ];

  return {
    equipment,
    trainingDays: input.trainingDays,
    templates: library.slice(0, input.trainingDays)
  };
}

export const workoutTemplates = generatePlan({
  equipment: equipmentList,
  trainingDays: 4
}).templates;
