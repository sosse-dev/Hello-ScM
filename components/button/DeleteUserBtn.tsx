"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function DeleteUserBtn({ userId }: { userId: string }) {
  const router = useRouter();
  const controllerRef = useRef<AbortController>();

  const handleDeleteUser = async () => {
    try {
      if (controllerRef.current?.abort) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      await fetch(`/api/report/user?userId=${userId}`, {
        method: "DELETE",
        signal: controllerRef.current?.signal,
      });
      
      router.refresh();
    } catch (err) {
      return null;
    }
  };

  return (
    <button
      onClick={handleDeleteUser}
      className="w-fit h-fit px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
    >
      Delete the User
    </button>
  );
}
