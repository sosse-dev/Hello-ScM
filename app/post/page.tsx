"use client";
import BtnOnPost from "@/page/homepage/BtnOnPost";
import ShowMore2 from "@/page/homepage/ShowMore2";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Delete } from "lucide-react";
import Loading from "@/components/loader/Loading";
import { useFetchPost } from "@/hooks/action/useFetchPost";
import { handleDeletePost } from "@/lib/handleDeletePost";

function Posted() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const userId = query?.get("id");

  const { data, isLoading } = useFetchPost(
    userId as string,
    pathname as string
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col mx-auto h-auto w-full mb-6 overflow-y-auto pb-14">
      <div className="h-fit py-3 w-full flex justify-">
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
      <div className="w-full h-fit flex flex-col">
        <div className="relative w-full h-[20rem] md:h-[25rem]">
          <Image
            className="object-contain"
            src={data?.image}
            priority={true}
            fill
            alt="img-photo"
          />
        </div>
      </div>

      <div className="py-4 h-fit w-full">
        {/* info */}
        <ShowMore2 title={data?.title} desc={data?.desc} />
        <BtnOnPost
          sessionId={session?.user.id as string}
          postId={data?.id}
          commentsLength={data?.comments?.length}
        />
        {data?.user?.id === session?.user.id && (
          <button
            onClick={() => handleDeletePost(userId as string, router)}
            className="bg-red-600 hover:bg-red-700 text-white ml-8 rounded-md flex px-5 py-3 gap-x-1"
          >
            Delete
            <Delete />
          </button>
        )}
      </div>
    </div>
  );
}

export default Posted;
