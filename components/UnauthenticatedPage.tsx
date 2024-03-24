import Link from "next/link";

export default function UnauthenticatedPage() {
  return (
    <div className="m-auto flex flex-col items-center space-y-2">
      <h1 className="text-3xl font-bold">You haven{"'"}t signed up yet</h1>
      <Link
        href="/"
        className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
      >
        Sign Up
      </Link>
    </div>
  );
}
