"use client";

import Link from "next/link";

export default function ContentTable({ items, showTeacher = false, actions }) {
  if (!items.length) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-slate-950">No content available</h3>
        <p className="mt-1 text-sm text-slate-500">No matching records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="sticky top-0 bg-slate-100 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Content</th>
              {showTeacher ? <th className="px-4 py-3">Teacher</th> : null}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => (
              <tr key={item?._id || item?.slug} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-950">{item?.title || "Untitled"}</div>
                  <div className="text-xs text-slate-500">{item?.subject || "Subject"}</div>
                  {item?.rejectionReason ? <div className="mt-1 text-xs text-rose-600">{item.rejectionReason}</div> : null}
                </td>
                {showTeacher ? (
                  <td className="px-4 py-4 text-slate-600">
                    {item?.teacherId?.name || item?.teacherId?.email || "Teacher"}
                  </td>
                ) : null}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${
                      item?.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                        : item?.status === "rejected"
                          ? "bg-rose-100 text-rose-800 ring-rose-200"
                          : "bg-amber-100 text-amber-800 ring-amber-200"
                    }`}
                  >
                    {item?.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {item?.status === "approved" ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-800 ring-1 ring-emerald-200">active</span>
                  ) : item?.status === "rejected" ? (
                    <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold capitalize text-rose-800 ring-1 ring-rose-200">not approved</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold capitalize text-sky-800 ring-1 ring-sky-200">scheduled</span>
                  )}
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {item?.updatedAt || item?.createdAt ? new Date(item?.updatedAt || item?.createdAt).toLocaleString("en-IN") : "Not set"}
                </td>
                <td className="px-4 py-4">
                  {actions ? actions(item) : (
                    <Link className="font-semibold text-slate-950 hover:underline" href={`/live/${item?.slug}`}>
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
