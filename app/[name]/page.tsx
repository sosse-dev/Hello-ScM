"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FollowBtn from "@/components/button/FollowBtn";
import { useSession } from "next-auth/react";
import Posts from "./posts";
import ChatButton from "@/components/button/ChatButton";
import { useQuery } from "@tanstack/react-query";
import OfflinePage from "@/components/OfflinePage";
import ErrorPage from "@/components/ErrorPage";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import NoPage from "@/components/NoPage";

function User() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline] = UseCheckConnection();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!session?.user.username && status === "unauthenticated") {
          router.push("/profile");
        }

        if (!session?.user.username && status !== "loading") {
          router.push("/profile/add-profile");
        }

        if (!pathname) {
          return null;
        }

        if (session?.user.username === pathname.slice(1, pathname.length)) {
          router.push("/profile");
        }

        return null;
      } catch (err) {
        return null;
      }
    };

    checkUser();
  }, [session, pathname, router, status]);

  const getFollowerAndFollowing = async () => {
    try {
      if (!pathname) {
        console.log("no pathname has been gotten");
        return null;
      }

      if (!session && status !== "loading") {
        console.log("No session");
        return null;
      }

      const res = await fetch(`/api/otheruser${pathname}`);

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const { data } = await res.json();

      if (!data) {
        console.log("couldnot find this user's data");
        return null;
      }

      const res2 = await fetch(
        `/api/follow/${pathname?.slice(1, pathname.length)}/20`
      );

      if (!res2.ok) {
        console.log("bad fetch response");
        return null;
      }

      const follows = await res2.json();

      return { data, follows };
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["followers", "followings"],
    queryFn: getFollowerAndFollowing,
  });

  if (status === "unauthenticated") {
    return (
      <div className="m-auto flex flex-col items-center space-y-2">
        <h1 className="text-3xl font-bold">You haven{"'"}t signed up yet</h1>
        <Link
          href="/profile"
          className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (isLoading) {
    return (
      <div className="m-auto">
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
            aria-label="loader"
            className="lucide lucide-clock-12 w-full h-full"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12" />
          </svg>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return <NoPage />;
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full h-screen overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      <div className="h-[9rem] w-full flex items-center justify-between px-8 shrink-0 pt-5">
        {/* name name */}
        <div className="flex flex-col w-[60%]">
          <h1 className="text-3xl break-words">{data?.data.name ?? ""}</h1>
          <h1 className="text-xl pl-1 text-zinc-600 break-words">
            {data?.data.username ?? ""}
          </h1>
        </div>
        {/* profil pic */}
        <div className="">
          <div className="h-[7rem] w-[7rem] rounded-full overflow-hidden">
            <Image
              src={data?.data.image ?? "/default-profile-picture.png"}
              width={60}
              height={60}
              className="w-full h-auto object-contain"
              alt="profile-picture"
            />
          </div>
        </div>
      </div>
      <div className="h-[4rem] shrink-0 w-full flex p-2 space-x-2">
        <FollowBtn
          idThisUser={data?.data.id}
          followed={data?.follows.response}
          refetch={refetch}
        />
        <ChatButton
          receiverId={data?.data.id}
          senderId={session?.user?.id as string}
          apiUrl="/api/message/getOrCreate"
        />
        <Link
          href={`/report/user/${data?.data.username}`}
          className="w-24 h-full bg-green-700 hover:bg-green-600 rounded-md text-white flex items-center justify-center gap-x-1 px-2"
        >
          Report
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
            aria-label="report"
            className="lucide lucide-message-circle-warning w-[20%] md:w-[30%] h-[90%] md:h-[60%]"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </Link>
      </div>
      {/* desc */}
      <div className="h-fit w-full bg-slate-200 grid place-items-center py-5 md:px-14 md:py-7">
        <p className="text-center md:text-2xl">{data?.data.desc ?? ""}</p>
      </div>
      <div className="h-fit w-full flex items-center justify-between space-x-3 border-b-2 border-slate-400">
        <Link
          href={{ pathname: `${pathname}/follower` }}
          className="grow py-2 px-3 text-center text-2xl hover:bg-slate-300 font-bold flex flex-col"
        >
          Follower
          <p className="text-center text-lg font-medium text-zinc-600">
            {data?.follows.data.length}
          </p>
        </Link>
        <Link
          href={{ pathname: `${pathname}/following` }}
          className="grow py-2 px-3 flex flex-col text-2xl hover:bg-slate-300 font-bold text-center"
        >
          Following
          <p className="text-center text-lg font-medium text-zinc-600">
            {data?.follows.data2.length}
          </p>
        </Link>
      </div>
      {/* posted photos or videos */}
      <Posts id={data?.data.id} />
    </div>
  );
}

export default User;
