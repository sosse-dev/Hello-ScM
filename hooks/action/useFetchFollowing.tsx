import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import qs from "query-string";

export const useFetchFollowing = () => {
  const pathname = usePathname();

  const getFollowingUser = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/follow/${pathname?.slice(1, -10)}`,
        query: {
          cursor2: pageParam,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        return;
      }

      const followingUser = await res.json();
      return followingUser;
    } catch (err) {
      return;
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["followings"],
      queryFn: getFollowingUser,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor2;
      },
      initialPageParam: undefined,
    });

  return { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
