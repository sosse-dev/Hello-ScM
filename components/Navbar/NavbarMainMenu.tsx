import Link from "next/link";
import ImgNav from "@/page/homepage/ImgNav";
import { MessageSquare, Settings } from "lucide-react";

export default function NavbarMainMenu() {
  return (
    <div className="z-50 h-24 w-full max-w-[50rem] flex justify-between bg-slate-100">
      <Link href="/" className="text-3xl font-bold my-auto ml-3">
        Hello ScM!
      </Link>
      <div className="h-full flex space-x-4 mr-3">
        <div className="h-full grid place-items-center">
          <ImgNav />
        </div>
        <Link
          href="/message"
          className="text-lg h-full grid place-items-center py-7"
        >
          <MessageSquare size={30} />
        </Link>
        <Link
          href="/setting"
          className="text-lg h-full grid place-items-center py-7"
        >
          <Settings size={30} />
        </Link>
      </div>
    </div>
  );
}
