import { FileText } from "lucide-react";
import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No invoices found",
  description = "Create your first invoice to get started.",
}: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center gap-10.5 sm:gap-16 py-12">
      <div className="w-48 h-40 relative">
        <Image
          src="/images/empty-state.png"
          alt="Empty state"
          fill
          className="object-contain"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-invoice-text-primary dark:text-invoice-text-light">
          There is nothing here
        </h3>

        <p className="w-full max-w-3xs text-center text-xs text-invoice-text-secondary dark:text-gray-400">
          Create an invoice by clicking the <strong>New</strong> button and get
          started
        </p>
      </div>
    </div>
  );
}
