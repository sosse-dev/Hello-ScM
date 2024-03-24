import getAllPosts from "@/app/actions/getAllPosts";
import ShowMore2 from "@/page/homepage/ShowMore2";
import Image from "next/image";
import Link from "next/link";
import { Post, User } from "@prisma/client";
import DeletePostBtn from "@/components/button/DeletePostBtn";

type PostWithUserProfile = Post & {
  user: User;
};

async function AdminPostRoom() {
  const posts = await getAllPosts();
  return (
    <div className="flex flex-col gap-y-2 overflow-y-auto">
      {posts?.map((post: PostWithUserProfile) => {
        return (
          <div
            key={post?.id}
            className="flex flex-col mx-auto h-auto w-full bg-slate-200 mb-6 shrink-0 overflow-hidden"
          >
            <div className="h-fit py-3 w-full flex justify-between">
              <Link
                href={`/${post?.user?.username}`}
                className="h-full flex items-center space-x-1 cursor-pointer"
              >
                <div className="w-16 h-16 ml-2 rounded-full overflow-hidden">
                  <Image
                    src={post?.user?.image ?? "/default-profile-picture.png"}
                    width={80}
                    height={80}
                    alt="profile-picture"
                  />
                </div>
                <div className="flex flex-col -space-y-1">
                  <h1 className="text-3xl font-medium">{post?.user?.name}</h1>
                  <p className="md:text-sm">{post?.user?.username}</p>
                </div>
              </Link>
            </div>
            <div
              className={`flex w-full h-[40rem] md:h-[43rem] lg:h-[26rem] 2xl:h-[50rem] ${
                post?.image ? "block" : "hidden"
              }`}
            >
              <Image
                className="h-full w-full object-contain"
                src={post?.image ?? "/default-profile-picture.png"}
                priority={true}
                width={200}
                height={200}
                alt="img-photo"
              />
            </div>
            <div className="py-4 h-fit w-full">
              <ShowMore2 title={post?.title} desc={post?.desc as string} />
              <div className="w-full flex justify-end pr-3">
                <DeletePostBtn postId={post.id as string} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminPostRoom;
