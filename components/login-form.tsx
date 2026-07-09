"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage("Add Supabase keys to .env.local to enable hosted sign-in.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    setMessage(error ? error.message : "Check your email for the sign-in link.");
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={submit}>
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <span className="mt-2 flex items-center gap-2 rounded-md border border-ink/15 bg-paper px-3">
          <Mail size={18} className="text-ink/50" aria-hidden="true" />
          <input
            className="min-h-12 w-full bg-transparent outline-none"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </span>
      </label>
      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-teal px-4 font-bold text-white"
        disabled={loading}
      >
        <Send size={18} />
        {loading ? "Sending..." : "Send magic link"}
      </button>
      {message ? <p className="rounded-md bg-paper p-3 text-sm leading-6 text-ink/70">{message}</p> : null}
      <p className="text-center text-xs leading-5 text-ink/55">You should only need the magic link when this browser is signed out or the session expires.</p>
    </form>
  );
}
