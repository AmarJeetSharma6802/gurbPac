"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useProtectedRoute(role) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }

    if (role && user.role !== role) {
      router.replace(user.role === "principal" ? "/principal/dashboard" : "/teacher/dashboard");
    }
  }, [loading, role, router, user]);

  return { user, checking: loading || !user || (role && user.role !== role) };
}
