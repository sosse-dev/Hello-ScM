"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import qs from "query-string";
import ViewLoader from "@/libs/ViewLoader";
import { Post, User } from "@prisma/client";

type PostWithUserProfile = Post & {
  user: User;
};

function PostsProfile({ sessionId }: { sessionId: string }) {
  const getThisPosts = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/post/posted",
        query: {
          cursor: pageParam,
          userId: sessionId,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        console.log("bad fetch response");
      }

      const { data, nextCursor } = await res.json();

      if (!data) {
        console.log("No post");
      }

      return { data, nextCursor };
    } catch (err) {
      return null;
    }
  };

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPosts"],
    queryFn: getThisPosts,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor;
    },
    initialPageParam: undefined,
  });

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

  return (
    <div className="h-fit min-h-[20rem] w-full overflow-y-auto pb-24">
      <div className="h-fit w-full columns-2 sm:columns-3 gap-1">
        {posts?.pages?.map((data: any, i: number) => (
          <Fragment key={i}>
            {data?.data?.map((post: PostWithUserProfile, i: number) => {
              if (post?.image) {
                return (
                  <Link
                    key={post?.id ?? i}
                    href={{
                      pathname: "/post",
                      query: { id: post.id },
                    }}
                  >
                    <Image
                      src={post?.image ?? ""}
                      width={400}
                      height={400}
                      className="h-48 lg:h-64 w-full pb-1 cursor-pointer break-inside-avoid object-cover"
                      alt="post"
                    />
                  </Link>
                );
              }

              if (!post?.image) {
                return (
                  <Link
                    key={post?.id ?? i}
                    href={{
                      pathname: "/post",
                      query: { id: post.id },
                    }}
                    className="w-full h-44 md:h-56 text-xl break-inside-avoid break-all font-semibold text-center bg-slate-300 grid place-items-center mb-1"
                  >
                    {post?.title?.length >= 40
                      ? post?.title?.slice(0, 40) + " ..."
                      : post?.title}
                  </Link>
                );
              }
            })}
          </Fragment>
        ))}
      </div>
      <ViewLoader
        fetchNextPage={() => fetchNextPage()}
        hasNextPage={hasNextPage}
      />
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
    </div>
  );
}

export default PostsProfile;
