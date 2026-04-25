"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { InvoiceStatus, Invoice } from "@/types/invoice";
import { InvoiceFormInput } from "@/lib/validation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

const EditInvoiceDialog = ({ open, onOpenChange, invoice }: Props) => {
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: InvoiceFormInput,
    status: InvoiceStatus,
  ) => {
    setIsSubmitting(true);

    try {
      updateInvoice(
        invoice.id,
        {
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          items: data.items,
          paymentDue: data.paymentDue,
        },
        status,
      );

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-40 fixed top-0 left-0 md:ml-20 mt-10 sm:mt-0 h-screen w-full max-w-none sm:w-[700px] md:max-w-5/12 translate-x-0 translate-y-0 p-0 pl-5 rounded-none sm:rounded-r-[20px] bg-white dark:bg-invoice-bg-dark overflow-hidden shadow-xl data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
      >
        <div className="h-full flex flex-col p-6 pl-8 pr-0 overflow-hidden">
          <DialogTitle className="text-2xl font-bold mb-8 shrink-0">
            Edit Invoice
          </DialogTitle>

          <div className="flex-1 overflow-y-auto pr-2">
            <InvoiceForm
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              initialData={invoice}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
