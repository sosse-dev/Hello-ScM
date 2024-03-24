"use client";
import BackButton from "@/components/button/BackButton";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is Empty")
    .max(17, "Maximum length of username is 17 characters"),
  username: z
    .string()
    .min(1, "Username is Empty")
    .max(15, "Maximum length of username is 15 characters"),
  desc: z.string().optional(),
});

export default function EditProfile() {
  const { status, data: session, update } = useSession();
  const router = useRouter();
  const [doesUsernameExist, setDoesUsernameExist] = useState(false);
  const [isOnline] = UseCheckConnection();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: session?.user.name as string,
      username: session?.user.username as string,
      desc: session?.user.desc as string,
    },
  });

  const loading = form.formState.isSubmitting;

  const checkUsername = async (username: string) => {
    try {
      const res = await fetch(`/api/userdata/byUsername/${username}`);
      const { data } = await res.json();

      if (!data) {
        return {
          data: "NOT FOUND",
        };
      }

      return data;
    } catch (err) {
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    if (!values.name && !values.username) {
      return null;
    }

    try {
      if (!isOnline) {
        return null;
      }

      if (values.name.length === 0) {
        console.log("no title");
      }

      if (values.username.length === 0) {
        console.log("no username");
      }

      const checkedUsername = await checkUsername(values.username);

      if (
        checkedUsername.username === values.username &&
        checkedUsername.username !== session?.user.username
      ) {
        setDoesUsernameExist(true);
        return null;
      } else {
        setDoesUsernameExist(false);
      }

      if (!session && status !== "loading") {
        return null;
      }

      await update({
        ...session,
        user: {
          ...session,
          name: values.name,
          username: values.username,
          desc: values.desc ?? null,
        },
      });

      const res = await fetch(`/api/userdata/${session?.user.email}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          desc: values.desc,
        }),
      });

      if (!res.ok) {
        console.log("bad fetch response");
      }

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
        className="w-full h-fit flex flex-col items-center py-24 sm:py-12 md:py-24 overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar"
      >
        <div className="w-full h-fit flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl">Edit Profile</h1>
        </div>
        <label className="md:w-[70%] w-[94%] text-left text-xl">Name</label>
        <input
          {...form.register("name")}
          className="md:w-[70%] w-[94%] h-[6rem] p-4 shrink-0 border-2 border-black"
          placeholder="title"
        />
        {form.formState.errors.name && (
          <p className="text-red-600 text-lg">{`${form.formState.errors.name.message}`}</p>
        )}
        <label className="md:w-[70%] w-[94%] text-left text-xl">Username</label>
        <input
          {...form.register("username")}
          className="md:w-[70%] w-[94%] h-[6rem] p-4 shrink-0 border-2 border-black"
          placeholder="title"
        />
        {form.formState.errors.username && (
          <p className="text-red-600 text-lg">{`${form.formState.errors.username.message}`}</p>
        )}
        {doesUsernameExist && (
          <p className="text-red-600 text-lg">Username already exists</p>
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
          className={`w-[94%] md:w-[70%] py-7 ${
            loading ? "bg-green-900 cursor-not-allowed" : "bg-green-800"
          }  hover:bg-green-700 text-lg text-white mt-8 cursor-pointer`}
        />
      </form>
    </>
  );
}
