"use client";

import Link from "next/link";
import { Invoice } from "@/types/invoice";
import StatusBadge from "@/components/StatusBadge";
import { ChevronRight } from "lucide-react";

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const dueDate = new Date(invoice.paymentDue).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTotal = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(invoice.total);

  return (
    <Link href={`/invoices/${invoice.id}`}>
      <div className="invoice-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:translate-y-0 active:scale-98 rounded-[8px]">
        {/* Mobile View */}
        <div className="md:hidden flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-invoice-text-primary dark:text-invoice-text-light">
                {invoice.id}
              </h3>

              <p className="text-sm text-invoice-text-secondary dark:text-gray-400">
                {invoice.clientName}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2.25">
                <p className="text-sm text-invoice-text-secondary dark:text-gray-400">
                  Due {dueDate}
                </p>

                <p className="text-xl font-bold text-invoice-text-primary dark:text-invoice-text-light">
                  {formattedTotal}
                </p>
              </div>

              <StatusBadge status={invoice.status} />

              {/* <p className="md:hidden text-sm text-invoice-text-secondary dark:text-gray-400">
                {invoice.clientName}
              </p> */}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block flex-1 min-w-0">
          <div className="flex items-center gap-6">
            <h3 className="font-bold text-invoice-text-primary dark:text-invoice-text-light">
              {invoice.id}
            </h3>

            {/* Due date, clientName & Total */}
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-5">
                <p className="text-sm text-invoice-text-secondary dark:text-gray-400">
                  Due {dueDate}
                </p>

                <p className="text-sm text-invoice-text-secondary dark:text-gray-400">
                  {invoice.clientName}
                </p>
              </div>

              <p className="text-xl font-bold text-invoice-text-primary dark:text-invoice-text-light">
                {formattedTotal}
              </p>
            </div>

            {/* Status and Chevron */}
            <div className="flex items-center">
              <StatusBadge status={invoice.status} />
              <ChevronRight className="w-5 h-5 text-invoice-primary ml-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
