"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { contentService } from "@/services/content.service";

const subjects = ["Mathematics", "Science", "English", "Social Science", "Computer", "General"];

function Message({ children, type = "error" }) {
  if (!children) return null;

  const color = type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";

  return <p className={`rounded-lg border px-4 py-3 text-sm ${color}`}>{children}</p>;
}

export default function UploadForm() {
  const router = useRouter();

  const [values, setValues] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const isVideo = useMemo(() => values.file?.type?.startsWith("video/"), [values.file]);

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleFile(event) {

    const file = event.target.files?.[0] || null;

    setField("file", file);

    if (preview) URL.revokeObjectURL(preview);

    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function submit(event) {
    event.preventDefault();

    setServerError("");

    setSuccess("");

    setLoading(true);
    try {
      await contentService.upload(values);

      setSuccess("Content uploaded successfully. Principal approval pending.");

      setTimeout(() => router.push("/teacher/content"), 600);

    } catch (err) {
      setServerError(err?.message || "Upload failed");

    } finally {
      setLoading(false);
      
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <form className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={submit}>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input value={values.title} onChange={(event) => setField("title", event.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Subject</span>
            <select value={values.subject} onChange={(event) => setField("subject", event.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-slate-950">
              <option value="">Select subject</option>
              {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea value={values.description} onChange={(event) => setField("description", event.target.value)} rows={4} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>

        </div>

        <div className="space-y-4">
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:bg-slate-100">
            <span className="text-sm font-semibold text-slate-950">Upload file</span>
            <span className="mt-1 text-xs text-slate-500">JPG, PNG, GIF, MP4, WEBM or MOV up to 10MB</span>
            <input type="file" accept="image/jpeg,image/png,image/gif,video/mp4,video/webm,video/quicktime" onChange={handleFile} required className="sr-only" />
          </label>

          {preview ? (
            isVideo ? (
              <video src={preview} className="aspect-video w-full rounded-lg bg-slate-900 object-cover" controls />
            ) : (
              <img src={preview} alt="Upload preview" className="aspect-video w-full rounded-lg bg-slate-100 object-cover" />
            )
          ) : null}

          <Message>{serverError}</Message>
          <Message type="success">{success}</Message>
          <button
            className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </section>
  );
}
