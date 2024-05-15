"use client";

import { addMessageRoom } from "@/lib/addMessageRoom";
import { useMutation } from "@tanstack/react-query";
import { MessageCirclePlus } from "lucide-react";
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
      <MessageCirclePlus />
    </button>
  );
}

export default ChatButton;
