import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useFetchPosts = ({ id }: { id: string }) => {
  const getThisPosts = async ({ pageParam = undefined }) => {
    try {
      if (!id) {
        return null;
      }

      const url = qs.stringifyUrl(
        {
          url: "/api/post/posted",
          query: {
            cursor: pageParam,
            userId: id,
          },
        },
        { skipNull: true }
      );

      const res = await fetch(url);

      if (!res.ok) {
        return null;
      }

      const { data, nextCursor } = await res.json();

      if (!data) {
        return null;
      }

      return { data, nextCursor };
    } catch (err) {
      return null;
    }
  };

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getThisPosts,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor;
    },
    initialPageParam: undefined,
  });

  return { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
