"use client";

import ContentTable from "@/components/content/ContentTable";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";
import { useContent } from "@/hooks/useContent";

export default function PrincipalDashboard() {
  const { items, loading, error } = useContent();

  const total = items.length;
  const pending = items.filter((item) => item?.status === "pending");
  const approved = items.filter((item) => item?.status === "approved").length;
  const rejected = items.filter((item) => item?.status === "rejected").length;

  const cardClass = "rounded-lg border border-slate-200 bg-white p-5 shadow-sm";

  return (
    <ProtectedView role="principal">
      <DashboardShell role="principal" title="Principal Dashboard" subtitle="Review total uploads and pending approval queue.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">All content</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{total}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{pending.length}</p>
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
          <h2 className="text-lg font-bold text-slate-950">Pending approval</h2>
          {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? (
            <div className="space-y-3">

              {/* skeleton */}
              
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : <ContentTable items={pending.slice(0, 10)} showTeacher />}
        </div>
      </DashboardShell>
    </ProtectedView>
  );
}
