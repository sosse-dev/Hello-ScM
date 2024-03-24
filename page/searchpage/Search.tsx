"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import qs from "query-string";
import ViewLoader from "@/libs/ViewLoader";
import { User } from "@prisma/client";

function Search() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [dataUser, setDataUser] = useState<any>([{}]);
  const router = useRouter();
  const controllerRef = useRef<AbortController>();

  const getSearchedUser = async ({ pageParam = undefined }) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    try {
      const url = qs.stringifyUrl({
        url: `/api/searchuser`,
        query: {
          cursor: pageParam,
          searchInput: searchInput,
        },
      });

      if (searchInput.length === 0) {
        return null;
      }

      const res = await fetch(url, {
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        console.log("bad fetch response");
      }

      const { data, nextCursor } = await res.json();

      setDataUser(data);
      return { data, nextCursor };
    } catch (err) {
      return null;
    }
  };

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["searchedUsers"],
      queryFn: getSearchedUser,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
      initialPageParam: undefined,
    });

  console.log(data);

  return (
    <>
      <div
        className={`h-20 w-full flex justify-center space-x-4 items-center bg-slate-100`}
      >
        <input
          onChange={(e) => {
            setSearchInput(e.target.value), refetch();
          }}
          value={searchInput}
          className="px-5 ml-4 h-[70%] w-[80%] rounded-full border-2 border-slate-800 outline-none"
          placeholder="search input.."
        />
        {searchInput.length > 0 && (
          <button
            onClick={() => setSearchInput("")}
            className="w-6 h-6 sm:w-10 sm:h-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="reset"
              className="lucide lucide-eraser w-full h-full"
            >
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
              <path d="M22 21H7" />
              <path d="m5 11 9 9" />
            </svg>
          </button>
        )}
      </div>
      {searchInput.length > 0 && dataUser && (
        <div
          className={`absolute top-20 w-full max-w-[80rem] max-h-[26rem] overflow-y-auto border-b-2 border-black z-40 ${
            data?.pages[0]?.data?.length >= 5 ? "pt-36" : "pt-0"
          } bg-slate-100 flex flex-col justify-center hide-scrollbar hide-scrollbar::-webkit-scrollbar`}
        >
          {/* searched user */}
          {data?.pages[0]?.data?.map((user: User, i: number) => (
            <div
              key={user?.id ?? i}
              onClick={() => router.push(`/${user?.username}`)}
              className="w-full h-fit flex justify-between items-center hover:bg-slate-300 gap-x-2 cursor-pointer"
            >
              <div className="w-fit h-full flex py-2 pl-2 items-center justify-center gap-x-1">
                {/* profile and name searched user */}
                <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden">
                  <Image
                    src={user?.image ?? "/default-profile-picture.png"}
                    width={50}
                    height={50}
                    className="w-full h-auto object-contain"
                    alt="profile-pifture"
                  />
                </div>
                <p className="text-xl max-w-5 break-all">
                  {user.name && user?.name?.length >= 17
                    ? user?.name?.slice(0, 17) + " ..."
                    : user?.name ?? "error"}
                </p>
              </div>
            </div>
          ))}
          <ViewLoader
            page="SEARCH"
            fetchNextPage={() => fetchNextPage()}
            hasNextPage={hasNextPage}
          />
        </div>
      )}
    </>
  );
}

export default Search;
