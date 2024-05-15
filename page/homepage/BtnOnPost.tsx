"use client";
import { copyLinkUrlPost } from "@/lib/copyLinkUrlPost";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Link2,
  MailWarning,
  MailWarningIcon,
  MessageCircle,
  MessageCircleDashed,
  Unlink,
} from "lucide-react";
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
        return null;
      }

      if (!postId) {
        return null;
      }

      const res = await fetch(`/api/post/like/${sessionId}/${postId}`, {
        method: "GET",
      });

      if (!res.ok) {
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

  const { refetch } = useQuery({
    queryKey: ["likes"],
    queryFn: getLikesLength,
    refetchOnWindowFocus: false,
  });

  const handleLike = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      if (!sessionId) {
        return;
      }

      if (!postId) {
        return;
      }

      const res = await fetch(`/api/post/like/check/${sessionId}/${postId}`, {
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        return;
      }

      const likes = await res.json();

      if (likes.data) {
        const res = await fetch(`/api/post/like/${likes.data.id}/${postId}`, {
          signal: controllerRef.current.signal,
          method: "DELETE",
        });

        if (!res.ok) {
          return;
        }

        const { data } = await res.json();

        setLikes(data.length);
        setLiked(false);
        refetch();
        return;
      }

      const res2 = await fetch(`/api/post/like/${sessionId}/${postId}`, {
        signal: controllerRef.current.signal,
        method: "POST",
        body: null,
      });

      if (!res2.ok) {
        return
      }

      const data2 = await res2.json();

      if (!data2.data) {
        return;
      }

      setLikes(data2.data.length);
      setLiked(true);
      refetch();
    } catch {
      return;
    }
  };

  return (
    <div
      style={{ paddingRight: "20px", paddingTop: "20px" }}
      className="w-full items-end flex justify-end space-x-4"
    >
      <div className="flex flex-col-reverse items-center -space-y-14">
        <p className="text-lg px-1 font-bold">{likes ?? 0}</p>
        <button
          onClick={handleLike}
          style={{ color: `${liked ? "green" : ""}` }}
          className="relative h-8"
        >
          <Heart size={30} />
        </button>
      </div>
      <div className="relative flex flex-col-reverse items-center -space-y-14">
        <p className="text-lg px-1 font-bold">
          {commentsLength && commentsLength > 99
            ? 99 + "+"
            : commentsLength ?? 0}
        </p>
        <Link
          href={`/comment/post/${postId ? postId : "/"}`}
          className="relative h-8"
        >
          <MessageCircleDashed size={30} />
        </Link>
      </div>
      <div className="relative flex flex-col items-center -space-y-14">
        <button
          title="copy url"
          onClick={() => {
            setToggleCopy(true), copyLinkUrlPost(postId);
          }}
          className="relative h-8"
        >
          {!toggleCopy ? <Link2 size={30} /> : <Unlink size={30} />}
        </button>
      </div>
      <div className="relative flex flex-col items-center -space-y-14">
        <Link
          title="report post"
          href={`/report/post/${postId}`}
          className="relative h-8"
        >
          <MailWarning size={30} />
        </Link>
      </div>
    </div>
  );
}

export default BtnOnPost;
