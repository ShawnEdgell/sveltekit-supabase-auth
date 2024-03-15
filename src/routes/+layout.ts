import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    // Adjusted to directly use `import.meta.env` for environment variable access
    const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createSupabaseLoadClient({
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
        event: { fetch }, // Assuming this abstraction correctly handles the fetch API
        serverSession: data.session, // And assuming `data.session` is the correct way to pass the session in your setup
    });

    // The rest of your logic remains the same
    const { data: { session } } = await supabase.auth.getSession();

    return { supabase, session };
};
