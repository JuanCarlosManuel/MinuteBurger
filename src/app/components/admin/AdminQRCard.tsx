"use client";

import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import React from "react";

interface AdminQRCardProps {
  menuUrl: string;
  onPrint: () => void;
}

function AdminQRCard({ menuUrl, onPrint }: AdminQRCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="print-card overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <div className="no-print flex flex-col gap-5 border-b border-white/10 px-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-300/80">
            QR Menu Access
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white lg:text-3xl">
            Share the live menu instantly
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Guests on the same local network can scan this code and open the
            existing menu page directly on their own device.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onPrint}
            className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
          >
            Print QR Sheet
          </button>
        </div>
      </div>

      <div className="print-area grid gap-8 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-8">
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 text-white shadow-inner shadow-black/20 print:border-0 print:bg-transparent print:p-0 print:shadow-none">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300 print:hidden">
              Menu Link
            </p>
            <h3 className="print-title mt-3 text-3xl font-semibold leading-tight text-white print:mt-0 print:text-center print:text-4xl print:text-slate-950">
              Scan to View Menu
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 print:mx-auto print:mt-3 print:max-w-none print:text-center print:text-base print:text-slate-700">
              Scan this QR code to open the menu instantly. Keep both devices
              on the same Wi-Fi or local network while testing.
            </p>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 print:mt-8 print:border print:border-slate-300 print:bg-slate-50">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400 print:text-slate-500">
              Menu URL
            </p>
            <p className="mt-3 break-all text-sm font-medium text-white/90 selection:bg-yellow-300 selection:text-slate-950 print:text-base print:text-slate-900">
              {menuUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.24),rgba(15,23,42,0.85)_58%)] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] print:border print:border-slate-300 print:bg-white">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.3)] print:shadow-none">
            <QRCodeSVG
              value={menuUrl}
              size={240}
              bgColor="#ffffff"
              fgColor="#020617"
              level="H"
              includeMargin
            />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-yellow-200/85 print:hidden">
            Ready for phone scanning
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-200 print:hidden">
            Best results come from using your current local IPv4 address in the
            config file.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default AdminQRCard;
