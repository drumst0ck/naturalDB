"use client";
import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/Nav";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import DotPattern from "@/components/magicui/dot-pattern";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-[90vh] bg-background font-sans antialiased  scroll-smooth",
          fontSans.variable
        )}
      >
        {" "}
        <ThemeProvider attribute="class">
          <main className="flex flex-row w-full justify-center items-center p-1 relative h-full">
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(1100px_circle_at_center,white,transparent)]"
              )}
            />
            <div className="flex flex-col w-full max-w-[1900px] items-center relative p-4">
              <Nav />
              <QueryClientProvider client={client}>
                {children}
              </QueryClientProvider>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
