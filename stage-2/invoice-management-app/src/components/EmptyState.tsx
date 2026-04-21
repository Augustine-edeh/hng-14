import { FileText } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No invoices found",
  description = "Create your first invoice to get started.",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <FileText className="w-16 h-16 text-invoice-text-secondary dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-bold text-invoice-text-primary dark:text-invoice-text-light mb-2">
        {title}
      </h3>
      <p className="text-invoice-text-secondary dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
