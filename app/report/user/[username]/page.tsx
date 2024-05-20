"use client";
import BackButton from "@/components/button/BackButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const reportUserSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1, "Its Required"),
});

export default function ReportUser() {
  const pathname = usePathname();
  const [sended, setSended] = useState(false);

  const checkUser = async () => {
    try {
      const res = await fetch(
        `/api/userdata/byUsername/${pathname?.slice(13, pathname?.length)}`
      );

      if (!res.ok) {
        return { response: "NOT FOUND" };
      }

      const { data } = await res.json();

      if (!data) {
        return { response: "NOT FOUND" };
      }

      return { response: "FOUND", data };
    } catch (err) {
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["checkUser"],
    queryFn: checkUser,
  });

  const form = useForm<z.infer<typeof reportUserSchema>>({
    resolver: zodResolver(reportUserSchema),
    defaultValues: {
      title: "User Report",
      desc: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reportUserSchema>) => {
    try {
      await fetch("/api/report/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title ?? "User Report",
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

  if (data?.response === "NOT FOUND") {
    return (
      <div className="flex flex-col m-auto items-center gap-y-2">
        <h1 className="text-3xl font-bold">Coulnot find the user</h1>
        <Link
          href="/"
          className="text-2xl py-3 px-4 bg-green-500 text-white rounded-lg"
        >
          Back to home
        </Link>
      </div>
    );
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
          <p className="text-lg text-zinc-600">Report this user</p>
        </div>
        <label className="md:w-[70%] w-[94%] text-left text-xl mt-12">
          Tell me what makes you report this user?
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
