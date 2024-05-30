"use client";
import { UseComment } from "@/hooks/comment/UseComment";
import { usePathname } from "next/dist/client/components/navigation";
import Image from "next/image";
import { ElementRef, useEffect, useRef } from "react";
import CommentInput from "./CommentInput";
import { Comment, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Delete, Loader } from "lucide-react";
import Loading from "../loader/Loading";

type CommentWithUserProfile = Comment & {
  user: User;
};

interface CommentsProps {
  apiUrl: string;
  userId: string;
}

function Comments({ apiUrl, userId }: CommentsProps) {
  const { status, data: session } = useSession();
  const pathname = usePathname();

  const postId = pathname?.slice(14, pathname.length);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = UseComment({
    apiUrl,
    postId: postId as string,
  });

  const bottomRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [data]);

  const handleDelete = async (commentId: string) => {
    const res = await fetch(`${apiUrl}/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return
    }

    refetch();
  };

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  return (
    <>
      <div className="grow flex flex-col gap-y-3 overflow-y-auto py-4 hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        {data?.data?.map((comment: CommentWithUserProfile, i: number) => {
          return (
            <div
              key={comment.id}
              className={`max-w-[88%] w-fit px-4 h-fit min-w-[20%] ml-5 ${
                comment.userId === userId
                  ? "self-end w-fit max-w-[88%] mr-8"
                  : ""
              } border-2 border-black px-3 py-2 flex justify-between items-center rounded-lg`}
            >
              <div className="flex flex-col">
                <div className="w-fit h-fit">
                  <div className="gap-x-2 items-center flex">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={
                          comment.user.image ?? "/default-profile-picture.png"
                        }
                        width={80}
                        height={80}
                        alt="profile-picture"
                      />
                    </div>
                    <h1 className="md:text-2xl text-xl font-bold flex items-center">
                      {comment.user.name}
                      <span
                        className={`${
                          comment.userId === userId ? "block pl-1" : "hidden"
                        } font-medium md:text-sm`}
                      >
                        You
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-zinc-800 text-xl md:text-lg">
                  {comment.comment}
                </p>
                {comment.userId === userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="w-6 h-6 text-red-600 rounded-lg mt-1 grid place-items-center"
                  >
                    <Delete />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className=""></div>
        {isLoading && <Loading />}
      </div>
      <CommentInput
        apiUrl="/api/comment/send"
        userId={userId}
        refetch={refetch}
      />
    </>
  );
}

export default Comments;
