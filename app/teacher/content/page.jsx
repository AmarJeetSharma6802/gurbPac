"use client";

import ContentTable from "@/components/content/ContentTable";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/hooks/useContent";

export default function TeacherContentPage() {

  const { user } = useAuth();
  const { items, loading, error } = useContent();

  const teacherUserId = user?.id || user?._id;
  
  const mine = items.filter((item) => {
    const teacher = item?.teacherId;
    const teacherId = typeof teacher === "string" ? teacher : teacher?._id || teacher?.id;
    return teacherId === teacherUserId;
  });

  return (
    <ProtectedView role="teacher">
      <DashboardShell role="teacher" title="My Content" subtitle="Preview status, schedule state, and rejection reasons.">
        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : <ContentTable items={mine} />}
      </DashboardShell>
    </ProtectedView>
  );
}
