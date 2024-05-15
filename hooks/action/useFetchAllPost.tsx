import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useFetchAllPost = () => {
  const getAllPosts = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/post",
        query: {
          cursor: pageParam,
        },
      });

      const res = await fetch(url);

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data;
    } catch {
      return null;
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["postsExplore"],
      queryFn: getAllPosts,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
      initialPageParam: undefined,
    });

  return { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
