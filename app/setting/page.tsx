"use client";
import OfflinePage from "@/components/OfflinePage";
import UnauthenticatedPage from "@/components/UnauthenticatedPage";
import BackButton from "@/components/button/BackButton";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ProfilPage() {
  const { status, data: session } = useSession();
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [isOnline] = UseCheckConnection();
  const router = useRouter();

  const handleDeleteAcc = async () => {
    try {
      const res = await fetch(`/api/userdata/${session?.user.email}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: null,
      });
      const data = await res.json();
    } catch (e) {
      return null;
    }
  };

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (status === "loading") {
    return <div className="">Loading</div>;
  }

  if (!session && status === "unauthenticated") {
    return <UnauthenticatedPage />
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      <div className="h-fit w-full flex flex-col pb-20 overflow-auto">
        {/* title page */}
        <div className="relative h-20 w-full bg-slate-100 flex items-center justify-center border-b-2 border-black">
          <h1 className="text-2xl">Setting</h1>
          <BackButton />
        </div>
        {/* profil sett */}
        <div className="h-[6.5rem] w-full flex justify-between items-center px-6">
          <div className="h-full w-[60%] flex flex-col gap-y-2 justify-center">
            <h1 className="text-3xl font-semibold">{session?.user.name}</h1>
            <div className="flex gap-x-2">
              <button
                onClick={() => signOut()}
                className="px-3 lg:px-7 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg"
              >
                Sign out
              </button>
              <Link
                href="/profile/edit-profile"
                className="px-3 lg:px-5 py-2 bg-green-800 hover:bg-green-700 text-white rounded-lg"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden lg:mr-5">
            <Image
              src={session?.user.image ?? "/default-profile-picture.png"}
              width={120}
              height={120}
              className="w-full h-auto object-contain"
              alt="profile-picture"
            />
          </div>
        </div>
        {/* others */}
        <Link
          href="/report"
          className="w-full h-20 border-b-2 border-slate-400 hover:bg-slate-200 text-2xl flex items-center px-8"
        >
          Report
        </Link>
        <button
          onClick={() => setDeleteMenu(true)}
          className="w-full h-20 border-b-2 border-slate-400 hover:bg-slate-200 text-red-700 text-2xl flex items-center px-8"
        >
          Delete Account
        </button>
      </div>

      {deleteMenu && (
        <div className="absolute right-0 left-0 bottom-10 top-0 m-auto w-[23rem] h-fit border-[1.4px] border-black shadow-xl rounded-lg overflow-hidden flex flex-col">
          <h1 className="bg-slate-100 p-3 text-xl">Warning!</h1>
          <p className="bg-slate- px-3 py-2 md:text-sm">
            Delete My account?. Please click {"'"}Delete My
            Account{"'"} to continue
          </p>
          <div className="w-full h-fit py-2 flex justify-end gap-x-2 pr-4">
            <button
              onClick={() => {
                handleDeleteAcc(), signOut();
              }}
              className="bg-red-700 text-white p-2 rounded-lg"
            >
              Delete My Account
            </button>
            <button
              onClick={() => setDeleteMenu(false)}
              className="hover:bg-slate-200 rounded-lg px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilPage;
