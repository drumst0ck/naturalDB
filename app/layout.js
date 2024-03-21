import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/Nav";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ClerkProvider>
            <Nav />
            <main className="flex flex-row w-full justify-center items-center p-1">
              <div className="flex flex-col w-full max-w-[1400px] items-center p-4">
                {children}
              </div>
            </main>
          </ClerkProvider>
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
}
