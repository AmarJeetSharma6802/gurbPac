"use client";

import { useMemo } from "react";
import ApprovalActions from "@/components/content/ApprovalActions";
import ContentTable from "@/components/content/ContentTable";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";
import { useContent } from "@/hooks/useContent";

export default function PrincipalApprovalsPage() {
  const { items, loading, error, refresh } = useContent();
  const pending = useMemo(() => items.filter((item) => item?.status === "pending"), [items]);

  return (
    <ProtectedView role="principal">
      <DashboardShell role="principal" title="Pending Approval" subtitle="Approve content or reject it with a mandatory reason.">
        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : (
          <ContentTable
            items={pending}
            showTeacher
            actions={(item) => <ApprovalActions item={item} onDone={refresh} />}
          />
        )}
      </DashboardShell>
    </ProtectedView>
  );
}
