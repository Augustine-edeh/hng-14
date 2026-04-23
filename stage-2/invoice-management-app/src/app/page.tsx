"use client";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { FilterBar } from "@/components/FilterBar";
import { InvoiceCard } from "@/components/InvoiceCard";
import EmptyState from "@/components/EmptyState";
import { CreateNewInvoiceDialog } from "@/components/CreateNewInvoiceDialog";
import NewInvoiceButton from "@/components/NewInvoiceButton";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const invoices = useInvoiceStore((state) => state.invoices);

  const filter = useInvoiceStore((state) => state.filterStatus);
  const setFilter = useInvoiceStore((state) => state.setFilterStatus);
  const getFilteredInvoices = useInvoiceStore(
    (state) => state.getFilteredInvoices,
  );

  const filteredInvoices = getFilteredInvoices();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const displayInvoices = filter === "" ? invoices : filteredInvoices;

  return (
    <div className="flex-1 flex items-center justify-center">
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:gap-6 w-full">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}
