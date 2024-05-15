"use client";
import FormError from "@/components/infoForm/FormError";
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
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/uploadthing/fileUpload";
import { postSchema } from "@/types/schemaZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function Post() {
  const { data: session } = useSession();

  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    try {
      if (!values.title) {
        setError("Title is empty!")
        return
      }

      if(!values.image) {
        setError("Image is missing!")
        return
      }
      
      const res = await fetch(`/api/post/post/${session?.user.id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          desc: values.desc,
          image: values.image,
        }),
      });

      if (!res.ok) {
        setError("Something went wrong!");
      }

      if (res.ok) {
        toast.success("Posted!");
      }
    } catch (err) {
      setError("Terjadi Kesalahan!");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-y-2">
        <h1 className="text-3xl text-center font-bold">Add Post</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[20rem] md:w-[27rem] lg:w-[30rem] space-y-4 border-2 p-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      disabled={loading}
                      endPoint="postImage"
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* properly use the link inside for asChild */}
            {error && <FormError pesan={error} />}
            <Button
              type="submit"
              className="disabled:bg-slate-500 grid place-items-center"
              disabled={loading}
            >
              Post!
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
