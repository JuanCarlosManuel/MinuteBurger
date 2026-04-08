"use client";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { useRouter } from "next/navigation";
import React from "react";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const isAdmin = isAdminAuthenticated();

    if (!isAdmin) {
      router.replace("/login");
      return;
    }

    setIsAllowed(true);
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.28em] text-white/70 backdrop-blur">
          Checking access
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}

export default AdminGuard;
