"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
function FooterMenu() {
  const pathname = usePathname();
  return (
    <div
      className={`absolute bottom-0 md:right-0 ${
        pathname === "/profile/add-profile" ? "hidden" : ""
      } z-50 h-[5rem] md:h-[4rem] lg:h-[26rem] lg:w-fit lg:px-3 lg:flex-col lg:-right-16 lg:border-2 border-slate-700 bg-slate-50 w-full flex items-center justify-around`}
    >
      <Link
        href="/"
        className={`h-10 w-10 md:h-7 md:w-7 ${
          pathname == "/"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="home"
          className="lucide lucide-home w-full h-full object-contain"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      <Link
        href="/explore"
        className={`h-10 w-10 md:h-7 md:w-7 ${
          pathname == "/explore"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="explore"
          className="lucide lucide-layout-grid w-full h-full object-contain"
        >
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      </Link>

      <Link
        href="/profile"
        className={`h-10 w-10 md:h-7 md:w-7 ${
          pathname == "/profile"
            ? "text-slate-600 border-b-2 border-slate-600"
            : "text-slate-900"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="profile-user"
          className="lucide lucide-user w-full h-full object-contain"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
    </div>
  );
}

export default FooterMenu;
