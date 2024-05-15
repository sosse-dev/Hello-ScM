"use client";

import { useForm } from "react-hook-form";
import BackButton from "@/components/button/BackButton";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import { useRouter } from "next/navigation";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
});

function Report() {
  const router = useRouter();
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof reportSchema>) => {
    try {
      await fetch("/api/report", {
        method: "POSt",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: values.title, desc: values.desc }),
      });

      router.push("/");
    } catch (err) {
      return null;
    }
  };

  

  return (
    <>
      <div className="relative top-0 w-full h-[4rem] shrink-0 border-b-2 border-slate-500 flex">
        <BackButton />
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-fit flex flex-col items-center py-12 overflow-y-auto pb-[8rem]"
      >
        <div className="w-full h-fit flex flex-col justify-center items-center">
          <h1 className="text-5xl">Report Page</h1>
          <p className="text-lg text-zinc-600">Report it to Admin</p>
        </div>
        <label className="md:w-[70%] w-[94%] text-left text-xl mt-12">
          Title
        </label>
        <input
          {...form.register("title")}
          className="md:w-[70%] w-[94%] h-[7rem] text-xl px-4 shrink-0 border-2 border-black outline-none"
          placeholder="type here..."
        />
        {form.formState.errors.title && (
          <p>{form.formState.errors.title.message}</p>
        )}
        <label className="md:w-[70%] w-[94%] text-left text-xl mt-12">
          Message
        </label>
        <input
          {...form.register("desc")}
          className="md:w-[70%] w-[94%] h-[7rem] text-xl px-4 shrink-0 border-2 border-black outline-none"
          placeholder="type here..."
        />
        {form.formState.errors.desc && (
          <p>{form.formState.errors.desc.message}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-[94%] md:w-[70%] py-7 bg-green-800 hover:bg-green-700 text-xl text-white mt-8"
        >
          Report
        </button>
      </form>
    </>
  );
}

export default Report;
