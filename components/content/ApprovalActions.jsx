"use client";

import { useState } from "react";
import { approvalService } from "@/services/approval.service";

function Message({ children }) {
  if (!children) return null;
  return <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{children}</p>;
}

export default function ApprovalActions({ item, onDone }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const contentId = item?._id || item?.id;

  async function approve() {

    setError("");
    setLoading("approve");

    try {

      await approvalService.approve(contentId);
      onDone?.();

    } catch (err) {

      setError(err?.message || "Approval failed");
    } finally {
      setLoading("");
    }
  }

  async function reject() {
    if (!reason.trim()) {
      setError("Rejection reason required");
      return;
    }
    setError("");
    setLoading("reject");

    try {

      await approvalService.reject(contentId, reason.trim());

      setRejectOpen(false);
      setReason("");
      onDone?.();

    } catch (err) {
      setError(err?.message || "Reject failed");

    } finally {
      setLoading("");
      
    }
  }

  if (item?.status !== "pending") {
    return <span className="text-xs text-slate-500">Reviewed</span>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={approve}
          disabled={Boolean(loading)}
        >
          {loading === "approve" ? "..." : "Approve"}
        </button>
        <button
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-rose-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setRejectOpen(true)}
          disabled={Boolean(loading)}
        >
          Reject
        </button>
      </div>
      <Message>{error}</Message>

      {rejectOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">Reject content</h2>
              <button className="rounded-md px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={() => setRejectOpen(false)}>
                X
              </button>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">Reason</span>
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100" onClick={() => setRejectOpen(false)}>
                Cancel
              </button>
              <button className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60" onClick={reject} disabled={loading === "reject"}>
                {loading === "reject" ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
