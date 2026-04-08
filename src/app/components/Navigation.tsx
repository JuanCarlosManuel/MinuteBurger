"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import navigationMenu from "../../constant/navigationMenu.json";

function Navigation() {
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
    <nav className="hidden lg:flex">
      <ul className="flex flex-row gap-4">
        {menuItems.map((item, index) => (
          <li className="group" key={index}>
            <Link
              href={item.link}
              className={`px-2 py-2 border-b-2 transition-colors group-hover:border-yellow-400 group-hover:text-yellow-400 ${
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

export default Navigation;
