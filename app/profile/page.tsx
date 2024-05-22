"use client";
import DropdownBtnProfile from "@/page/profilpage/DropdownBtnProfile";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import PostsProfile from "../../page/profilpage/PostsProfile";
import { useFetchFollowerAndFollowingFromCurrentUser } from "@/hooks/action/useFetchFollowerAndFollowing";
import Loading from "@/components/loader/Loading";
import FollowAndPostBtn from "@/components/Profile/FollowAndPostBtn";

function Profile() {
  const { data: session } = useSession();
  const { data, isLoading } = useFetchFollowerAndFollowingFromCurrentUser(
    session?.user.username as string
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-fit overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      {/* nav */}
      <div className="relative h-[4rem] shrink-0 w-full max-w-[50rem] bg-slate-100 flex justify-between items-center px-3 md:px-6">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <DropdownBtnProfile />
      </div>
      <div className="h-[9rem] w-full flex items-center justify-between px-3 md:px-24">
        {/* name name */}
        <div className="flex flex-col w-[60%] -space-y-1">
          <h1 className="text-3xl lg:text-4xl font-semibold break-words">
            {session?.user.name ?? ""}
          </h1>
          <h2 className="text-xl text-zinc-600 break-words">
            {session?.user.username}
          </h2>
          {session?.user.role === "ADMIN" && (
            <h3
              title="Admin Verified!"
              style={{ marginTop: "2px" }}
              className="w-fit px-2 rounded-full bg-green-700 text-white"
            >
              Admin!
            </h3>
          )}
        </div>
        {/* profil pic */}
        <div className="h-[7rem] w-[7rem] rounded-full overflow-hidden">
          <Image
            src={session?.user.image ?? "/default-profile-picture.png"}
            width={80}
            height={80}
            priority={true}
            className="w-full h-auto object-contain"
            alt="profil-photo"
          />
        </div>
      </div>
      {/* desc */}
      <div
        className={`h-fit w-full bg-slate-100 grid place-items-center md:px-14 md:py-7 ${
          !session?.user.desc ? "hidden" : "block"
        }`}
      >
        <p className="text-center py-5 md:text-2xl">
          {session?.user.desc ?? ""}
        </p>
      </div>
      <hr className={`${session?.user.desc ? "hidden" : "block"}`} />
      <div className="h-fit w-full flex items-center justify-between space-x-3 pr-4 border-b-2 border-slate-400">
        <FollowAndPostBtn
          username={session?.user.username as string}
          FollowerLength={data?.data?.length ?? 0}
          FollowingLength={data?.data2?.length ?? 0}
          CurrentUser={true}
        />
      </div>
      <PostsProfile sessionId={session?.user.id as string} />
    </div>
  );
}

export default Profile;
