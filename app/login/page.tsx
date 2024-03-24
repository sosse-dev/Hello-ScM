"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z
    .string()
    .min(7, "Minimal password length is 7")
    .max(30, "Maximum password length is 30"),
});

function Login() {
  const {data: session, status} = useSession()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async(values: z.infer<typeof loginSchema>) => {
    try {
      
    } catch (err) {
      return null
    }
  }
  
  return (
    <div className="h-screen pt-12 pb-24 grid place-items-center overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-fit px-12 py-8 m-auto border-2 border-slate-800 rounded-lg flex flex-col"
      >
        <h1 className="text-4xl text-center">Login Form</h1>
        <p className="font-bold text-center mb-6">Hello-SCM</p>
        <label className="">Email</label>
        <input
          {...form.register("email")}
          type="email"
          className="px-4 py-3 border-2 border-slate-700"
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-lg">{`${form.formState.errors.email.message}`}</p>
        )}
        <label className="">Password</label>
        <input
          {...form.register("password")}
          type="password"
          className="px-4 py-3 border-2 border-slate-700"
        />
        {form.formState.errors.password && (
          <p className="text-red-600 text-lg">{`${form.formState.errors.password.message}`}</p>
        )}
        <input
          type="submit"
          disabled={loading}
          className="py-4 mt-4 bg-slate-400 text-white hover:bg-green-600 cursor-pointer"
        />
        <div className="flex items-center mt-3">
        <span className="grow h-[1px] bg-black"></span>
        <p className="px-2 pb-2">or</p>
        <span className="grow h-[1px] bg-black"></span>
      </div>
      <button onClick={()=>signIn("google")} className="mt-2 py-5 bg-white rounded-md hover:shadow-lg">Sign in with google</button>
      </form>
    </div>
  );
}

export default Login;
