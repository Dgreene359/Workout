"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-clay px-4 font-bold text-white" onClick={signOut}>
      <LogOut size={18} />
      Sign out
    </button>
  );
}
