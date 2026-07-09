import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SessionLogger } from "@/components/session-logger";
import { getExerciseFromCatalog } from "@/lib/exercise-utils";
import { getAppData } from "@/lib/data";
import type { Exercise, WorkoutBlock, WorkoutSession, WorkoutTemplate } from "@/lib/types";

export default async function EditWorkoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const data = await getAppData();
  if (data.configured && !data.userId) redirect("/login");

  const session = data.sessions.find((item) => item.id === sessionId);
  if (!session) notFound();

  const baseTemplate = data.templates.find((template) => template.id === session.templateId);
  const template = buildEditableTemplate(session, baseTemplate, data.exerciseCatalog);

  return (
    <div className="space-y-5">
      <header className="rounded-md bg-white p-4 shadow-soft">
        <Link href="/history" className="flex w-fit items-center gap-2 text-sm font-bold text-teal">
          <ArrowLeft size={16} />
          Back to History
        </Link>
        <p className="mt-4 text-xs font-bold uppercase text-clay">Edit workout</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">{template.name}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">Correct sets, conditioning, notes, or the workout date. Saving here updates this past workout only.</p>
      </header>
      <SessionLogger template={template} sessions={data.sessions} exerciseCatalog={data.exerciseCatalog} mode="edit" session={session} />
    </div>
  );
}

function buildEditableTemplate(session: WorkoutSession, baseTemplate: WorkoutTemplate | undefined, exerciseCatalog: Exercise[]): WorkoutTemplate {
  if (baseTemplate) return baseTemplate;

  const exerciseIds = [...session.strengthLogs.map((log) => log.exerciseId), ...session.conditioningLogs.map((log) => log.exerciseId)].filter(
    (exerciseId, index, list) => list.indexOf(exerciseId) === index
  );

  return {
    id: session.templateId ?? "",
    slug: `saved-${session.id}`,
    name: "Saved workout",
    dayType: "Saved",
    durationMinutes: session.durationMinutes ?? 45,
    summary: "Historical workout rebuilt from saved logs.",
    trainingDays: 3,
    exercises: exerciseIds.map((exerciseId, index) => {
      const exercise = getExerciseFromCatalog(exerciseCatalog, exerciseId);
      const isStrength = exercise?.trackType === "strength" && exercise.trackFields.includes("weight") && exercise.trackFields.includes("reps");
      return {
        exerciseId,
        orderIndex: index + 1,
        block: (isStrength ? "main" : "conditioning") as WorkoutBlock,
        sets: isStrength ? Math.max(1, session.strengthLogs.filter((log) => log.exerciseId === exerciseId).length) : 1,
        repMin: exercise?.defaultRepMin,
        repMax: exercise?.defaultRepMax,
        durationSeconds: exercise?.defaultDurationSeconds,
        targetRpe: 7,
        restSeconds: 60
      };
    })
  };
}
