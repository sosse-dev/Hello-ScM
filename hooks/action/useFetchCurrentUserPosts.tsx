import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useFetchCurrentUserPosts = (userId: string) => {
  const getThisPosts = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/post/posted",
        query: {
          cursor: pageParam,
          userId,
        },
      });

      const res = await fetch(url);

      const { data, nextCursor } = await res.json();

      return { data, nextCursor };
    } catch (err) {
      return null;
    }
  };

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPosts"],
    queryFn: getThisPosts,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor;
    },
    initialPageParam: undefined,
  });

  return { posts, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage };
};
