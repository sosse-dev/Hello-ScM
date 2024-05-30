"use client";
import { Loader, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FormSuccess from "@/components/infoForm/FormSuccess";
import FormError from "@/components/infoForm/FormError";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NewVerificationPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const onSubmit = useCallback(() => {
    setError("");
    setSukses("");

    if (!token) {
      setError("There is no token!");
      return;
    }

    fetch("/api/form/new-verification", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="w-fit h-fit px-6 py-3 border-2 border-slate-600 flex flex-col items-center justify-center">
        <Lock size={120} className="mb-2" />
        {!error && !sukses && <Loader className="animate-spin" />}
        {sukses && <FormSuccess pesan={sukses} />}
        {error && <FormError pesan={error} />}
        <p className="mt-2">Memverifikasi akun anda</p>
        <Link href="/masuk">
          <Button className="mt-4">Kehalaman Masuk</Button>
        </Link>
      </div>
    </div>
  );
};

export default NewVerificationPage;
