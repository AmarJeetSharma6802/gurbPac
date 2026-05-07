"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function ProtectedView({ role, children }) {
  const { checking } = useProtectedRoute(role);

  if (checking) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </main>
    );
  }

  return children;
}
