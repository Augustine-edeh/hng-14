"use client";

import { useRouter } from "next/navigation";
import { CreateInvoiceSheet } from "@/components/CreateInvoiceSheet";

export default function Page() {
  const router = useRouter();

  return <CreateInvoiceSheet open={true} onOpenChange={() => router.back()} />;
}
