import Link from "next/link";
import React from "react";
import AdminAccessLink from "./admin/AdminAccessLink";
import Navigation from "./Navigation";
import CartWidget from "./CartWidget";
import MobileMenu from "./MobileMenu";

function MainHeader() {
  return (
    <div className="fixed top-0 left-0 w-full z-10">
      <div className="relative bg-gray-800/25 backdrop-filter backdrop-blur-sm px-4 py-4 rounded-lg text-white mx-4 lg:mx-24 mt-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-10">
            <Link href="/" className="flex-shrink-0">
              <span className="text-3xl font-black italic text-yellow-400" style={{letterSpacing: '0.05em', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                BISNAR'S BURGER
              </span>
            </Link>
            <Navigation />
          </div>
          <div className="flex flex-row items-center gap-6">
            <CartWidget />
            <AdminAccessLink />
            <MobileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainHeader;
