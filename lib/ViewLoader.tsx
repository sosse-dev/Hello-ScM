import { useEffect, useState } from "react";

interface ViewLoaderProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  page?: string;
}

export default function ViewLoader({
  fetchNextPage,
  hasNextPage,
  page,
}: ViewLoaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
    });

    observer?.observe(document.querySelector("#div" as any));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [visible, hasNextPage, fetchNextPage]);

  return (
    <div id="div" className={`${page === "SEARCH" ? "pb-0" : "pb-24"}`}></div>
  );
}
