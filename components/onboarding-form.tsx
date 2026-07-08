import { completeOnboarding } from "@/app/actions";
import { equipmentList } from "@/lib/seed-data";

const groupedEquipment = [
  { label: "No equipment", values: ["bodyweight"] },
  { label: "Free weights", values: ["dumbbell", "kettlebell", "barbell", "plates"] },
  { label: "Garage setup", values: ["squat rack", "bench", "pull-up bar", "functional trainer", "box"] },
  { label: "Conditioning", values: ["rower", "treadmill", "bike"] }
];

export function OnboardingForm() {
  return (
    <form action={completeOnboarding} className="space-y-5">
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Available equipment</h2>
        <p className="mt-1 text-sm leading-6 text-ink/65">Bodyweight is always included. Select what you can regularly use.</p>
        <div className="mt-4 space-y-4">
          {groupedEquipment.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-bold uppercase text-clay">{group.label}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.values.map((value) => (
                  <label key={value} className="flex min-h-12 items-center gap-2 rounded-md border border-ink/10 bg-paper px-3 text-sm font-semibold capitalize">
                    <input type="checkbox" name="equipment" value={value} defaultChecked={value === "bodyweight"} disabled={value === "bodyweight"} />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="equipment" value="bodyweight" />
      </section>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Training days</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[3, 4, 5, 6].map((day) => (
            <label key={day} className="flex min-h-14 items-center justify-center rounded-md border border-ink/10 bg-paper text-center font-bold">
              <input className="sr-only peer" type="radio" name="trainingDays" value={day} defaultChecked={day === 4} />
              <span className="rounded-md px-3 py-2 peer-checked:bg-teal peer-checked:text-white">{day}</span>
            </label>
          ))}
        </div>
      </section>
      <button className="min-h-12 w-full rounded-md bg-ink px-4 font-bold text-white shadow-soft">Generate my plan</button>
    </form>
  );
}
