"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import navigationMenu from "../../constant/navigationMenu.json";

function MobileNavigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const syncAdminState = () => setIsAdmin(isAdminAuthenticated());

    syncAdminState();
    window.addEventListener("storage", syncAdminState);

    return () => window.removeEventListener("storage", syncAdminState);
  }, [pathname]);

  const menuItems = isAdmin
    ? [...navigationMenu.mainMenu, { title: "Admin", link: "/admin" }]
    : navigationMenu.mainMenu;

  return (
    <nav className="flex flex-col p-4 w-full">
      <ul className="flex flex-col gap-4 w-full">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            <Link
              href={item.link}
              className={`block px-2 py-2 border-b-2 transition-colors ${
                pathname === item.link
                  ? "text-yellow-400 border-yellow-400"
                  : "border-transparent text-white"
              }`}
            >
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileNavigation;
