"use client";

import DropdownBtnProfile from "@/page/profilpage/DropdownBtnProfile";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostsProfile from "../../page/profilpage/PostsProfile";
import { useQuery } from "@tanstack/react-query";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import OfflinePage from "@/components/OfflinePage";
import ErrorPage from "@/components/ErrorPage";
import { useRouter } from "next/navigation";

function Profile() {
  const { status, data: session } = useSession();
  const [isOnline] = UseCheckConnection();
  const router = useRouter();

  const getFollowerAndFollowing = async () => {
    try {
      const res = await fetch(
        `/api/follow/length?username=${session?.user?.username}`
      );

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      return await res.json();
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["followsLength"],
    queryFn: getFollowerAndFollowing,
  });

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center space-y-3">
        <h1 className="text-3xl border-b-2 border-black">
          You haven{"'"}t signed up yet
        </h1>
        <Link
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-xl rounded-lg text-white"
          href="/api/auth/signin"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (status === "loading" && isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="w-12 h-12 animate-spin">
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
            aria-label="loader2"
            className="lucide lucide-clock-12 w-full h-full"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12" />
          </svg>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full h-fit overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      {/* nav */}
      <div className="relative h-[6rem] shrink-0 w-full max-w-[50rem] bg-slate-200 grid place-items-center">
        <DropdownBtnProfile />
        <h1 className="text-2xl">Your Profile</h1>
      </div>
      <div className="h-[9rem] w-full flex items-center justify-between px-3 md:px-24">
        {/* name name */}
        <div className="flex flex-col w-[60%] -space-y-1">
          <h1 className="text-3xl lg:text-4xl font-semibold break-words">
            {session?.user.name ?? ""}
          </h1>
          <h1 className="text-xl text-zinc-600 break-words">
            {session?.user.username}
          </h1>
        </div>
        {/* profil pic */}

        <div className="h-[7rem] w-[7rem] rounded-full overflow-hidden">
          <Image
            src={session?.user.image ?? "/default-profile-picture.png"}
            width={120}
            height={120}
            priority={true}
            className="w-full h-auto object-contain"
            alt="profil-photo"
          />
        </div>
      </div>
      {/* desc */}
      <div className="h-fit w-full bg-slate-200 grid place-items-center md:px-14 md:py-7">
        <p className="text-center py-5 md:text-2xl">
          {session?.user.desc ?? ""}
        </p>
      </div>
      <div className="h-fit w-full flex items-center justify-between space-x-3 pr-4 border-b-2 border-slate-400">
        <Link
          href={{ pathname: `/${session?.user.username}/follower` }}
          className="grow py-2 px-3 text-center text-2xl hover:bg-slate-300 font-bold flex flex-col"
        >
          Follower
          <p className="text-center text-lg font-medium text-zinc-600">
            {data?.data?.length === 0 ? 0 : data?.data?.length}
          </p>
        </Link>
        <Link
          href={{ pathname: `/${session?.user.username}/following` }}
          className="grow py-2 px-3 flex flex-col text-2xl hover:bg-slate-300 font-bold text-center"
        >
          Following
          <p className="text-center text-lg font-medium text-zinc-600">
            {data?.data2?.length === 0 ? 0 : data?.data2?.length}
          </p>
        </Link>
        <Link
          href="/profile/post"
          className="w-12 h-8 sm:w-14 sm:h-14 shrink-0 text-green-600 rounded-full text-4xl grid place-items-center hover:scale-110"
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
            aria-label="badge-plus"
            className="lucide lucide-badge-plus w-full h-full"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
        </Link>
      </div>
      <PostsProfile sessionId={session?.user.id as string} />
    </div>
  );
}

export default Profile
