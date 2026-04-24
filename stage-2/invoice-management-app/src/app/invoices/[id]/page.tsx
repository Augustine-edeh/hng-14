"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteModal } from "@/components/DeleteModal";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvoiceDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isMounted, setIsMounted] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const invoice = useInvoiceStore((state) =>
    state.invoices.find((inv) => inv.id === id),
  );
  const markAsPaid = useInvoiceStore((state) => state.markAsPaid);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
        {/* <div className="hidden lg:flex w-24 flex-shrink-0">
          <Sidebar />
        </div> */}
        <div className="flex-1 flex flex-col">
          {/* <div className="lg:hidden">
            <TopNav />
          </div> */}
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-invoice-text-primary dark:text-invoice-text-light mb-2">
                Invoice not found
              </h2>
              <Link
                href="/"
                className="text-invoice-primary hover:text-invoice-primary-hover font-medium"
              >
                Back to invoices
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const canEdit = invoice.status === "draft";
  const canMarkAsPaid = invoice.status === "pending";
  const total = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  return (
    <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 pb-0">
          {/* Back Button */}
          <Link
            href="/"
            className="flex items-center justify-start gap-2 text-invoice-text-secondary hover:text-invoice-text-primary dark:hover:text-invoice-text-light mb-6 font-medium transition-colors"
          >
            <ChevronLeft className="size-5" />
            <span>Go back</span>
          </Link>

          {/* Header with Status */}
          <div className="invoice-card p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between md:gap-20">
              <div className="flex items-center justify-between flex-1">
                <p>Status</p>
                <StatusBadge status={invoice.status} />
              </div>

              {/* <div className="hidden md:flex gap-2">
                <button className="rounded-full bg-invoice-action-button-edit-light dark:bg-invoice-action-button-edit-dark text-invoice-action-button-edit-text-light dark:text-white px-5 py-2 dark:hover:bg-white dark:hover:text-[#7E88C3]">
                  Edit
                </button>
                <button className="rounded-full bg-invoice-action-button-delete-light dark:bg-invoice-action-button-delete-dark text-white px-5 py-2 hover:opacity-90">
                  Delete
                </button>
                <button className="rounded-full bg-invoice-action-button-mark-as-paid-light dark:bg-invoice-action-button-mark-as-paid-dark hover:opacity-90 text-white px-5 py-2">
                  Mark as Paid
                </button>
              </div> */}

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex gap-3">
                <Button
                  asChild
                  className="rounded-full bg-invoice-action-button-edit-light dark:bg-invoice-action-button-edit-dark text-invoice-action-button-edit-text-light dark:text-white px-5 py-2 dark:hover:bg-white dark:hover:text-[#7E88C3]"
                >
                  <Link href={`/invoices/${id}/edit`} className="">
                    Edit
                  </Link>
                </Button>
                <Button
                  onClick={() => setDeleteModalOpen(true)}
                  className="rounded-full bg-invoice-action-button-delete-light dark:bg-invoice-action-button-delete-dark text-white px-5 py-2 hover:opacity-90"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => markAsPaid(id)}
                  className="rounded-full bg-invoice-action-button-mark-as-paid-light dark:bg-invoice-action-button-mark-as-paid-dark hover:opacity-90 text-white px-5 py-2"
                >
                  Mark as Paid
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-card p-6 sm:p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div>
                <div className="mb-8">
                  <p className="text-invoice-text-secondary dark:text-gray-400 text-sm font-medium mb-2">
                    Bill To
                  </p>
                  <p className="text-invoice-text-primary dark:text-invoice-text-light font-semibold mb-1">
                    {invoice.clientName}
                  </p>
                  <p className="text-invoice-text-secondary dark:text-gray-400 text-sm">
                    {invoice.clientEmail}
                  </p>
                </div>

                <div>
                  <p className="text-invoice-text-secondary dark:text-gray-400 text-sm font-medium mb-2">
                    Invoice Date
                  </p>
                  <p className="text-invoice-text-primary dark:text-invoice-text-light font-semibold">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div>
                  <p className="text-invoice-text-secondary dark:text-gray-400 text-sm font-medium mb-2">
                    Payment Due
                  </p>
                  <p className="text-invoice-text-primary dark:text-invoice-text-light font-semibold">
                    {new Date(invoice.paymentDue).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              {/* Items Table */}
              <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-[8px] p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-0 text-invoice-text-secondary dark:text-gray-400 font-medium">
                          Item Name
                        </th>
                        <th className="text-right py-4 px-2 text-invoice-text-secondary dark:text-gray-400 font-medium">
                          QTY
                        </th>
                        <th className="text-right py-4 px-2 text-invoice-text-secondary dark:text-gray-400 font-medium">
                          Price
                        </th>
                        <th className="text-right py-4 px-0 text-invoice-text-secondary dark:text-gray-400 font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <td className="py-4 px-0 text-invoice-text-primary dark:text-invoice-text-light font-medium">
                            {item.name}
                          </td>
                          <td className="text-right py-4 px-2 text-invoice-text-secondary dark:text-gray-400">
                            {item.qty}
                          </td>
                          <td className="text-right py-4 px-2 text-invoice-text-secondary dark:text-gray-400">
                            £{item.price.toFixed(2)}
                          </td>
                          <td className="text-right py-4 px-0 text-invoice-text-primary dark:text-invoice-text-light font-semibold">
                            £{(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="w-full bg-[#373B53] dark:bg-[#0C0E16] rounded-b-[8px] p-6 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Amount Due</span>
                  <span className="text-3xl font-bold">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden gap-3 justify-center bg-invoice-card-light dark:bg-invoice-card-dark p-4 rounded-lg mb-6">
            <Button
              asChild
              className="rounded-full bg-invoice-action-button-edit-light dark:bg-invoice-action-button-edit-dark text-invoice-action-button-edit-text-light dark:text-white px-5 py-2 dark:hover:bg-white dark:hover:text-[#7E88C3]"
            >
              <Link href={`/invoices/${id}/edit`} className="">
                Edit
              </Link>
            </Button>
            <Button
              onClick={() => setDeleteModalOpen(true)}
              className="rounded-full bg-invoice-action-button-delete-light dark:bg-invoice-action-button-delete-dark text-white px-5 py-2 hover:opacity-90"
            >
              Delete
            </Button>
            <Button
              onClick={() => markAsPaid(id)}
              className="rounded-full bg-invoice-action-button-mark-as-paid-light dark:bg-invoice-action-button-mark-as-paid-dark hover:opacity-90 text-white px-5 py-2"
            >
              Mark as Paid
            </Button>
          </div>

          <DeleteModal
            isOpen={deleteModalOpen}
            invoiceId={id}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={() => {
              useInvoiceStore.getState().deleteInvoice(id);
              setDeleteModalOpen(false);
              router.push("/");
            }}
          />
        </main>
      </div>
    </div>
  );
}
