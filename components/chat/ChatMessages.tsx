"use client";

import { UseChatSocket } from "@/hooks/UseChatSocket";
import { UseChatQuery } from "@/hooks/UseChatQuery";
import { ElementRef, Fragment, useRef } from "react";
import { UseChatScroll } from "@/hooks/UseChatScroll";
import { usePathname } from "next/navigation";
import ViewLoader from "@/libs/ViewLoader";
import OfflinePage from "../OfflinePage";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";

interface ChatMessagesProps {
  apiUrl: string;
  userId: string;
}

export const ChatMessages = ({ apiUrl, userId }: ChatMessagesProps) => {
  const pathname = usePathname();
  const messageId = pathname?.slice(14, pathname?.length);
  const queryKey = `chat:${messageId}`;
  const addKey = `chat:${messageId}:messages`;
  const [isOnline] = UseCheckConnection();

  const containerChatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    UseChatQuery({ queryKey, apiUrl, messageId: messageId as string });

  UseChatSocket({ queryKey, addKey });

  UseChatScroll({
    containerChatRef,
    bottomRef,
    loadMore: fetchNextPage,
    isLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.chats?.length ?? 0,
  });

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <div
      ref={containerChatRef}
      className="grow flex flex-col-reverse gap-y-3 px-8 pt-4 pb-56 bg-slate-200 overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar"
    >
      <div ref={bottomRef} />
      {data?.pages?.map((data: any, i: number) => (
        <Fragment key={i}>
          {data.chats.map((message: any, i: number) => (
            <div
              key={data.id ?? i}
              className={`w-fit h-fit px-4 py-2 flex flex-col bg-slate-300 ${
                message.senderId === userId || message.receiverId === userId
                  ? "self-end"
                  : ""
              }`}
            >
              <h1 className="font-semibold text-3xl">
                {message.senderId === userId ? "You" : message.sender.name}
              </h1>
              <p className="">wait</p>
              <p className="text-2xl">{message.chat}</p>
            </div>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <div className="grow  bg-green-600 flex justify-center">
          {isFetchingNextPage ? (
            <div className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <ViewLoader
              fetchNextPage={() => fetchNextPage()}
              hasNextPage={hasNextPage}
            />
          )}
        </div>
      )}
    </div>
  );
};
