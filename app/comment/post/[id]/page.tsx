import getSession from "@/app/actions/getSession";
import BackButton from "@/components/button/BackButton";
import Comments from "@/components/comment/Comments";
import Link from "next/link";

async function Commentars() {
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
    <>
      <div className="relative w-full h-screen max-w-[50rem] flex flex-col bg-slate-200 ">
        <div className="relative w-full h-20 bg-slate-300 border-b-2 mb-1 border-black flex shrink-0">
          <BackButton />
        </div>
        <Comments
          apiUrl="/api/comment/postId"
          userId={session?.user.id as string}
        />
      </div>
    </>
  );
}

export default Commentars;
