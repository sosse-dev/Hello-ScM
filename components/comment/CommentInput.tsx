"use client";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface CommentInputProps {
  apiUrl: string;
  userId: string;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
}

function CommentInput({ apiUrl, userId, refetch }: CommentInputProps) {
  const pathname = usePathname();
  const postId = pathname?.slice(14, pathname.length);
  const router = useRouter();
  const [isOnline] = UseCheckConnection();
  const [comment, setComment] = useState("");

  const postFetchMessage = async ({ comment }: { comment: string }) => {
    if (comment === "") {
      return null;
    }

    await fetch(`${apiUrl}/${postId}/${userId}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(comment),
    });
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["comments"],
    mutationFn: postFetchMessage,
  });

  const handleSendComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (!isOnline) {
        return null;
      }

      await mutateAsync({
        comment,
      });

      setComment("");
      router.refresh();
      refetch();
    } catch (err) {
      return null;
    }
  };

  return (
    <form
      onSubmit={handleSendComment}
      className="w-full h-24 md:h-20 flex gap-x-3 bg-slate-300 border-t-2 border-black px-4 shrink-0 mb-20 md:mb-16 lg:mb-0"
    >
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="grow rounded-full my-3 px-5 bg-slate-200 outline-none border-2 border-black"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-12 h-12 my-auto grid place-items-center p-1"
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
          aria-label="send-comment"
          className="lucide lucide-send-horizontal w-full h-full"
        >
          <path d="m3 3 3 9-3 9 19-9Z" />
          <path d="M6 12h16" />
        </svg>
      </button>
    </form>
  );
}

export default CommentInput;
