import { useEffect, useState } from "react";

interface ChatScrollProps {
  containerChatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
  isLoadMore: boolean;
  count: number;
}

export const UseChatScroll = ({
  containerChatRef,
  bottomRef,
  loadMore,
  isLoadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topContainer = containerChatRef?.current;

    const handleScroll = () => {
      const scrollTop = topContainer?.scrollTop;

      if (scrollTop === 0 && isLoadMore) {
        loadMore();
      }
    };

    topContainer?.addEventListener("scroll", handleScroll);

    return () => {
      topContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadMore, loadMore, containerChatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topContainer = containerChatRef?.current;

    const isAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topContainer) {
        return false;
      }

      const distanceFromBottom =
        topContainer.scrollHeight -
        topContainer.scrollTop -
        topContainer.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (isAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, containerChatRef, count, hasInitialized]);
};
