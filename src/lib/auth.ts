// auth.ts
import { supabase } from './supabaseClient';

export interface SignInResponse {
    success: boolean;
    error?: Error;
}

export async function signInWithEmail(email: string, password: string): Promise<SignInResponse> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error as Error };
        }

        if (data) {
            console.log('User logged in successfully:', data);
            return { success: true };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, error: error as Error };
    }
}

// Define and export the signUpWithEmail function
export async function signUpWithEmail(email: string, password: string): Promise<SignInResponse> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error as Error };
        }

        if (data) {
            console.log('User signed up successfully:', data);
            return { success: true };
        } else {
            throw new Error('User sign up failed');
        }
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, error: error as Error };
    }
}

export async function signOut(): Promise<void> {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}
