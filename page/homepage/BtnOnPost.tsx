"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";

function BtnOnPost({
  sessionId,
  postId,
  commentsLength,
}: {
  sessionId: string;
  postId: string;
  commentsLength?: number;
}) {
  const { data: session } = useSession();
  const [toggleCopy, setToggleCopy] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const controllerRef = useRef<AbortController>();

  const getLikesLength = async () => {
    try {
      if (!sessionId) {
        console.log("there is no user id");
        return null;
      }

      if (!postId) {
        console.log("there is no post id");
        return null;
      }

      const res = await fetch(`/api/post/like/${sessionId}/${postId}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const { data: likes } = await res.json();

      if (typeof likes.length !== "number") {
        return null;
      }

      setLikes(likes.length);

      likes.forEach((_: unknown, i: number) => {
        if (likes[i].userId === session?.user.id) {
          setLiked(true);
        }
      });

      return null;
    } catch (err) {
      return null;
    }
  };

  const { isError, refetch } = useQuery({
    queryKey: ["likes"],
    queryFn: getLikesLength,
    refetchOnWindowFocus: false,
  });

  refetch();

  const handleLike = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      if (!sessionId) {
        console.log("there is no user id");
      }

      if (!postId) {
        console.log("there is no post id");
      }

      const res = await fetch(`/api/post/like/check/${sessionId}/${postId}`, {
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        console.log("bad fetch response");
      }

      const likes = await res.json();

      if (likes.data) {
        const res = await fetch(`/api/post/like/${likes.data.id}/${postId}`, {
          signal: controllerRef.current.signal,
          method: "DELETE",
        });

        if (!res.ok) {
          console.log("bad fetch response");
        }

        const { data } = await res.json();

        setLikes(data.length);
        setLiked(false);
        refetch();
        return null;
      }

      const res2 = await fetch(`/api/post/like/${sessionId}/${postId}`, {
        signal: controllerRef.current.signal,
        method: "POST",
        body: null,
      });

      if (!res2.ok) {
        console.log("bad fetch response");
      }

      const data2 = await res2.json();

      if (!data2.data) {
        console.log("no data");
        return null;
      }

      setLikes(data2.data.length);
      setLiked(true);
      refetch();
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="w-full items-end flex justify-end space-x-4 pr-6 pt-8 pb-8">
      <div className="flex flex-col items-center -space-y-14">
        <p className="text-lg px-1 font-bold">{likes ?? 0}</p>
        <button
          onClick={handleLike}
          className={`relative h-8 ${liked ? "text-green-700" : ""}`}
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
            aria-label="like"
            className="lucide lucide-heart w-full h-full object-contain"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
      <div className="relative flex flex-col items-center -space-y-14">
        <p className="text-lg px-1 font-bold">
          {commentsLength && commentsLength > 99
            ? 99 + "+"
            : commentsLength ?? 0}
        </p>
        <Link
          href={`/comment/post/${postId ? postId : "/"}`}
          className="relative h-8"
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
            aria-label="comment"
            className="lucide lucide-message-circle-more w-full h-full object-contain"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
        </Link>
      </div>
      <div className="relative flex flex-col items-center -space-y-14">
        <button onClick={() => setToggleCopy(true)} className="relative h-8">
          {!toggleCopy ? (
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
              aria-label="copy"
              className="lucide lucide-link w-full h-full object-contain"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          ) : (
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
              aria-label="copied"
              className="lucide lucide-unlink w-full h-full object-contain"
            >
              <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
              <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
              <line x1="8" x2="8" y1="2" y2="5" />
              <line x1="2" x2="5" y1="8" y2="8" />
              <line x1="16" x2="16" y1="19" y2="22" />
              <line x1="19" x2="22" y1="16" y2="16" />
            </svg>
          )}
        </button>
      </div>
      <div className="relative flex flex-col items-center -space-y-14">
        <Link href={`/report/post/${postId}`} className="relative h-8">
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
            aria-label="report"
            className="lucide lucide-flag w-full h-full object-contain"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default BtnOnPost;
