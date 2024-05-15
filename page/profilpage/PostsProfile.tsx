"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import qs from "query-string";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useFetchCurrentUserPosts } from "@/hooks/action/useFetchCurrentUserPosts";
import Loading from "@/components/loader/Loading";
import Loading2 from "@/components/loader/Loading2";

type PostWithUserProfile = Post & {
  user: User;
};

function PostsProfile({ sessionId }: { sessionId: string }) {
  const { posts, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage } =
    useFetchCurrentUserPosts(sessionId);

  if (isLoading) {
    return <Loading2 />
  }

  return (
    <div className="h-fit min-h-[20rem] w-full overflow-y-auto pb-24">
      <div className="h-fit w-full columns-2 sm:columns-3 gap-1">
        {posts?.pages?.map((data, i: number) => (
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
                      className="cursor-pointer break-inside-avoid object-cover"
                      alt="post"
                    />
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
