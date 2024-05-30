import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { useEffect } from "react";

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

      const { data, nextCursor, response } = await res.json();

      return { data, nextCursor, response };
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
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userPosts"],
    queryFn: getThisPosts,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor;
    },
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (posts?.pages[0]?.response === "Invalid User Id") {
      const refetching = setInterval(() => {
        refetch();
      }, 1000);

      return () => {
        clearInterval(refetching);
      };
    }
  }, [posts]);

  return { posts, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage };
};
