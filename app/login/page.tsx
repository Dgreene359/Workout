import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-md bg-white p-5 shadow-soft">
        <p className="text-xs font-bold uppercase text-clay">Garage Strength</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Sign in to sync</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Use email magic links with Supabase. Without environment keys, the app runs in local preview mode.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
