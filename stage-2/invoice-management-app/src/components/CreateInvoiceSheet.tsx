"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface CreateInvoiceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceSheet({
  open,
  onOpenChange,
}: CreateInvoiceSheetProps) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      addInvoice({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        status: data.status || "pending",
        items: data.items,
        paymentDue: data.paymentDue,
      });

      onOpenChange(false); // close sheet after success
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="
    w-full
    max-w-none
    sm:max-w-[600px]
    p-0
    bg-white dark:bg-invoice-bg-dark
    overflow-y-auto
    z-40
    md:ml-18 md:pl-10
  "
      >
        <div className="p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-8">New Invoice</h1>

          <InvoiceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isNew={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
