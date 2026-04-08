"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import AdminGuard from "@/app/components/admin/AdminGuard";
import AdminQRCard from "@/app/components/admin/AdminQRCard";
import AdminOrders from "@/app/components/admin/AdminOrders";
import { clearAdminAuthenticated } from "@/lib/adminAuth";
import { useGlobalContext } from "@/context/store";

export default function AdminPage() {
  const router = useRouter();
  const { orders, updateOrderStatus } = useGlobalContext();
  const [menuUrl, setMenuUrl] = useState("");

  useEffect(() => {
    // Get the site origin dynamically for production-ready QR URLs
    // In production on Vercel: window.location.origin will be the deployed URL
    // In development: window.location.origin will be localhost:3000
    // Fallback to environment variable if somehow needed
    const siteOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "https://minute-burger.vercel.app";

    setMenuUrl(`${siteOrigin}/menu`);
  }, []);

  const handleLogout = () => {
    clearAdminAuthenticated();
    router.replace("/login");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminGuard>
      <div className="print-shell min-h-screen px-4 pb-16 pt-32 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          <section className="no-print overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(15,23,42,0.9),rgba(30,41,59,0.72),rgba(250,204,21,0.1))] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300/80">
                  Admin Dashboard
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
                  Manage Orders & Menu Access
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 lg:text-base">
                  Track all customer orders with their items and details. Update order status in real-time and manage menu sharing securely.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/90">
                  Menu QR
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/90">
                  Order Management
                </span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                  Local network ready
                </span>
              </div>
            </div>
          </section>

          {/* Orders Section */}
          <section className="rounded-[2rem] border border-white/12 bg-slate-950/60 p-6 shadow-[0_30px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300/80">
                Orders Management
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Recent Orders ({orders.length})
              </h2>
            </div>
            <AdminOrders orders={orders} onStatusChange={updateOrderStatus} />
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
            <AdminQRCard menuUrl={menuUrl} onPrint={handlePrint} />

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="no-print space-y-8"
            >
              <section className="rounded-[2rem] border border-white/12 bg-slate-950/60 p-6 shadow-[0_30px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
                  Network Notes
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  Same-network testing
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  The QR points directly to the menu page using your LAN base
                  URL. Phones and tablets must be connected to the same local
                  Wi-Fi or hotspot as this computer.
                </p>
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Quick Access
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200">
                      Admin session active
                    </div>
                    <a
                      href={menuUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:border-yellow-300/60 hover:text-yellow-300"
                    >
                      Open Menu URL
                    </a>
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/12 bg-[linear-gradient(155deg,rgba(127,29,29,0.45),rgba(15,23,42,0.92))] p-6 shadow-[0_30px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-200/80">
                  Session Control
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  Logout when you are done
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-200/85">
                  This admin setup uses a local browser flag for access. Log
                  out when you finish testing or printing on a shared device.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 w-full rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-300/60 hover:bg-white/[0.1]"
                >
                  Logout
                </button>
              </section>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </AdminGuard>
  );
}
