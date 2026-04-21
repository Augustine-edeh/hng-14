"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav() {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-invoice-card-light dark:bg-invoice-card-dark border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-invoice-text-primary dark:text-invoice-text-light hover:text-invoice-primary transition-colors"
        >
          <FileText className="w-6 h-6" />
          <span className="font-bold">Invoices</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-10 h-10 rounded-full bg-invoice-primary flex items-center justify-center text-white font-bold text-sm">
            UN
          </div>
        </div>
      </div>
    </div>
  );
}
