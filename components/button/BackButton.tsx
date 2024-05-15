"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function BackButton() {
  var router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="absolute left-0 h-full w-[5rem] bg-red-600 hover:bg-red-700 text-white grid place-items-center"
    >
      <ArrowLeft size={30} />
    </button>
  );
}

export default BackButton;
