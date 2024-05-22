import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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

  return { data, isLoading, refetch };
};

export const useFetchFollowerAndFollowingFromCurrentUser = (
  username: string
) => {
  const getFollowerAndFollowing = async () => {
    try {
      const res = await fetch(`/api/follow/length/${username}`);

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["followsLength"],
    queryFn: getFollowerAndFollowing,
  });

  useEffect(() => {
    if (data?.response === "Invalid username") {
      const refetching = setInterval(() => {
        refetch();
      }, 1000);

      return () => {
        clearInterval(refetching);
      };
    }
  }, [data]);

  return { data, isLoading };
};
