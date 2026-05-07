"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

export default function AuthPanel({ compact = false, defaultMode = "login", defaultRole = "teacher" }) {
  const router = useRouter();
  const [mode, setMode] = useState(defaultMode === "register" ? "register" : "login");
  const [role, setRole] = useState(defaultRole === "principal" ? "principal" : "teacher");
  const [form, setForm] = useState({ name: "", email: "", password: "", teacherCode: "", otp: "" });
  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { login, setUser } = useAuth();

  const isOtpStep = mode === "otp";
  let title = `${role === "principal" ? "Principal" : "Teacher"} Login`;
  if (mode === "register") title = "Teacher Register";
  if (isOtpStep) title = "Verify OTP";

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function redirectByRole(nextUser) {
    router.push(nextUser?.role === "principal" ? "/principal/dashboard" : "/teacher/dashboard");
  }

  async function submit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    setLoading(true);

    // register mode 
    try {
      if (mode === "register") {
        await authService.registerTeacher(form);
        setPendingEmail(form.email);
        setMode("otp");
        setMessage("OTP sent to email. Verify to complete registration.");
        return;
      }

      if (isOtpStep) {
        await authService.verifyOtp({ email: pendingEmail, otp: form.otp });

        const me = await authService.me();

        const nextUser = me?.user;

        if (!nextUser) throw new Error("User not found after OTP verification");

        setUser(nextUser);

        redirectByRole(nextUser);
        return;
      }

      const nextUser = await login({ email: form.email, password: form.password });
      if (!nextUser) throw new Error("Broken login response");

      redirectByRole(nextUser);

    } catch (err) {

      setError(err?.message || "Something went wrong");

    } finally {
      
      setLoading(false);
    }
  }

  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${compact ? "p-4" : "p-6"}`}>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Broadcast access</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{title}</h2>
      </div>

      {!isOtpStep ? (
        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button className={`rounded-md py-2 text-sm font-semibold ${role === "teacher" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`} onClick={() => setRole("teacher")}>Teacher</button>
          <button className={`rounded-md py-2 text-sm font-semibold ${role === "principal" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`} onClick={() => { setRole("principal"); setMode("login"); }}>Principal</button>
        </div>
      ) : null}

      {role === "teacher" && !isOtpStep ? (
        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button className={`rounded-md py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`} onClick={() => setMode("login")}>Login</button>
          <button className={`rounded-md py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`} onClick={() => setMode("register")}>Register</button>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={submit}>
        {mode === "register" ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input name="name" value={form.name} onChange={updateField} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>
        ) : null}

        {!isOtpStep ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input name="email" type="email" value={form.email} onChange={updateField} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>
        ) : null}

        {!isOtpStep ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input name="password" type="password" value={form.password} onChange={updateField} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>
        ) : null}

        {mode === "register" ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Teacher Code</span>
            <input name="teacherCode" value={form.teacherCode} onChange={updateField} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>
        ) : null}

        {isOtpStep ? (
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">OTP</span>
            <input name="otp" value={form.otp} onChange={updateField} required className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950" />
          </label>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <button
          className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : isOtpStep ? "Verify OTP" : mode === "register" ? "Create Teacher Account" : "Login"}
        </button>
      </form>
    </section>
  );
}
