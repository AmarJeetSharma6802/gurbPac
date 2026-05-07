"use client";

import { useState } from "react";
import ContentTable from "@/components/content/ContentTable";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedView from "@/components/layout/ProtectedView";
import { useContent } from "@/hooks/useContent";

const statusOptions = ["all", "pending", "approved", "rejected"];

export default function PrincipalContentPage() {
  const { items, loading, error } = useContent();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const searchedItems = items.filter((item) => {
    const text = `${item?.title || ""} ${item?.subject || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const filteredItems = status === "all"
    ? searchedItems
    : searchedItems.filter((item) => item?.status === status);

  return (
    <ProtectedView role="principal">
      <DashboardShell role="principal" title="All Content" subtitle="Filter all uploads by status or search text.">
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setStatus(option)}
                className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${status === option ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, subject, description" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
        </div>
        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : <ContentTable items={filteredItems} showTeacher />}
      </DashboardShell>
    </ProtectedView>
  );
}
