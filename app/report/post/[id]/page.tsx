"use client";
import BackButton from "@/components/button/BackButton";
import { usePathname } from "next/navigation";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import OfflinePage from "@/components/OfflinePage";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";

const reportPostSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1, "Its Required"),
});

export default function ReportPost() {
  const pathname = usePathname();
  const [sended, setSended] = useState(false);
  const [isOnline] = UseCheckConnection();

  const checkPost = async () => {
    try {
      const res = await fetch(
        `/api/post/getPostById/${pathname?.slice(13, pathname?.length)}`
      );

      if (!res.ok) {
        console.log("bad fetch response");
        return { response: "NOT FOUND" };
      }

      const { data, response } = await res.json();

      return { data, response };
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["checkPost"],
    queryFn: checkPost,
  });

  const form = useForm<z.infer<typeof reportPostSchema>>({
    resolver: zodResolver(reportPostSchema),
    defaultValues: {
      title: "Post Report",
      desc: data?.data.id,
    },
  });

  const onSubmit = async (values: z.infer<typeof reportPostSchema>) => {
    try {
      await fetch("/api/report/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title ?? "Post Report",
          desc: values.desc,
          id: data?.data.id,
        }),
      });

      setSended(true);
    } catch (err) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="w-12 h-12 animate-spin">
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
            aria-label="loader2"
            className="lucide lucide-clock-12 w-full h-full"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12" />
          </svg>
        </div>
      </div>
    );
  }

  if (sended) {
    return (
      <div className="m-auto flex flex-col items-center gap-y-1">
        <h1 className="font-bold text-4xl">Your report has been sended</h1>
        <Link href="/" className="px-4 py-3 bg-green-600 text-white rounded-lg">
          Back to home
        </Link>
      </div>
    );
  }

  if (data?.response === "NOT FOUND" || data?.response === "Invalid Id") {
    return (
      <div className="flex flex-col m-auto items-center gap-y-2">
        <h1 className="text-3xl font-bold">Coulnot find the post</h1>
        <Link
          href="/"
          className="text-2xl py-3 px-4 bg-green-500 text-white rounded-lg"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      <div className="relative top-0 w-full h-24 shrink-0 border-b-2 border-slate-500 flex">
        <BackButton />
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-fit flex flex-col items-center py-12 overflow-y-auto"
      >
        <div className="w-full h-fit flex flex-col justify-center items-center">
          <h1 className="text-5xl">Report</h1>
          <p className="text-lg text-zinc-600">Report this post</p>
        </div>
        <label className="md:w-[70%] w-[94%] text-left text-xl mt-12">
          Tell me what makes you report this post?
        </label>
        <input
          {...form.register("desc")}
          className="md:w-[70%] w-[94%] h-[7rem] text-3xl px-4 shrink-0 border-2 border-black outline-none"
          placeholder="type here..."
        />
        {form.formState.errors.desc && (
          <p>{form.formState.errors.desc.message}</p>
        )}
        <button className="w-[94%] md:w-[70%] py-7 bg-green-800 hover:bg-green-700 text-xl text-white mt-8">
          Report
        </button>
      </form>
    </>
  );
}
