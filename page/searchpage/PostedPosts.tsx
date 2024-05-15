"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User } from "@prisma/client";
import Loading from "@/components/loader/Loading";
import { useFetchAllPost } from "@/hooks/action/useFetchAllPost";

type PostWithUserProfile = Post & {
  user: User;
};

function PostedPosts() {
  const { data, isFetchingNextPage, hasNextPage, isLoading, fetchNextPage } =
    useFetchAllPost();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="h-auto w-full columns-2 sm:columns-3 md:pb-20 gap-1 pb-56 border-t-2 border-black">
        {data?.pages.map((data, i: number) => (
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
                      className="h-48 lg:h-64 w-full cursor-pointer object-cover break-inside-avoid border-black"
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
    </>
  );
}

export default PostedPosts;
