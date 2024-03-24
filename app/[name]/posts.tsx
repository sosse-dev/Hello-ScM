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

function Posts({ id }: { id: string }) {
  const getThisPosts = async ({ pageParam = undefined }) => {
    try {
      if (!id) {
        return null;
      }

      const url = qs.stringifyUrl(
        {
          url: "/api/post/posted",
          query: {
            cursor: pageParam,
            userId: id,
          },
        },
        { skipNull: true }
      );

      const res = await fetch(url);

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const { data, nextCursor } = await res.json();

      if (!data) {
        return null;
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
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
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
    <div className="h-full bg-slate-100">
      <div className="relative h-auto w-full columns-2 sm:columns-3 gap-1 pb-24">
        {posts?.pages.map((data: any, i: number) => (
          <Fragment key={i}>
            {data?.data?.map((post: PostWithUserProfile) => {
              if (!post.image) {
                return (
                  <Link
                    key={post.id}
                    href={{
                      pathname: "/post",
                      query: { id: post.id },
                    }}
                    className="w-full h-44 md:h-56 text-xl break-inside-avoid break-all text-center font-semibold px-4 bg-slate-300 grid place-items-center mb-1 cursor-pointer hover:bg-slate-400"
                  >
                    {/* chechk? */}
                    {post?.title?.length >= 40
                      ? post?.title?.slice(0, 40) + " ..."
                      : post?.title}
                  </Link>
                );
              }

              return (
                <Image
                  key={post.id}
                  src={post.image ?? ""}
                  width={400}
                  height={400}
                  className="h-auto w-full pb-1 cursor-pointer break-inside-avoid"
                  alt="post"
                />
              );
            })}
          </Fragment>
        ))}
      </div>
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
      <ViewLoader
        fetchNextPage={() => fetchNextPage()}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}

export default Posts;
