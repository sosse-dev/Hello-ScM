"use client";
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
import { UpdateUserSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function EditPorfile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: session?.user.name as string,
      deskripsi: session?.user.desc as string,
    },
  });

  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
    setError("");
    setSukses("");

    const str = values.name;
    const regex = /^\s+$/;
    const invalid = regex.test(str as string);

    if (invalid) {
      setError("Your name is empty!");

      return;
    }

    try {
      await update({
        ...session,
        name: values.name,
        desc: values.deskripsi,
        image: values.gambar,
        isUsernameMade: true,
        user: {
          ...session?.user,
          name: values.name,
          desc: values.deskripsi,
          image: values.gambar,
          isUsernameMade: true,
        },
      });

      await fetch(`/api/userdata/edit/${session?.user.email}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          desc: values.deskripsi,
          image: values.gambar,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          setError(info?.error);
          if (info.success) {
            router.push("/");
            setSukses(info?.success);
          }
          toast.info("If you don't see change, please refresh!");
        });
    } catch (err) {
      setError("Something went wron!!");
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto">
      {/* tengahkan form nhya? */}
      <div className="w-full h-fit my-auto flex flex-col items-center justify-center gap-y-2 py-14">
        <h1 className="text-3xl text-center font-bold">EDIT PROFILE</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 p-4 bg-white"
          >
            <div className="relative mx-auto w-24 h-24">
              <Image
                src={session?.user.image as string}
                className="rounded-full"
                fill
                alt="profile-user"
              />
            </div>
            <div className="w-full text-center">
              <i className="text-center text-sm">
                Your current profile picture
              </i>
            </div>
            <hr />
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
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={session?.user.desc as string}
                      disabled={loading}
                      {...field}
                    />
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
              Edit
            </Button>
            <div className="flex flex-col items-center justify-between md:flex-row">
              <Link
                href="/report"
                className="text-red-600 text-sm hover:underline"
              >
                Report Bug / Error
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditPorfile;
