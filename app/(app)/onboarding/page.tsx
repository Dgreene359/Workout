import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="space-y-5">
      <header className="rounded-md bg-ink p-5 text-white shadow-soft">
        <p className="text-xs font-bold uppercase text-citron">Setup</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Build your starting plan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
          Pick your equipment and weekly schedule. The app will create a balanced strength and conditioning plan you can edit over time.
        </p>
      </header>
      <OnboardingForm />
    </div>
  );
}
