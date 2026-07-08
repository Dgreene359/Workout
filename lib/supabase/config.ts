const fallbackSupabaseUrl = "https://sraswwkwptfehgoepkkl.supabase.co";
const fallbackSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyYXN3d2t3cHRmZWhnb2Vwa2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDQwNjYsImV4cCI6MjA5OTEyMDA2Nn0.87uDF2YJRegZUAuqEc80XSmVOzQdYpUO8_UYExheu4g";

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey
  };
}
