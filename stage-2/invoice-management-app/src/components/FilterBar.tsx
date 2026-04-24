"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { InvoiceStatus } from "@/types/invoice";

interface Props {
  activeFilter: InvoiceStatus | "";
  onFilterChange: (filter: InvoiceStatus | "") => void;
}

const filters = ["draft", "pending", "paid"];

export function FilterBar({ activeFilter, onFilterChange }: Props) {
  const filters: InvoiceStatus[] = ["draft", "pending", "paid"];
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium dark:text-invoice-text-light">
          <span className="hidden sm:inline">Filter by status</span>
          <span className="sm:hidden">Filter</span>

          {/* 👇 Chevron */}
          <ChevronDown
            size={16}
            className={`
              text-invoice-primary
              transition-transform duration-200
              ${open ? "rotate-180" : "rotate-0"}
            `}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-4 mt-5 rounded-[8px] shadow-lg bg-white dark:bg-[#1E2139]">
        <div className="flex flex-col gap-3">
          {filters.map((filter) => (
            <label
              key={filter}
              className="
                flex items-center gap-3 cursor-pointer
                hover:bg-gray-100 dark:hover:bg-[#252945]
                px-2 py-1 rounded-md
              "
            >
              <Checkbox
                checked={activeFilter === filter}
                // onCheckedChange={() => onFilterChange(filter)}
                onCheckedChange={() => {
                  if (activeFilter === filter) {
                    onFilterChange(""); // reset to "all"
                  } else {
                    onFilterChange(filter);
                  }
                }}
                className="data-checked:bg-invoice-primary bg-invoice-text-light focus-visible:ring-1 rounded-xs focus-visible:ring-invoice-primary focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1E2139] dark:bg-gray-700 dark:data-checked:bg-invoice-primary"
              />

              <span className="capitalize text-sm font-bold text-black">
                {filter}
              </span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
