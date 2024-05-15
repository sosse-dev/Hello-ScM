"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { UserCheck, UserPlus } from "lucide-react";
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
  refetch: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      | {
          data: any;
          follows: any;
        }
      | null
      | undefined,
      Error
    >
  >;
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
        return null;
      }

      if (!idThisUser) {
        return null;
      }

      const res = await fetch(`/api/follow/${session?.user.id}/${idThisUser}`, {
        method: "POST",
        body: null,
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        return null;
      }

      const { response } = await res.json();

      if (!response) {
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
        return;
      }

      if (!idThisUser) {
        return;
      }

      const res = await fetch(
        `/api/follow/${session?.user.email}/${idThisUser}`,
        {
          method: "DELETE",
          signal: controllerRef.current.signal,
        }
      );

      if (!res.ok) {
        return;
      }

      const { response } = await res.json();

      if (!response) {
        return;
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
          <UserCheck />
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className={`${
            pathname === "/explore" ? "px-5 py-2" : "grow"
          } bg-green-700 rounded-md flex items-center justify-center text-white gap-x-2`}
        >
          Follow
          <UserPlus />
        </button>
      )}
    </>
  );
}

export default FollowBtn;
