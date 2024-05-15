import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

interface HeaderFeedProps {
  router: AppRouterInstance;
  name: string;
  username: string;
  image: string;
}

export default function HeaderFeed({
  router,
  name,
  username,
  image,
}: HeaderFeedProps) {
  return (
    <div className="h-fit py-2 w-full flex justify-between bg-slate-100">
      <div
        onClick={() => router.push(`/${username}`)}
        className="h-full flex items-center space-x-1 cursor-pointer"
      >
        <div className="w-14 h-14 ml-2 rounded-full overflow-hidden">
          <Image
            src={image ?? "/default-profile-picture.png"}
            width={80}
            height={80}
            alt="profile-picture"
          />
        </div>
        <div className="flex flex-col -space-y-1">
          <h1 className="text-xl font-medium">{name}</h1>
          <p className="md:text-sm">{username}</p>
        </div>
      </div>
    </div>
  );
}
