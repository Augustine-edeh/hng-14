import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const NewInvoiceButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap rounded-[24px] p-1.5 pr-3.5 w-fit"
      onClick={onClick}
    >
      <div className="bg-white size-8 grid place-items-center rounded-full">
        <Plus size={10} className="size-5 text-invoice-primary" />
      </div>
      <span className="hidden sm:inline">New Invoice</span>
      <span className="sm:hidden">New</span>
    </button>
  );
};

export default NewInvoiceButton;
