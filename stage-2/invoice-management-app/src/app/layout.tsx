import type { Metadata } from "next";
// import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";

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
      <ThemeProvider>
        <body className="font-spartan antialiased flex flex-col md:flex-row min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
          <Sidebar className="" />

          <main className="flex-1 flex">{children}</main>
          {/* {process.env.NODE_ENV === "production" && <Analytics />} */}
        </body>
      </ThemeProvider>
    </html>
  );
}
