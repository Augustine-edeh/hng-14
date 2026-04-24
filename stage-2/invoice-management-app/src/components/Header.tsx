"use client";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { FilterBar } from "@/components/FilterBar";
import CreateNewInvoiceDialog from "@/components/CreateNewInvoiceDialog";
import NewInvoiceButton from "@/components/NewInvoiceButton";
import { InvoiceStatus } from "@/types/invoice";

const Header = () => {
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
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-invoice-text-primary dark:text-invoice-text-light">
            Invoices
          </h1>
          <p className="text-sm text-invoice-text-secondary dark:text-gray-400 mt-1">
            {filter === ""
              ? `${invoices.length} invoices`
              : `${displayInvoices.length} ${filter} invoices`}
          </p>
        </div>

        {/* Filter and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-center gap-4">
            <FilterBar activeFilter={filter} onFilterChange={setFilter} />
            <NewInvoiceButton onClick={() => setOpen(true)} />
          </div>

          <CreateNewInvoiceDialog open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default Header;
