"use client";

import { useState } from "react";

function ShowMore2({ title, desc }: { title: string; desc: string }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="grow w-[90%] pr-3 flex flex-col ml-8">
      <h1 className="font-medium mt-4 text-3xl text-zinc-800">{title}</h1>
      <p
        className="break-all text-xl text-gray-600 mt-1"
      >
        {showMore ? desc : `${desc.slice(0, 199)}...`}
      </p>
      <button
        onClick={() => setShowMore(!showMore)}
        className={`hover:underline ${
          desc?.length <= 200 || !desc ? "hidden" : "block"
        } text-blue-600 hover:text-blue-800 mt-2`}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}

export default ShowMore2;
