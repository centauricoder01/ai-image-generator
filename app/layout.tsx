import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ImageCraft - An Image Editor",
  description: "Create and edit images with ease using ImageCraft, the intuitive online image editor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
              <div>
                {children}
                <Toaster />
              </div>
      </body>
    </html>
  );
}
