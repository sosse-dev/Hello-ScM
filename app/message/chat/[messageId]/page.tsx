import getSession from "@/app/actions/getSession";
import BackButton from "@/components/button/BackButton";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import ChatProfileUser from "@/components/chat/ChatProfileUser";
import Link from "next/link";

async function Chat() {
  const session = await getSession();
  
  if (!session) {
    return (
      <div className="m-auto flex flex-col items-center space-y-2">
        <h1 className="text-3xl font-bold">You haven{"'"}t signed up yet</h1>
        <Link
          href="/profile"
          className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative w-full h-20 shrink-0 bg-slate-300 flex flex-col border-b-2 border-black justify-center items-center">
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
