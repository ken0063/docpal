import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocPal",
  description:
    "Experience a revolutionary way to interact with your PDF documents through real-time AI chat and collaboration with our cutting-edge PDF AI chat app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className
        )}
      >
        <Toaster position="top-center" />
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
