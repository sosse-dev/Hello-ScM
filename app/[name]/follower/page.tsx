"use client";

import BackButton from "@/components/button/BackButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import qs from "query-string";
import ViewLoader from "@/libs/ViewLoader";
import { Follow, User } from "@prisma/client";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import OfflinePage from "@/components/OfflinePage";
import ErrorPage from "@/components/ErrorPage";

type FollowerWithUserProfile = Follow & {
  following: User;
};

function Follower() {
  const pathname = usePathname();
  const [isOnline] = UseCheckConnection();

  const getFollower = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/follow/${pathname?.slice(0, -9)}`,
        query: {
          cursor1: pageParam,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        console.log("bad fetch response");
      }

      const follower = await res.json();

      return follower;
    } catch (err) {
      return null;
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["followers"],
    queryFn: getFollower,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor1;
    },
    refetchOnWindowFocus: false,
    initialPageParam: undefined,
  });

  if (!isOnline) {
    return <OfflinePage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="relative w-full h-fit overflow-hidden ">
      <div className="absolute h-[6rem] w-full bg-slate-200 mb-2 grid place-items-center">
        <BackButton />
        <h1 className="text-2xl">Follower</h1>
      </div>
      <div className="h-[100vh] w-full mt-24 flex flex-col space-y-3 px-2 overflow-y-auto pb-20 pt-3">
        {data?.pages[0]?.data.length === 0 && !isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center mb-20">
            <h1 className="text-6xl font-bold">No Follower</h1>
            <p className="text-2xl">He/She doesn{"'"}t have any follower</p>
          </div>
        )}
        {isLoading && (
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
              aria-label="loader"
              className="lucide lucide-loader-2 w-full h-full"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        )}
        {data?.pages?.map((externalData, i) => (
          <Fragment key={i}>
            {externalData?.data?.map((data: FollowerWithUserProfile) => (
              <Link
                href={`/${data.following.username}`}
                key={data.id}
                className="h-[7rem] w-full shrink-0 flex px-4 bg-slate-300 rounded-md"
              >
                <div className="h-full w-[40%] flex space-x-1 md:space-x-3">
                  <div className="h-full w-fit grid place-items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={
                          data.following.image ?? "/default-profile-picture.png"
                        }
                        priority
                        width={80}
                        height={80}
                        alt="profile-picture"
                      />
                    </div>
                  </div>
                  <div className="h-full flex flex-col justify-center">
                    <h1 className="text-xl">{data.following.name}</h1>
                    <p className="line-clamp-1">{data.following.desc}</p>
                  </div>
                </div>
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
    </div>
  );
}

export default Follower;
