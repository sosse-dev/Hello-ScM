import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Message, User } from "@prisma/client";

interface ChatSocketProps {
  queryKey: string;
  addKey: string;
}

type MessageWithUserProfile = Message & {
  sender: User;
};

export const UseChatSocket = ({ queryKey, addKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(addKey, (message: MessageWithUserProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                chats: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          chats: [message, ...newData[0].chats],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
    };
  }, [queryKey, addKey, socket, queryClient]);
};
