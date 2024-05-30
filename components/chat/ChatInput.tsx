"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { SendHorizonal } from "lucide-react";
import { checkBadWord } from "@/app/actions/profanity/checkBadWord";
import { toast } from "sonner";

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
      const isBadWordContained = await checkBadWord(value.content);

      if (isBadWordContained) {
        toast.warning("Swear words are not allowed!");
        return null;
      }

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
      className="absolute bottom-12 md:-bottom-4 lg:bottom-0 w-full h-14 border-y-2 border-black lg:mb-0 flex justify-center items-center px-2 gap-x-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <input
        {...form.register("content")}
        type="text"
        placeholder="Your message"
        className="grow h-full rounded-full shrink-0 pl-6 pr-5 outline-0"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-12 h-12 my-auto grid place-items-center"
      >
        <SendHorizonal
          size={50}
          className="bg-white rounded-full p-2 hover:bg-slate-50"
        />
      </button>
    </form>
  );
};
