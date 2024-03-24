"use client";

import { useState } from "react";

function ShowMore2({ title, desc }: { title: string; desc: string }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="grow w-[90%] pr-3 flex flex-col ml-8 ">
      <h1 className="font-medium mt-4 text-3xl text-zinc-800">{title}</h1>
      <p
        className={`break-all ${
          showMore ? "line-clamp-none" : "line-clamp-2"
        } text-xl text-zinc-700`}
      >
        {desc}
      </p>
      <button
        onClick={() => setShowMore(!showMore)}
        className={`${
          desc?.length < 50 || !desc ? "hidden" : "block"
        } text-blue-600 text-2xl hover:text-blue-800 mt-4`}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}

export default ShowMore2;
