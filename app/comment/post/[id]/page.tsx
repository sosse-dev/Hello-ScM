import getSession from "@/app/actions/getSession";
import BackButton from "@/components/button/BackButton";
import Comments from "@/components/comment/Comments";

async function Commentars() {
  const session = await getSession();

  return (
    <>
      <div className="relative w-full h-screen max-w-[50rem] flex flex-col bg-slate-100">
        <div className="relative w-full h-20 border-b-2 mb-1 border-black flex shrink-0 bg-slate-50">
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
