"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";

interface ChatInputProps {
  socketUrlMessage: string;
  senderId: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ socketUrlMessage, senderId }: ChatInputProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: socketUrlMessage,
        query: {
          messageId: pathname?.slice(14, pathname?.length),
          senderId,
        },
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ content: value.content }),
      });

      if (!res.ok) {
        return null;
      }

      form.reset();
      router.refresh();
    } catch (err) {
      return null;
    }
  };

  return (
    <form
      className="absolute bottom-0 md:-bottom-4 lg:bottom-0 w-full h-24 bg-slate-300 border-t-2 border-black mb-20 lg:mb-0 flex items-center px-2 py-5 gap-x-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <input
        {...form.register("content")}
        type="text"
        className="grow h-full rounded-full shrink-0 pl-6 pr-5 outline-0"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-12 h-12 my-auto grid place-items-center p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="send-message"
          className="lucide lucide-send-horizontal w-full h-full"
        >
          <path d="m3 3 3 9-3 9 19-9Z" />
          <path d="M6 12h16" />
        </svg>
      </button>
    </form>
  );
};
