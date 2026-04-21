"use client";

import { InvoiceStatus } from "@/types/invoice";

interface FilterBarProps {
  activeFilter: InvoiceStatus | "all";
  onFilterChange: (status: InvoiceStatus | "all") => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: { label: string; value: InvoiceStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilter === filter.value
              ? "bg-invoice-primary text-white"
              : "bg-gray-100 dark:bg-invoice-card-dark text-invoice-text-secondary dark:text-invoice-text-light hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-pressed={activeFilter === filter.value}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
