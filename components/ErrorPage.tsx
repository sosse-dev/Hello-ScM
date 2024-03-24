"use client";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="m-auto">
      <div className="w-fit h-fit flex flex-col items-center gap-y-2">
        <h1 className="text-3xl font-bold">There is something went wrong!</h1>
        <div className="flex gap-x-2">
          <button
            onClick={() => router.refresh()}
            className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
          >
            Refresh
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
