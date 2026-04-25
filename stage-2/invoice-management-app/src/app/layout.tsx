import type { Metadata } from "next";
// import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Invoice Management",
  description: "A modern invoice management application",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="font-spartan antialiased flex flex-col md:flex-row h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark overflow -hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Sidebar />

          <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 w-full max-w-3xl mx-auto flex flex-col">
            <Header />

            <div className="flex-1 overflow-y-auto">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
