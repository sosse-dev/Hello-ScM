"use client";
import { Home, LayoutGrid, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
function FooterMenu() {
  const pathname = usePathname();
  return (
    <div
      className={`absolute bottom-0 md:right-0 ${
        pathname === "/profile/add-profile" ? "hidden" : ""
      } z-50 h-[3rem] md:h-[3rem] lg:h-[26rem] lg:w-fit lg:px-3 lg:flex-col lg:-right-16 lg:border-2 border-slate-700 bg-slate-50 w-full flex items-center justify-around`}
    >
      <Link
        href="/"
        className={`h-10 w-10 md:h-7 md:w-7 flex items-center justify-center ${
          pathname == "/"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <Home />
      </Link>
      <Link
        href="/explore"
        className={`h-10 w-10 md:h-7 md:w-7 flex items-center justify-center ${
          pathname == "/explore"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <LayoutGrid />
      </Link>

      <Link
        href="/profile"
        className={`h-10 w-10 md:h-7 md:w-7 flex items-center justify-center ${
          pathname == "/profile"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <User />
      </Link>
    </div>
  );
}

export default FooterMenu;
