"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User } from "@prisma/client";
import { useFetchPosts } from "@/hooks/action/useFetchPosts";
import Loading2 from "@/components/loader/Loading2";

type PostWithUserProfile = Post & {
  user: User;
};

function Posts({ id }: { id: string }) {
  const { posts, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useFetchPosts({ id });

  if (isLoading) {
    return <Loading2 />;
  }

  return (
    <div className="h-full bg-slate-100">
      <div className="relative h-auto w-full columns-2 sm:columns-3 gap-1 pb-24">
        {posts?.pages.map((data, i: number) => (
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
