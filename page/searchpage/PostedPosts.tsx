"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import qs from "query-string";
import ViewLoader from "@/libs/ViewLoader";
import { Post, User } from "@prisma/client";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import ErrorPage from "@/components/ErrorPage";
import OfflinePage from "@/components/OfflinePage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PostWithUserProfile = Post & {
  user: User;
};

function PostedPosts() {
  const [isOnline] = UseCheckConnection();
  const { status, data: session } = useSession();
  const router = useRouter();
  const getAllPosts = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/post",
        query: {
          cursor: pageParam,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["postsExplore"],
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
    );
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      <div className="h-auto w-full columns-2 sm:columns-3 md:pb-20 gap-1 pb-56">
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
                      className="h-48 lg:h-64 w-full pb-1 cursor-pointer object-cover break-inside-avoid"
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
                    className="w-full h-48 lg:h-64 text-xl font-semibold break-inside-avoid bg-slate-300 grid place-items-center mb-1 cursor-pointer hover:opacity-80"
                  >
                    {post?.title}
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
