import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import qs from "query-string";

export const useFetchFollower = () => {
  const pathname = usePathname();

  const getFollower = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/follow/${pathname?.slice(0, -9)}`,
        query: {
          cursor1: pageParam,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        return null;
      }

      const follower = await res.json();

      return follower;
    } catch (err) {
      return null;
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["followers"],
    queryFn: getFollower,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor1;
    },
    refetchOnWindowFocus: false,
    initialPageParam: undefined,
  });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
