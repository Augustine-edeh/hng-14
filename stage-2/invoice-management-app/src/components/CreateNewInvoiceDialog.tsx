"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { InvoiceStatus } from "@/types/invoice";
import { InvoiceFormInput } from "@/lib/validation";
import { ScrollArea } from "./ui/scroll-area";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateNewInvoiceDialog({
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: InvoiceFormInput,
    status: InvoiceStatus,
  ) => {
    setIsSubmitting(true);

    try {
      addInvoice(
        {
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          items: data.items,
          paymentDue: data.paymentDue,
        },
        status, // ✅ correct
      );

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
        showCloseButton={false}
        className="z-40 fixed top-0 left-0 md:ml-20 mt-10 sm:mt-0 h-screen w-full max-w-none sm:w-[700px] translate-x-0 translate-y-0 p-0 pl-5 rounded-none md:rounded-r-[20px] bg-white dark:bg-invoice-bg-dark overflow-y-  shadow-xl data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
      >
        <div className="h-full flex flex-col p-6 md:p-10">
          <DialogTitle className="text-2xl font-bold mb-8">
            New Invoice
          </DialogTitle>

          <ScrollArea className="flex-1 rounded-md border bg-red-500">
            <InvoiceForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting} // ✅ correct
              // isNew={true}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
