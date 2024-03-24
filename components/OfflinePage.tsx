"use client";

import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();
  return (
    <div className="m-auto">
      <div className="w-fit h-fit flex flex-col items-center gap-y-1">
        <div className=""></div>
        <h1 className="text-3xl font-bold">You are offline</h1>
        <button
          onClick={() => router.refresh()}
          className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
