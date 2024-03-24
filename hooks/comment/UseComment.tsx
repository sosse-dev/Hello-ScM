import { useQuery } from "@tanstack/react-query";

interface UseCommentProps {
  apiUrl: string;
  postId: string;
}

export const UseComment = ({ apiUrl, postId }: UseCommentProps) => {
  const fetchMessages = async () => {
    const res = await fetch(`${apiUrl}/${postId}`);
    return res.json();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchMessages,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
