"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
// import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clsx } from "clsx";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "hidden lg:flex justify-between fixedleft-0top-0h-screen bg-invoice-card-dark dark:bg-invoice-card-dark border-r border-gray-700 flex-col rounded-r-[20px] pb-5",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-3 text-white hover:text-invoice-primary transition-colors size-24 relative"
      >
        <Image src="/images/logo.png" alt="Logo" fill className="" />
      </Link>

      <div className="flex flex-col items-center gap-4 px-4">
        <ThemeToggle />
        <Separator />
        <div className="size-10 rounded-full bg-invoice-primary flex items-center justify-center text-white font-bold">
          UN
        </div>
      </div>
    </div>
  );
}
