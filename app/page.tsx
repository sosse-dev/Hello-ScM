import Link from "next/link";
import Feed from "@/page/homepage/Feed";
import Image from "next/image";
import getFollowing from "./actions/getFollowing";
import NavbarMainMenu from "@/components/Navbar/NavbarMainMenu";

export default async function Home() {
  const following = await getFollowing();

  return (
    <>
      {/* feeds con */}
      <div className="relative w-full h-full bg-slate-50 col-span-6 lg:col-span-7 overflow-y-auto pb-24 lg:pb-6 hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        {/* Navbar Menu */}
        <NavbarMainMenu />
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
                    loading="lazy"
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
