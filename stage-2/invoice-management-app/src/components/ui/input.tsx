import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 min-w-0 px-2.5py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-invoice-card-dark px-4 py-2 text-invoice-text-primary dark:text-invoice-text-light placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-invoice-primary focus:border-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
