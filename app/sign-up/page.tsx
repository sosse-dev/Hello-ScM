"use client";
import FormError from "@/components/infoForm/FormError";
import FormSuccess from "@/components/infoForm/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/uploadthing/fileUpload";
import { SignupSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function AddProfile() {
  const { status, data: session, update } = useSession();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      sandi: "",
      gambar: null,
    },
  });
  const [sembunyikanSandi, setSembunyikanSandi] = useState(true);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    setError("");
    setSukses("");

    if (status === "authenticated") {
      setError("You are already signed in!");
      redirect("/");
    }

    const str = values.name;
    const regex = /^\s+$/;
    const invalid = regex.test(str);

    if (invalid) {
      setError("Nama anda kosong!");

      return;
    }

    try {
      fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then(async (info) => {
          setSukses(info?.success);
          setError(info?.error);

          if (info.success) {
            await update({
              name: values.name,
              username: values.username,
              image: values.gambar,
              isUsernameMade: true,
              user: {
                name: values.name,
                username: values.username,
                image: values.gambar,
                isUsernameMade: true,
              },
            });
          }
        });
    } catch {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto">
      {/* tengahkan form nhya? */}
      <div className="w-full h-fit my-auto flex flex-col items-center justify-center gap-y-2 py-14">
        <h1 className="text-3xl text-center font-bold">SIGN UP</h1>

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
                  <FormLabel className="font-semibold">
                    Profile Picture
                  </FormLabel>
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
                    <Input disabled={loading} placeholder="name" {...field} />
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
                    <Input
                      disabled={loading}
                      placeholder="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="contoh@cnth.cth"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sandi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <div className="w-full flex items-center  bg-white">
                      <Input
                        disabled={loading}
                        placeholder="********"
                        type={sembunyikanSandi ? "password" : "text"}
                        {...field}
                      />
                      {sembunyikanSandi ? (
                        <Eye
                          onClick={() => setSembunyikanSandi(false)}
                          className="mx-2"
                        />
                      ) : (
                        <EyeOff
                          onClick={() => setSembunyikanSandi(true)}
                          className="mx-2"
                        />
                      )}
                    </div>
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
              Register
            </Button>
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="flex gap-x-1">
                <FormDescription>Dont{"'"}t have an account?</FormDescription>
                <Link
                  href="/login"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Login
                </Link>
              </div>
              <Link
                href="/laporkan"
                className="text-red-600 text-sm hover:underline"
              >
                Report Bug / Error
              </Link>
            </div>
            <div className="px-6 sm:px-0 w-full">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign up with Google<div></div>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddProfile;
