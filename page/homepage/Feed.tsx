"use client";
import Image from "next/image";
import ShowMore2 from "./ShowMore2";
import BtnOnPost from "./BtnOnPost";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import ViewLoader from "@/lib/ViewLoader";
import { Post, User, Comment } from "@prisma/client";
import { useFetchFeed } from "@/hooks/action/useFetchFeed";
import Loading2 from "@/components/loader/Loading2";
import GreetingUser from "./GreetingUser";
import HeaderFeed from "../../components/Header/HeaderFeed";

type PostWithUserProfile = Post & {
  user: User;
  comments: Comment[];
};

function Feed() {
  const { data: session } = useSession();
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useFetchFeed();
  const router = useRouter();

  if (isLoading) {
    return <Loading2 />;
  }

  return (
    <div className="flex flex-col h-fit pb-8">
      {data?.pages?.map((firstData, index: number) => {
        if (firstData?.data.length === 0 && !isLoading) {
          return (
            <GreetingUser index={index} name={session?.user.name as string} />
          );
        }
        return (
          <Fragment key={index}>
            {firstData?.data?.map((post: PostWithUserProfile) => {
              return (
                <div
                  key={post?.id}
                  className="flex flex-col mx-auto h-auto w-full border-b-2 border-black mb-6 overflow-hidden"
                >
                  <HeaderFeed
                    router={router}
                    name={post.user.name as string}
                    username={post.user.username as string}
                    image={post.user.image as string}
                  />
                  <div
                    style={{ height: "24rem" }}
                    className={`flex w-full ${
                      post?.image ? "block" : "hidden"
                    }`}
                  >
                    <Image
                      className="h-full w-full object-contain"
                      src={post?.image ?? "/default-profile-picture.png"}
                      width={200}
                      height={200}
                      loading="lazy"
                      alt="img-photo"
                    />
                  </div>

                  <div className="py-4 h-fit w-full bg-slate-100 border-black">
                    <ShowMore2
                      title={post?.title}
                      desc={post?.desc as string}
                    />
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
        );
      })}
      {isFetchingNextPage && <Loading2 />}
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
