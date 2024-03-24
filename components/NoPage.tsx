import Link from "next/link";

export default function NoPage() {
  return (
    <div className="m-auto flex flex-col items-center space-y-2">
      <h1 className="text-3xl">Could{"'"}not find the page`</h1>
      <Link
        href="/"
        className="w-fit h-fit px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
      >
        Go to Home Page /
      </Link>
    </div>
  );
}
