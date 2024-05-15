import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useFetchFeed = () => {
  const getAllPosts = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/post/feed",
      query: {
        cursor: pageParam,
      },
    });

    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }
    const { data, nextCursor } = await res.json();

    if (!data) {
      return null;
    }

    return { data, nextCursor };
  };

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: getAllPosts,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
      initialPageParam: undefined,
    });

  return { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
