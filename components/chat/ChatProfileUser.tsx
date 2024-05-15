"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import qs from "query-string";

function ChatProfileUser({ sessionId }: { sessionId: string }) {
  const pathname = usePathname();
  const messageId = pathname?.slice(14, pathname.length);

  const fetchHandleUserProfile = async () => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/message/getReceiverOrSender",
        query: {
          messageId: messageId,
          sessionId: sessionId,
        },
      });

      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userProfileOnMessage"],
    queryFn: fetchHandleUserProfile,
  });

  const name = data?.data?.receiver?.name ?? data?.data?.sender?.name;
  const username = data?.data?.receiver?.username ?? data?.data?.sender?.username;

  return (
    <Link
      href={`/${username}`}
      className="absolute right-0 pl-2 pr-4 w-fit h-full flex items-center gap-x-1 bg-slate-700 hover:bg-slate-800 text-white"
    >
      <div className="w-14 h-14 grid place-items-center">
        <Image
          src={
            data?.data?.sender?.image
              ? data?.data?.sender?.image
              : data?.data?.receiver?.image ?? "/default-profile-picture.png"
          }
          width={50}
          height={50}
          className="object-fill rounded-full"
          alt="profile-picture"
        />
      </div>
      <div className="h-fit flex flex-col -space-y-1">
        <h1 className="text-xl font-semibold">
          {name?.length > 12 ? name?.slice(0, 12) : name}
          {name?.length > 12 ? " ..." : ""}
        </h1>
        <p className="">
          {username?.length > 12 ? username?.slice(0, 12) : username}
          {username?.length > 12 ? " ..." : ""}
        </p>
      </div>
    </Link>
  );
}

export default ChatProfileUser;
