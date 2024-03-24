"use client";

import Image from "next/image";
import ShowMore2 from "./ShowMore2";
import BtnOnPost from "./BtnOnPost";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import ViewLoader from "@/libs/ViewLoader";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import OfflinePage from "@/components/OfflinePage";
import { Post, User, Comment } from "@prisma/client";

type PostWithUserProfile = Post & {
  user: User;
  comments: Comment[];
};

function Feed() {
  const { status, data: session } = useSession();
  const [isOnline] = UseCheckConnection();
  const router = useRouter();

  const getAllPosts = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/post/feed",
      query: {
        cursor: pageParam,
      },
    });

    const res = await fetch(url);

    if (!res.ok) {
      console.log("bad fetch response");
      return null;
    }
    const { data, nextCursor } = await res.json();

    if (!data) {
      console.log("no data in client side here maybe cursor undefined");
      return null;
    }

    return { data, nextCursor };
  };

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: getAllPosts,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
      initialPageParam: undefined,
    });

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-12 h-12 animate-spin mx-auto mt-6">
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
    );
  }

  if (!isOnline) {
    return (
      <div className="w-full grid place-items-center mt-4">
        <OfflinePage />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-fit pb-8">
      {data?.pages?.map((firstData, index: number) => (
        <Fragment key={index}>
          {firstData?.data?.map((post: PostWithUserProfile) => {
            return (
              <div
                key={post?.id}
                className="flex flex-col mx-auto h-auto w-full bg-slate-200 mb-6 overflow-hidden"
              >
                <div className="h-fit py-3 w-full flex justify-between">
                  <div
                    onClick={() => router.push(`/${post?.user?.username}`)}
                    className="h-full flex items-center space-x-1 cursor-pointer"
                  >
                    <div className="w-16 h-16 ml-2 rounded-full overflow-hidden">
                      <Image
                        src={
                          post?.user?.image ?? "/default-profile-picture.png"
                        }
                        width={80}
                        height={80}
                        alt="profile-picture"
                      />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <h1 className="text-3xl font-medium">
                        {post?.user?.name}
                      </h1>
                      <p className="md:text-sm">{post?.user?.username}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex w-full h-[40rem] md:h-[43rem] lg:h-[26rem] 2xl:h-[50rem] ${
                    post?.image ? "block" : "hidden"
                  }`}
                >
                  <Image
                    className="h-full w-full object-contain"
                    src={post?.image ?? "/default-profile-picture.png"}
                    priority={true}
                    width={200}
                    height={200}
                    alt="img-photo"
                  />
                </div>

                <div className="py-4 h-fit w-full">
                  <ShowMore2 title={post?.title} desc={post?.desc as string} />
                  <BtnOnPost
                    commentsLength={post?.comments?.length as number}
                    sessionId={session?.user.id as string}
                    postId={post?.id}
                  />
                </div>
              </div>
            );
          })}
        </Fragment>
      ))}
      {isFetchingNextPage && (
        <div className="w-12 h-12 animate-spin mx-auto mt-6">
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
      {!isFetchingNextPage && (
        <ViewLoader
          fetchNextPage={() => fetchNextPage()}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}

export default Feed;
