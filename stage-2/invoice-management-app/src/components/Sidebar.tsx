"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
// import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  return (
    <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-invoice-card-dark dark:bg-invoice-card-dark border-r border-gray-700 flex-col justify-between p-8">
      <Link
        href="/"
        className="flex items-center gap-3 text-white hover:text-invoice-primary transition-colors"
      >
        <FileText className="w-8 h-8" />
        <span className="font-bold text-lg">Invoices</span>
      </Link>

      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <div className="w-12 h-12 rounded-full bg-invoice-primary flex items-center justify-center text-white font-bold">
          UN
        </div>
      </div>
    </div>
  );
}
