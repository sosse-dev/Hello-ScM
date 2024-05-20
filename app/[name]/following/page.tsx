"use client";

import BackButton from "@/components/button/BackButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import qs from "query-string";
import ViewLoader from "@/lib/ViewLoader";
import { Follow, User } from "@prisma/client";
import { Waves } from "lucide-react";
import { useFetchFollowing } from "@/hooks/action/useFetchFollowing";
import NavbarFollow from "@/components/Navbar/NavbarFollow";
import LayoutFollow from "@/components/Layout/LayoutFolllow";
import Loading from "@/components/loader/Loading";

type FollowingWithUserProfile = Follow & {
  follower: User;
};

function Following() {
  const { data, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage } =
    useFetchFollowing();

  return (
    <LayoutFollow>
      <NavbarFollow title="Following" />
      <div className="h-[100vh] w-full mt-20 flex flex-col space-y-3 px-2 overflow-y-auto pb-20 lg:pb-0">
        {data?.pages[0]?.data2.length === 0 && !isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center mb-20">
            <Waves />
          </div>
        )}
        {isLoading && <Loading />}
        {data?.pages?.map((externalData, i) => (
          <Fragment key={i}>
            {externalData?.data2?.map((data: FollowingWithUserProfile) => (
              <Link
                href={`/${data.follower.username}`}
                key={data.follower.id}
                className="h-[7rem] w-full shrink-0 flex px-4 border-2 border-black hover:bg-slate-100 rounded-md"
              >
                <div className="h-full w-[40%] flex space-x-1 md:space-x-3">
                  <div className="h-full w-fit grid place-items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={
                          data.follower.image ?? "/default-profile-picture.png"
                        }
                        width={80}
                        height={80}
                        alt="profile-picture"
                      />
                    </div>
                  </div>
                  <div className="h-full flex flex-col justify-center">
                    <h1 className="text-xl">{data.follower.name}</h1>
                    <p className="line-clamp-1">{data.follower.desc}</p>
                  </div>
                </div>
                <div className="h-full w-fit flex items-center justify-center "></div>
              </Link>
            ))}
          </Fragment>
        ))}
        <ViewLoader
          fetchNextPage={() => fetchNextPage()}
          hasNextPage={hasNextPage}
        />
        {isFetchingNextPage && (
          <div className="w-12 h-12 animate-spin m-auto">
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
              className="lucide lucide-loader-2 w-full h-full"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        )}
      </div>
    </LayoutFollow>
  );
}

export default Following;
