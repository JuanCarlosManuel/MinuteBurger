"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";
import { ADMIN_CREDENTIALS } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid =
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password;

    if (!isValid) {
      setError("That username or password is incorrect. Please try again.");
      return;
    }

    setAdminAuthenticated();
    router.push("/admin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-32 lg:px-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/70 shadow-[0_30px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl"
      >
        <div className="grid lg:grid-cols-[1fr_1.05fr]">
          <div className="hidden border-r border-white/10 bg-[linear-gradient(145deg,rgba(250,204,21,0.18),rgba(15,23,42,0.05))] p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300/85">
                Minute Burger
              </p>
              <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight text-white">
                Admin access for menu sharing and print-ready QR handouts.
              </h1>
              <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                Sign in to open the admin dashboard, generate a QR code for the
                live menu, and print a clean paper or PDF-ready sheet.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-medium text-white">
                This lightweight setup keeps auth entirely on the client for
                now, which makes it fast to test locally without adding a
                backend.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300/85">
                  Admin Login
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Use the admin credentials to unlock the dashboard and manage
                  the QR menu access experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-yellow-300/70 focus:bg-white/[0.08]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-yellow-300/70 focus:bg-white/[0.08]"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-yellow-400 px-5 py-3 text-base font-semibold text-slate-950 transition-transform hover:scale-[1.01]"
                >
                  Open Admin Dashboard
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                <span className="text-sm text-slate-300">
                  Need to return to the public site?
                </span>
                <Link
                  href="/"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-yellow-300/60 hover:text-yellow-300"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
