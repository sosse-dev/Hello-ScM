"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User } from "@prisma/client";
import { useFetchCurrentUserPosts } from "@/hooks/action/useFetchCurrentUserPosts";
import Loading2 from "@/components/loader/Loading2";

type PostWithUserProfile = Post & {
  user: User;
};

function PostsProfile({ sessionId }: { sessionId: string }) {
  const {
    posts,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useFetchCurrentUserPosts(sessionId);
  
  if (isLoading) {
    return <Loading2 />;
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
                      loading="lazy"
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
      {isFetchingNextPage && <Loading2 />}
    </div>
  );
}

export default PostsProfile;
