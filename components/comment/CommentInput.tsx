"use client";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { Send } from "lucide-react";
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
      className="w-full h-16 flex gap-x-3 bg-slate-300 border-t-2 border-black px-4 shrink-0 mb-12 lg:mb-0"
    >
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="grow rounded-full my-1 px-5 bg-slate-200 outline-none border-2 border-black"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-12 h-12 my-auto grid place-items-center bg-green-700 text-white rounded-full"
      >
        <Send className="" />
      </button>
    </form>
  );
}

export default CommentInput;
