"use client";
import Image from "next/image";
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
      {isFetchingNextPage && <Loading2 />}
      <ViewLoader
        fetchNextPage={() => fetchNextPage()}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}

export default Posts;
