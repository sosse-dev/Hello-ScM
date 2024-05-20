import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFetchFollowerAndFollowing = ({
  pathname,
}: {
  pathname: string;
}) => {
  const getFollowerAndFollowing = async () => {
    try {
      const res = await fetch(`/api/otheruser/${pathname}`);

      if (!res.ok) {
        toast.error("Something went wrong!");
        return;
      }

      const { data } = await res.json();

      const res2 = await fetch(
        `/api/follow/${pathname?.slice(1, pathname.length)}/20`
      );

      if (!res2.ok) {
        toast.error("Something went wrong!");
        return;
      }

      const follows = await res2.json();

      return { data, follows };
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["followers", "followings"],
    queryFn: getFollowerAndFollowing,
  });

  return {data, isLoading, refetch}
};

export const useFetchFollowerAndFollowingFromCurrentUser = (username: string) => {
  const getFollowerAndFollowing = async () => {
    try {
      const res = await fetch(
        `/api/follow/length?username=${username}`
      );

      if (!res.ok) {
        return null;
      }

      return await res.json();
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["followsLength"],
    queryFn: getFollowerAndFollowing,
  });

  refetch()

  return { data, isLoading };
}