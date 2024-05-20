"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User } from "@prisma/client";
import Loading from "@/components/loader/Loading";
import { useFetchAllPost } from "@/hooks/action/useFetchAllPost";
import Loading2 from "@/components/loader/Loading2";

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
      {isFetchingNextPage && <Loading2 />}
    </>
  );
}

export default PostedPosts;
