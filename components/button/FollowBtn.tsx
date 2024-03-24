"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

function FollowBtn({
  idThisUser,
  followed,
  refetch,
}: {
  idThisUser: string;
  followed: string;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<{ data: any; follows: any } | null, Error>>;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const controllerRef = useRef<AbortController>();

  const handleFollow = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      if (!session?.user.id) {
        console.log("No id user found");
        return null;
      }

      if (!idThisUser) {
        console.log("Invalid id");
        return null;
      }

      const res = await fetch(`/api/follow/${session?.user.id}/${idThisUser}`, {
        method: "POST",
        body: null,
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        console.log("bad fetch response");
        return null;
      }

      const { response } = await res.json();

      if (!response) {
        console.log("No response");
        return null;
      }

      refetch();
      return response;
    } catch (err) {
      return null;
    }
  };

  const handleUnfollow = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();
      if (!session) {
        console.log("no session");
      }

      if (!idThisUser) {
        console.log("Invalid id");
      }

      const res = await fetch(
        `/api/follow/${session?.user.email}/${idThisUser}`,
        {
          method: "DELETE",
          signal: controllerRef.current.signal,
        }
      );

      if (!res.ok) {
        console.log("bad fetch response");
      }

      const { response } = await res.json();

      if (!response) {
        console.log("No response");
      }

      refetch();
      return response;
    } catch (err) {
      return null;
    }
  };

  return (
    <>
      {followed === "FOLLOWED" ? (
        <button
          onClick={handleUnfollow}
          className={`${
            pathname === "/explore" ? "px-5 py-2" : "grow"
          } bg-green-900  rounded-md flex items-center justify-center gap-x-2 text-white`}
        >
          Followed
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
            aria-label="followed"
            className="lucide lucide-user-check w-[15%] md:w-[10%] h-[90%] md:h-[60%]"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className={`${
            pathname === "/explore" ? "px-5 py-2" : "grow"
          } bg-green-700 rounded-md flex items-center justify-center text-white gap-x-2`}
        >
          Follow
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
            aria-label="follow"
            className="lucide lucide-user-plus w-[15%] md:w-[10%] h-[90%] md:h-[60%]"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
        </button>
      )}
    </>
  );
}

export default FollowBtn;
