"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNewInvoiceDialog({
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      addInvoice({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        status: data.status ?? "draft",
        items: data.items,
        paymentDue: data.paymentDue,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
    z-40
    fixed
    top-0
    left-0
    md:ml-20
    h-screen
    w-full
    max-w-none
    sm:w-179.75
    translate-x-0
    translate-y-0
    p-0 pl-5
    rounded-r-[20px]
    bg-white dark:bg-invoice-bg-dark
    overflow-y-auto
    shadow-xl
    data-[state=open]:slide-in-from-left
    data-[state=closed]:slide-out-to-left
  "
      >
        <div className="p-6 md:p-10">
          <DialogTitle className="text-2xl font-bold mb-8">
            New Invoice
          </DialogTitle>
          {/* <h1 className="text-2xl font-bold mb-8">New Invoice</h1> */}

          <InvoiceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isNew={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
