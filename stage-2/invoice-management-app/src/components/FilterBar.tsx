"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: Props) {
  const filters = ["draft", "pending", "paid"];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium text-invoice-text-primary dark:text-invoice-text-light">
          <span className="hidden sm:inline">Filter by status</span>
          <span className="sm:hidden">Filter</span>
          <ChevronDown size={16} className="text-invoice-primary" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-48 p-4 rounded-xl shadow-lg bg-white dark:bg-[#1E2139]"
      >
        <div className="flex flex-col gap-3">
          {filters.map((filter) => (
            <label
              key={filter}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={activeFilter === filter}
                onCheckedChange={() => onFilterChange(filter)}
              />

              <span className="capitalize text-sm font-medium">{filter}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
