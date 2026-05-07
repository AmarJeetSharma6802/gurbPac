"use client";

import ContentTable from "@/components/content/ContentTable";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";
import { useContent } from "@/hooks/useContent";

export default function TeacherDashboard() {
  const { items, loading, error } = useContent();

  const total = items.length;
  const pending = items.filter((item) => item?.status === "pending").length;
  const approved = items.filter((item) => item?.status === "approved").length;
  const rejected = items.filter((item) => item?.status === "rejected").length;

  const cardClass = "rounded-lg border border-slate-200 bg-white p-5 shadow-sm";

  return (
    <ProtectedView role="teacher">
      <DashboardShell role="teacher" title="Teacher Dashboard" subtitle="Track your uploads and approval status.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">Total uploaded</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{total}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{pending}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{approved}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{rejected}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-950">Recent content</h2>
          {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : <ContentTable items={items.slice(0, 10)} />}
        </div>
      </DashboardShell>
    </ProtectedView>
  );
}
