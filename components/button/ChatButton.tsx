"use client";

import { addMessageRoom } from "@/libs/addMessageRoom";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ChatButton({
  receiverId,
  senderId,
  apiUrl,
}: {
  receiverId: string;
  senderId: string;
  apiUrl: string;
}) {
  const { data, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: addMessageRoom,
  });
  const router = useRouter();

  const handleMessageRoom = async () => {
    try {
      mutateAsync({
        receiverId,
        senderId,
        apiUrl,
      });
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push(`/message/chat/${data.message.id}`);
    }
  }, [isSuccess, data?.message?.id, router]);

  return (
    <button
      onClick={handleMessageRoom}
      disabled={isPending}
      className="grow bg-green-700 hover:bg-green-600 rounded-md text-white flex items-center justify-center gap-x-2"
    >
      Chat
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
        aria-label="add-message"
        className="lucide lucide-message-circle-plus w-[15%] md:w-[10%] h-[90%] md:h-[60%]"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    </button>
  );
}

export default ChatButton;
