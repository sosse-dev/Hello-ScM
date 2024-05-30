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
import { NewPasswordSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const NewPasswordForm = () => {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [sembunyikanSandi, setSembunyikanSandi] = useState(true);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSukses("");
    try {
      fetch("/api/form/new-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          token,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          setSukses(info.success as string);
          setError(info.error as string);
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-2">
      <h1 className="text-3xl text-center font-bold">Add new password</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 border-2 p-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Sandi</FormLabel>
                <FormControl>
                  <div className="w-full flex items-center  bg-white">
                    <Input
                      disabled={loading}
                      placeholder="sandi"
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
          {/* properly use the link inside for asChild */}
          {sukses && <FormSuccess pesan={sukses} />}
          {error && <FormError pesan={error} />}
          <div className="w-full flex flex-col items-center gap-y-4">
            <Button
              type="submit"
              className="disabled:bg-slate-500 grid place-items-center"
              disabled={loading}
            >
              Reset Password
            </Button>
            <Link className="text-sm font-normal hover:underline" href="/masuk">
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
