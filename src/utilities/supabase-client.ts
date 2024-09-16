import { createClient } from "@refinedev/supabase";

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  alert(`Unable to read VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY`);
}
export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
