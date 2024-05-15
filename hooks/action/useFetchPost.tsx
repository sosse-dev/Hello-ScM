import { useQuery } from "@tanstack/react-query";

export const useFetchPost = (userId: string, pathname: string) => {
  const getOnePost = async () => {
    try {
      if (!pathname) {
        return null;
      }

      const res = await fetch(`/api/post/postId/${userId}`);

      if (!res.ok) {
        return null;
      }

      const { data } = await res.json();

      if (!data) {
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post"],
    queryFn: getOnePost,
  });

  return { data, isLoading, isError };
};
