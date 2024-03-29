import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
        event,
    });

    /**
     * A convenience helper so we can just call await getSession() instead
     * const { data: { session } } = await event.locals.supabase.auth.getSession()
     */
    event.locals.getSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        },
    });
};
