import ChattedUser from "./ChattedUser";
import getMessage from "../actions/getMessage";
import Link from "next/link";
import ImgNav from "@/page/homepage/ImgNav";
import { Settings } from "lucide-react";

async function Message() {
  const chattedUser = await getMessage();
  return (
    <>
      <div className="absolute z-40 w-full h-full bg-slate-50 flex flex-col hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        <div className="w-full h-20 flex justify-between items-center px-5 border-b-2 border-black">
          <h1 className="text-3xl font-bold">Your Message</h1>
          <div className="h-full flex gap-x-2">
            <ImgNav />
            <Link
              href="/setting"
              className="relative text-lg w-10 h-full grid place-items-center"
            >
              <Settings size={30} />
            </Link>
          </div>
        </div>
        {/* chatted user */}
        <ChattedUser data={chattedUser} />
      </div>
    </>
  );
}

export default Message;
