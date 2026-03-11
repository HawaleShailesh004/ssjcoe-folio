import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { AppUser } from "@/types";

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  getSession: async () => {
    if (!supabase) {
      set({ user: null, loading: false });
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      set({ user: null, loading: false });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    set({ user: profile ?? null, loading: false });
  },

  signIn: async (email, password) => {
    if (!supabase) {
      return { error: "Supabase not configured" };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    set({ user: profile ?? null });
    return { error: null };
  },

  signOut: async () => {
    if (supabase) await supabase.auth.signOut();
    set({ user: null });
  },
}));
