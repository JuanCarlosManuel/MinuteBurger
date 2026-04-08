"use client";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function AdminAccessLink() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const syncAdminState = () => setIsAdmin(isAdminAuthenticated());

    syncAdminState();
    window.addEventListener("storage", syncAdminState);

    return () => window.removeEventListener("storage", syncAdminState);
  }, [pathname]);

  return (
    <Link
      href={isAdmin ? "/admin" : "/login"}
      className="group relative inline-flex"
      aria-label={isAdmin ? "Open admin dashboard" : "Open admin login"}
      title={isAdmin ? "Admin dashboard" : "Admin login"}
    >
      <svg
        className="h-8 w-8 text-white transition-colors group-hover:text-yellow-400"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isAdmin && (
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-black/50 bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
      )}
    </Link>
  );
}

export default AdminAccessLink;
