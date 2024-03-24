"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function DeletePostBtn({ postId }: { postId: string }) {
  const router = useRouter();
  const controllerRef = useRef<AbortController>();

  const handleDeletePost = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      await fetch(`/api/report/post?postId=${postId}`, {
        method: "DELETE",
        signal: controllerRef.current?.signal,
      });

      router.refresh();
    } catch (err) {
      return null;
    }
  };

  return (
    <button
      onClick={handleDeletePost}
      className="w-fit h-fit px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
    >
      Delete the Post
    </button>
  );
}
