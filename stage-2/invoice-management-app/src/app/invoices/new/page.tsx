"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ChevronLeft } from "lucide-react";

export default function NewInvoice() {
  const router = useRouter();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      addInvoice({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        status: data.status || "draft",
        items: data.items,
        paymentDue: data.paymentDue,
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-invoice-bg-light dark:bg-invoice-bg-dark">
      {/* <div className="hidden lg:flex w-24 flex-shrink-0">
        <Sidebar />
      </div> */}

      <div className="flex-1 flex flex-col">
        {/* <div className="lg:hidden">
          <TopNav />
        </div> */}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-invoice-text-secondary hover:text-invoice-text-primary dark:hover:text-invoice-text-light mb-6 font-medium transition-colors"
          >
            <ChevronLeft size={20} />
            Go back
          </Link>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-invoice-text-primary dark:text-invoice-text-light mb-8">
              New Invoice
            </h1>

            <InvoiceForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isNew={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
