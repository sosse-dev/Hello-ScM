import { ImagePlus } from "lucide-react";
import Link from "next/link";

interface FollowAndPostBtnProps {
  username: string;
  FollowerLength: number;
  FollowingLength: number;
  CurrentUser: boolean;
}

function FollowAndPostBtn({
  username,
  FollowerLength,
  FollowingLength,
  CurrentUser,
}: FollowAndPostBtnProps) {
  return (
    <>
      <Link
        href={{ pathname: `/${username}/follower` }}
        className="grow py-2 px-3 text-center text-2xl hover:bg-slate-100 font-bold flex flex-col"
      >
        Follower
        <p className="text-center text-lg font-medium text-zinc-600">
          {FollowerLength}
        </p>
      </Link>
      <Link
        href={{ pathname: `/${username}/following` }}
        className="grow py-2 px-3 flex flex-col text-2xl hover:bg-slate-100 font-bold text-center"
      >
        Following
        <p className="text-center text-lg font-medium text-zinc-600">
          {FollowingLength}
        </p>
      </Link>
      {CurrentUser && (
        <Link
          href="/profile/post"
          className="w-fit h-fit bg-green-700 text-white shrink-0 p-2 rounded-full grid place-items-center hover:bg-green-600"
        >
          <ImagePlus size={30} />
        </Link>
      )}
    </>
  );
}

export default FollowAndPostBtn;
