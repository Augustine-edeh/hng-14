"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ArrowLeft } from "lucide-react";

export default function EditInvoice() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invoice = useInvoiceStore((state) =>
    state.invoices.find((inv) => inv.id === id),
  );
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
        <div className="hidden lg:flex w-24 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="lg:hidden">
            <TopNav />
          </div>
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

  // Only draft invoices can be edited
  if (invoice.status !== "draft") {
    return (
      <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
        <div className="hidden lg:flex w-24 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="lg:hidden">
            <TopNav />
          </div>
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-invoice-text-primary dark:text-invoice-text-light mb-2">
                Cannot Edit Invoice
              </h2>
              <p className="text-invoice-text-secondary dark:text-gray-400 mb-4">
                Only draft invoices can be edited.
              </p>
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

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      updateInvoice(id, {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        status: data.status || "draft",
        items: data.items,
        paymentDue: data.paymentDue,
      });
      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error("Failed to update invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
      <div className="hidden lg:flex w-24 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden">
          <TopNav />
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
          {/* Back Button */}
          <Link
            href={`/invoices/${id}`}
            className="inline-flex items-center gap-2 text-invoice-text-secondary hover:text-invoice-text-primary dark:hover:text-invoice-text-light mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Go back
          </Link>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-invoice-text-primary dark:text-invoice-text-light mb-8">
              Edit Invoice
            </h1>

            <InvoiceForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              initialData={invoice}
              isNew={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
