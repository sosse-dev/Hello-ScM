import FooterMenu from "@/components/FooterMenu";
import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers/Providers";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import NotifikasiProvider from "@/components/providers/notifikasi-provider";

export const metadata: Metadata = {
  title: "Hello-SCM",
  description: "Social Media App created by Sosse",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SocketProvider>
            <QueryProvider>
              <NotifikasiProvider>
                <div className="relative h-screen w-full max-w-[50rem] mx-auto flex flex-col bg-white border-x-2 border-black">
                  {children}
                  <FooterMenu />
                </div>
                <Toaster className="z-[100]" />
              </NotifikasiProvider>
            </QueryProvider>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
