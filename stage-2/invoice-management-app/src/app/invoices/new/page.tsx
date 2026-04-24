"use client";

import { useRouter } from "next/navigation";
// import { CreateInvoiceSheet } from "@/components/CreateInvoiceSheet";
import CreateNewInvoiceDialog from "@/components/CreateNewInvoiceDialog";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <CreateNewInvoiceDialog open={true} onOpenChange={() => router.back()} />
      {/* <CreateInvoiceSheet open={true} onOpenChange={() => router.back()} /> */}
    </>
  );
}
