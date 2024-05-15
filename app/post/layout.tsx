"use client";

import { Suspense } from "react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
