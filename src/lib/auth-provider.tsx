import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, AuthContextType } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function loadTravelBuddies(userId: string) {
  const { data } = await supabase
    .from("travel_buddies")
    .select("id, created_at, user_id, buddy_id")
    .or(`user_id.eq.${userId},buddy_id.eq.${userId}`);
  if (!data || data.length === 0) return [];

  const otherIds = data.map((row) => (row.user_id === userId ? row.buddy_id : row.user_id));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", otherIds);

  return data.map((row) => {
    const otherId = row.user_id === userId ? row.buddy_id : row.user_id;
    const profile = profiles?.find((p) => p.id === otherId);
    return {
      id: otherId,
      name: profile?.full_name ?? "Traveler",
      email: profile?.email ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
      addedAt: row.created_at,
    };
  });
}

async function toAuthUser(userId: string, email: string): Promise<AuthUser | null> {
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !profile) return null;

  const travelBuddies = await loadTravelBuddies(userId);

  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email ?? email,
    role: profile.role as UserRole,
    avatar: initials(profile.full_name),
    avatarUrl: profile.avatar_url ?? undefined,
    companyName: profile.company_name ?? undefined,
    language: (profile.language as "en" | "sw") ?? "en",
    travelBuddies,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (userId: string, email: string) => {
    const u = await toAuthUser(userId, email);
    setUser(u);
    return u;
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        await refreshUser(session.user.id, session.user.email ?? "");
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await refreshUser(session.user.id, session.user.email ?? "");
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  const login = async (email: string, password: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error("Invalid credentials. Please check your email, password, and account type.");
    }
    const authedUser = await refreshUser(data.user.id, data.user.email ?? "");
    if (!authedUser || authedUser.role !== role) {
      await supabase.auth.signOut();
      setUser(null);
      throw new Error("Invalid credentials. Please check your email, password, and account type.");
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    companyName?: string,
    language?: "en" | "sw",
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
          company_name: role === "company" ? companyName : undefined,
          language: language || "en",
        },
      },
    });
    if (error) {
      throw new Error(error.message === "User already registered" ? "An account with this email already exists." : error.message);
    }
    if (!data.user) throw new Error("Signup failed. Please try again.");

    if (data.session) {
      await refreshUser(data.user.id, data.user.email ?? "");
    } else {
      // Email confirmation required before a session exists.
      throw new Error("Check your inbox to confirm your email, then sign in.");
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) await refreshUser(data.user.id, data.user.email ?? "");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, login, signup, logout, isLoading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
