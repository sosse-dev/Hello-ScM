import getSession from "@/app/actions/getSession";
import BackButton from "@/components/button/BackButton";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import ChatProfileUser from "@/components/chat/ChatProfileUser";

async function Chat() {
  const session = await getSession();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative w-full h-[4rem] shrink-0 bg-slate-100 flex flex-col border-b-2 border-black justify-center items-center">
        <ChatProfileUser sessionId={session?.user.id as string} />
        {/* <SocketIndicator /> */}
        <BackButton />
      </div>
      <ChatMessages
        apiUrl="/api/message/getChat"
        userId={session?.user.id as string}
      />
      <ChatInput
        senderId={session?.user.id as string}
        socketUrlMessage="/api/socket/messages"
      />
    </div>
  );
}

export default Chat;
