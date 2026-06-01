"use client";

import { useState, useCallback } from "react";

const SESSION_KEY = "chomthong_admin";

type AdminSession = {
  token: string;
  expiresAt: number;
};

function readStoredSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session.token || session.expiresAt <= Math.floor(Date.now() / 1000)) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function useAuth() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    if (typeof window === "undefined") return null;
    return readStoredSession();
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (res.ok && json.success && json.data?.token) {
      const session: AdminSession = {
        token: json.data.token,
        expiresAt: json.data.expiresAt,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setSession(session);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return { isAdmin: !!session, adminToken: session?.token ?? null, login, logout };
}
