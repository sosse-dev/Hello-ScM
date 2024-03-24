"use client";
import OfflinePage from "@/components/OfflinePage";
import BackButton from "@/components/button/BackButton";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Empty")
    .max(15, "Maximum length of title is 15 characters"),
  desc: z.string().optional(),
  image: z.string().nullable(),
});

export default function Post() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [isOnline] = UseCheckConnection();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      desc: "",
      image: null,
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    try {
      if (!isOnline) {
        return null;
      }

      if (!values.title && !values.desc) {
        return null;
      }

      await fetch(`/api/post/post/${session?.user.id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title: values.title, desc: values.desc }),
      });

      router.push("/profile");
    } catch (err) {
      return null;
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="m-auto flex flex-col items-center space-y-2">
        <h1 className="text-3xl font-bold">You haven{"'"}t signed up yet</h1>
        <Link
          href="/profile"
          className="w-fit h-fit px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative top-0 w-full h-20 shrink-0 border-b-2 border-slate-500 flex">
        <BackButton />
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-fit flex flex-col items-center py-12 overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar"
      >
        <div className="w-full h-fit flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl">Post!</h1>
          <p className="text-lg text-zinc-600">dont post something bad..</p>
        </div>
        <label className="md:w-[70%] w-[94%] text-left text-xl">Title</label>
        <input
          {...form.register("title")}
          className="md:w-[70%] w-[94%] h-[6rem] p-4 shrink-0 border-2 border-black"
          placeholder="title"
        />
        {form.formState.errors.title && (
          <p className="text-red-600 text-lg">
            {form.formState.errors.title.message}
          </p>
        )}
        <label className="md:w-[70%] w-[94%] text-left text-xl mt-12">
          Description
          <code className="md:text-sm text-slate-600">*optional</code>
        </label>
        <input
          {...form.register("desc")}
          className="md:max-w-[70%] w-[94%] h-[6rem] p-4 shrink-0 border-2 border-black"
          placeholder="desc"
        />
        <input
          type="submit"
          disabled={loading}
          className={`w-[94%] md:w-[70%] py-7 bg-green-800
           hover:bg-green-700 text-lg text-white mt-8 cursor-pointer`}
        />
      </form>
    </>
  );
}
