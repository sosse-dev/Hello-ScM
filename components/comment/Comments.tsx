"use client";
import { UseComment } from "@/hooks/comment/UseComment";
import { usePathname } from "next/dist/client/components/navigation";
import Image from "next/image";
import { ElementRef, useEffect, useRef } from "react";
import CommentInput from "./CommentInput";
import { Comment, User } from "@prisma/client";
import ErrorPage from "../ErrorPage";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OfflinePage from "../OfflinePage";

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
  const [isOnline] = UseCheckConnection();
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
    if (!isOnline) {
      return null;
    }

    const res = await fetch(`${apiUrl}/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.log("bad fetch response");
    }

    refetch();
  };

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if(!isOnline) {
    return <OfflinePage />
  }

  return (
    <>
      <div className="grow flex flex-col gap-y-3 overflow-y-auto py-4 hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        {data?.data?.map((comment: CommentWithUserProfile, i: number) => {
          return (
            <div
              key={comment.id || i}
              className={`max-w-[88%] w-fit px-4 h-fit min-w-[20%] ml-5 ${
                comment.userId === userId
                  ? "self-end w-fit max-w-[88%] mr-8"
                  : ""
              } bg-slate-300 px-3 py-2 flex justify-between items-center rounded-lg`}
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
                      aria-label="delete-comment"
                      className="lucide lucide-delete w-full h-full"
                    >
                      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                      <line x1="18" x2="12" y1="9" y2="15" />
                      <line x1="12" x2="18" y1="9" y2="15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className=""></div>
        {isLoading && (
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
