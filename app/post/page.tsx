"use client";
import BtnOnPost from "@/page/homepage/BtnOnPost";
import ShowMore2 from "@/page/homepage/ShowMore2";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/components/button/BackButton";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import OfflinePage from "@/components/OfflinePage";
import ErrorPage from "@/components/ErrorPage";
import Link from "next/link";

function Posted() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const userId = query?.get("id");
  const [isOnline] = UseCheckConnection();

  const getOnePost = async () => {
    try {
      if (!pathname) {
        return null;
      }

      const res = await fetch(`/api/post/postId/${userId}`);

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const { data } = await res.json();

      if (!data) {
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/postId/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.log("bad fetch response");
      }

      router.push("/");
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post"],
    queryFn: getOnePost,
  });

  if (isLoading) {
    return (
      <div className="w-12 h-12 animate-spin m-auto">
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
          aria-label="loader"
          className="lucide lucide-loader-2 w-full h-full"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  if (!session?.user.username && status === "authenticated") {
    router.push("/profile/add-profile");
    return null;
  }

  if (status === "unauthenticated") {
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

  if (!isOnline) {
    return <OfflinePage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col mx-auto h-auto w-full mb-6 overflow-y-auto pb-14">
      <div className="relative w-full h-20 bg-slate-300 border-b-2 border-black">
        <BackButton />
      </div>
      <div className="h-fit py-3 w-full flex justify-between bg-slate-300">
        <div
          onClick={() => router.push(`/${data?.user.username}`)}
          className="h-full flex items-center space-x-1 cursor-pointer"
        >
          <div className="w-16 h-16 ml-2 rounded-full overflow-hidden">
            <Image
              src={data?.user.image ?? "/default-profile-picture.png"}
              width={80}
              height={80}
              alt="profile-picture"
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-3xl font-medium">{data?.user?.name}</h1>
            <p className="md:text-sm">{data?.user?.name}</p>
          </div>
        </div>
      </div>
      <div
        className={`flex w-full h-[40rem] md:h-[43rem] lg:h-[26rem] 2xl:h-[50rem] ${
          data?.image ? "block" : "hidden"
        }`}
      >
        {data?.image && (
          <Image
            className="h-full w-full object-contain"
            src={data?.image}
            priority={true}
            width={200}
            height={200}
            alt="img-photo"
          />
        )}
      </div>

      <div className="bg-slate-200 py-4 h-fit w-full">
        {/* info */}
        <ShowMore2 title={data?.title} desc={data?.desc} />
        <BtnOnPost
          sessionId={session?.user.id as string}
          postId={data?.id}
          commentsLength={data?.comments?.length}
        />
        {data?.user?.id === session?.user.id && (
          <button
            onClick={handleDeletePost}
            className="bg-red-600 hover:bg-red-700 text-white ml-8 rounded-md flex px-5 py-3 gap-x-1"
          >
            Delete
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
              aria-label="delete"
              className="lucide lucide-delete w-full h-[50%]"
            >
              <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
              <line x1="18" x2="12" y1="9" y2="15" />
              <line x1="12" x2="18" y1="9" y2="15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Posted;
