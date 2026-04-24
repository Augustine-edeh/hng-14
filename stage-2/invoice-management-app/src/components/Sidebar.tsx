"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
// import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clsx } from "clsx";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "w-full md:w-24 flex md:flex-col justify-between md:rounded-r-[20px] bg-invoice-sidebar-light dark:bg-invoice-sidebar-dark z-50",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center justify-center size-10 sm:size-20 md:size-24 relative"
      >
        <Image src="/images/logo.png" alt="Logo" fill className="" />
      </Link>

      <div className="flex md:flex-col items-center gap-4 pr-5 md:pr-0 md:pb-5">
        <ThemeToggle />

        <Separator
          orientation="vertical"
          className="md:hidden bg-invoice-separator-bg"
        />
        <Separator
          orientation="horizontal"
          className="hidden md:flex bg-invoice-separator-bg"
        />
        <Avatar>
          <AvatarImage src="/images/user.png" alt="user-avatar" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
