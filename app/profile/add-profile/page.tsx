"use client";
import { getUserByUsername } from "@/app/actions/getUserByUsername";
import FormError from "@/components/infoForm/FormError";
import FormSuccess from "@/components/infoForm/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/uploadthing/fileUpload";
import { AddUserSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function AddProfile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      deskripsi: "",
      username: "",
      gambar: null,
    },
  });
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof AddUserSchema>) => {
    setError("");
    setSukses("");

    const str = values.name;
    const str2 = values.username;
    const regex = /^\s+$/;
    const invalid = regex.test(str);
    const invalid2 = regex.test(str2);

    if (invalid) {
      setError("Your name is empty!");

      return;
    }

    if (invalid2) {
      setError("Your username is empty!");

      return;
    }

    const isUsernameTaken = await getUserByUsername(values.username);

    if (isUsernameTaken) {
      setError("Username is taken!");
      return;
    }

    try {
      await update({
        ...session,
        name: values.name,
        username: values.username,
        desc: values.deskripsi,
        image: values.gambar,
        isUsernameMade: true,
        user: {
          name: values.name,
          username: values.username,
          desc: values.deskripsi,
          image: values.gambar,
          isUsernameMade: true,
        },
      });

      await fetch(`/api/userdata/${session?.user.email}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          desc: values.deskripsi,
          image: values.gambar,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          setError(info?.error);
          if (info.success) {
            setSukses(info?.success);
            router.push("/");
          }
        });
    } catch (err) {
      setError("Terjadi Kesalahan!");
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto">
      {/* tengahkan form nhya? */}
      <div className="w-full h-fit my-auto flex flex-col items-center justify-center gap-y-2 py-14">
        <h1 className="text-3xl text-center font-bold">ADD PROFILE</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 p-4 bg-white"
          >
            <FormField
              control={form.control}
              name="gambar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      disabled={loading}
                      endPoint="profileImage"
                      value={field.value as string}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={session?.user.name as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Username</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {sukses && <FormSuccess pesan={sukses} />}
            {error && <FormError pesan={error} />}
            <Button
              type="submit"
              className="disabled:bg-slate-500"
              disabled={loading}
            >
              Daftar
            </Button>
            <div className="flex flex-col items-center justify-between md:flex-row">
              <Link
                href="/laporkan"
                className="text-red-600 text-sm hover:underline"
              >
                Lapor Bug / Error
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddProfile;
