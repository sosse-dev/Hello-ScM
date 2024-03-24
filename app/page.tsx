import Link from "next/link";
import Feed from "@/page/homepage/Feed";
import Image from "next/image";
import getFollowing from "./actions/getFollowing";
import ImgNav from "@/page/homepage/ImgNav";
import getSession from "./actions/getSession";

export default async function Home() {
  const session = await getSession();
  const following = await getFollowing();

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
      {/* feeds con */}
      <div className="w-full h-full bg-slate-50 col-span-6 lg:col-span-7 overflow-y-auto pb-24 lg:pb-6 hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        {/* Navbar Menu */}
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
                aria-label="message"
                className="lucide lucide-message-circle w-full h-full"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            </Link>
            <Link
              href="/setting"
              className="text-lg h-full grid place-items-center py-7"
            >
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
                aria-label="setting"
                className="lucide lucide-settings w-full h-full"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </div>
        </div>
        <div
          className={`h-[8rem] w-full border-b-2 border-slate-500 overflow-x-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar ${
            !following || following?.length === 0 ? "hidden" : "block"
          }`}
        >
          <div className="h-full w-fit flex px-2 md:gap-x-2 items-center">
            {following?.map((data: any) => (
              <div
                key={data.follower.id}
                className="w-fit h-fit px-1 flex flex-col items-center justify-center"
              >
                <Link
                  href={`/${data.follower.username ?? "/"}`}
                  className="h-[5rem] w-[5rem] flex flex-col items-center justify-center rounded-full shrink-0 mx-2 overflow-hidden cursor-pointer"
                >
                  <Image
                    src={data.follower.image ?? "/default-profile-picture.png"}
                    width={60}
                    height={60}
                    alt="profile-picture"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <Link
                  href={`/${data.follower.username ?? "/"}`}
                  className="w-full text-center text-lg font-medium cursor-pointer"
                >
                  {data.follower.name.length > 12
                    ? data.follower.name.slice(0, 12)
                    : data.follower.name}
                  {data.follower.name.length > 12 ? " ..." : ""}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Feed />
      </div>
    </>
  );
}
