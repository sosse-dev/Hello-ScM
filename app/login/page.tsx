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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function Login() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [sembunyikanSandi, setSembunyikanSandi] = useState(true);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSukses("");

    const validateFields = await LoginSchema.safeParse(values);

    if (!validateFields.success) {
      setError("Invalid input!");
      return;
    }

    const { email, password } = validateFields.data;

    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (!res?.ok) {
        setError("Something went wrong!");
        return;
      }

      if (res?.ok) {
        await update({
          isUsernameMade: true,
          user: {
            isUsernameMade: true,
          },
        });
        toast.success("Login Success!");
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-y-2">
        <h1 className="text-3xl text-center font-bold">LOGIN</h1>
        {status === "authenticated" && !session.user.emailVerified && (
          <div className="w-fit h-[3rem] px-8 grid place-items-center bg-green-300 bg-opacity-50">
            {session.user.name} is not verified!
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 p-4"
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
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
            <Button
              type="submit"
              className="disabled:bg-slate-500 grid place-items-center"
              disabled={loading}
            >
              Masuk
            </Button>
            <Button
              size="sm"
              variant="link"
              asChild
              className="p-0 font-normal"
            >
              {/* <Link href="/auth/reset">Forget Password?</Link> */}
            </Button>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex gap-x-1">
                <FormDescription>Dont{"'"}t have an account?</FormDescription>
                <Link
                  href="/sign-up"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Sign Up
                </Link>
              </div>
              <Link
                href="/laporkan"
                className="text-red-600 text-sm hover:underline"
              >
                Report Bug / Error
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default Login;
