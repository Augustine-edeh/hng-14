import { InvoiceStatus } from "@/types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "pending":
        return "status-pending";
      case "draft":
        return "status-draft";
      default:
        return "status-draft";
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`invoice-badge ${getStatusStyles(status)}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {getStatusLabel(status)}
    </span>
  );
}
