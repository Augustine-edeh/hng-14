"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { FilterBar } from "@/components/FilterBar";
import { InvoiceCard } from "@/components/InvoiceCard";
import { EmptyState } from "@/components/EmptyState";
import { Plus } from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const invoices = useInvoiceStore((state) => state.invoices);
  // const filteredInvoices = useInvoiceStore((state) => state.filteredInvoices);
  // const filter = useInvoiceStore((state) => state.filter);

  const filter = useInvoiceStore((state) => state.filterStatus);
  const setFilter = useInvoiceStore((state) => state.setFilterStatus);
  const getFilteredInvoices = useInvoiceStore(
    (state) => state.getFilteredInvoices,
  );

  const filteredInvoices = getFilteredInvoices();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const displayInvoices = filter === "all" ? invoices : filteredInvoices;

  return (
    <div className="flex-1flex flex-col bg-red-300">
      {/* Mobile/Tablet Top Nav */}
      <div className="lg:hidden">
        <TopNav />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-invoice-text-primary dark:text-invoice-text-light">
                Invoices
              </h1>
              <p className="text-sm text-invoice-text-secondary dark:text-gray-400 mt-1">
                {filter === "all"
                  ? `${invoices.length} invoices`
                  : `${displayInvoices.length} ${filter} invoices`}
              </p>
            </div>

            {/* Filter and Create Button */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <FilterBar activeFilter={filter} onFilterChange={setFilter} />
              <Link
                href="/invoices/new"
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        {displayInvoices.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="grid gap-4 md:gap-6">
            {displayInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
