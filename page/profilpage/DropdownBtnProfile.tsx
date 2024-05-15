"use client";

import { X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function DropdownBtnProfile() {
  const [openDp, setOpenDp] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpenDp(!openDp)}
        className="h-fit w-[4rem] px-4 grid place-items-center"
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
          aria-label="hamburger-menu"
          className="lucide lucide-menu w-full h-full object-contain"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
      <div
      style={{top: 0, zIndex: 51}}
        className={`fixed left-0 h-screen w-full bg-slate-50 flex flex-col gap-y-3 py-4 ${
          openDp ? "block" : "hidden"
        }`}
      >
        <button
        onClick={() => setOpenDp(!openDp)}
        className="h-[3rem] w-full flex justify-end pr-8 pt-2"
      >
        <X size={30} className="bg-red-700 text-white rounded-full" />
      </button>
        <Link
          href="/profile/edit-profile"
          className="h-20 grid place-items-center text-2xl hover:bg-slate-200"
        >
          Edit Profile
        </Link>
        <Link
          href="/setting"
          className="h-20 grid place-items-center text-2xl hover:bg-slate-200"
        >
          Setting
        </Link>
        <Link
          href="/report"
          className="h-20 hover:bg-slate-200 text-2xl grid place-items-center"
        >
          Report
        </Link>
        <button
          onClick={() => signOut({callbackUrl: "/login"})}
          className="h-20 grid place-items-center text-2xl hover:bg-slate-200 text-red-600"
        >
          Sign Out
        </button>
      </div>
    </>
  );
}

export default DropdownBtnProfile;
