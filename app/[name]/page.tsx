"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FollowBtn from "@/components/button/FollowBtn";
import { useSession } from "next-auth/react";
import Posts from "./posts";
import ChatButton from "@/components/button/ChatButton";
import { useFetchFollowerAndFollowing } from "@/hooks/action/useFetchFollowerAndFollowing";
import Loading from "@/components/loader/Loading";
import UserNotFound from "@/components/NotFound/UserNotFound";
import { MessageCircleWarning } from "lucide-react";

function User() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!pathname) {
        return null;
      }

      if (session?.user.username === pathname.slice(1, pathname.length)) {
        router.push("/profile");
      }
    };

    checkUser();
  }, [session, pathname, router]);

  const { data, isLoading, refetch } = useFetchFollowerAndFollowing({
    pathname: pathname as string,
  });

  if (!data?.data && !isLoading) {
    return <UserNotFound />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      <div className="h-[9rem] w-full flex items-center justify-between px-8 shrink-0 pt-5">
        {/* name name */}
        <div className="flex flex-col w-[60%]">
          <h1 className="text-3xl break-words">{data?.data.name ?? ""}</h1>
          <h2 className="text-xl pl-1 text-zinc-600 break-words">
            {data?.data.username ?? ""}
          </h2>
          {data?.data.role === "ADMIN" && <h3 title="Admin Verified!" style={{marginTop: "2px"}} className="w-fit px-2 rounded-full bg-green-700 text-white">Admin!</h3>}
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
          <MessageCircleWarning />
        </Link>
      </div>
      {/* desc */}
      <div className="h-fit w-full bg-slate-100 grid place-items-center py-5 md:px-14 md:py-7">
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
