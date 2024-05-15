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
import { ResetSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ResetPage = () => {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSukses("");
    try {
      fetch("/api/userdata/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((info) => {
          setSukses(info?.success);
          setError(info?.error);
        });
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-2">
      <h1 className="text-3xl text-center font-bold">Account Recorvery</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 border-2 p-4"
        >
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
          {/* properly use the link inside for asChild */}
          {sukses && <FormSuccess pesan={sukses} />}
          {error && <FormError pesan={error} />}
          <div className="w-full flex flex-col items-center gap-y-4">
            <Button
              type="submit"
              className="disabled:bg-slate-500 grid place-items-center"
              disabled={loading}
            >
              Send Reset Email Verification
            </Button>
            <Link className="text-sm font-normal hover:underline" href="/masuk">
              Back to login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPage;
