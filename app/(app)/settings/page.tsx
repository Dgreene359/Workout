import { Check, Database, Shield, UserRound } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import { equipmentList } from "@/lib/seed-data";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase text-clay">Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Garage setup</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          The tracker is set up for your current equipment and ready for hosted sync.
        </p>
      </header>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <UserRound size={20} className="text-teal" /> Profile
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="Mode" value="Me first" />
          <Info label="Units" value="Pounds" />
          <Info label="Schedule" value="4 days/week" />
          <Info label="Workout length" value="45-60 minutes" />
        </div>
      </section>
      <section className="rounded-md bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold">Equipment</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {equipmentList.map((item) => (
            <div key={item} className="flex min-h-11 items-center gap-2 rounded-md bg-paper px-3 text-sm font-semibold capitalize">
              <Check size={16} className="text-teal" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Callout icon={<Database size={20} />} title="Supabase" body="Add the URL and anon key in .env.local, then run the SQL schema in your Supabase project." />
        <Callout icon={<Shield size={20} />} title="Family-ready" body="Every user-owned table includes user_id and row-level security policies." />
      </section>
      <SignOutButton />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-paper p-3">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Callout({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-md bg-ink p-4 text-white shadow-soft">
      <div className="flex items-center gap-2 font-bold text-citron">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/75">{body}</p>
    </div>
  );
}
