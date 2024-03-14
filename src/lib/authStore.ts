import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export const isAuthenticated = writable(false);
export const user = writable<User | null>(null);

// Initialize session
supabase.auth.getSession().then((response) => {
    const session = response.data.session;
    isAuthenticated.set(!!session);
    user.set(session?.user || null);
}).catch((error) => {
    console.error('Error retrieving session:', error.message);
});

// Update stores on auth state change
supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.set(!!session);
    user.set(session?.user || null);
});
