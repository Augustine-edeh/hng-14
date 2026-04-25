"use client";

import { useRouter } from "next/navigation";
import CreateNewInvoiceDialog from "@/components/CreateNewInvoiceDialog";

export default function Page() {
  const router = useRouter();

  return (
    <CreateNewInvoiceDialog open={true} onOpenChange={() => router.back()} />
  );
}
