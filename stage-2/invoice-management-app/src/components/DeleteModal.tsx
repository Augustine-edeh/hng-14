"use client";

import { useEffect, useRef } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  invoiceId: string;
  onConfirm: () => void;
  onClose: () => void;
}

// interface DeleteModalProps {
//   isOpen: boolean;
//   onClose: () => void; // ✅ ADD THIS
//   invoiceId: string;
// }

export function DeleteModal({
  isOpen,
  invoiceId,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus trap - focus on cancel button when modal opens
      cancelButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="invoice-card w-full max-w-md p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2
          id="modal-title"
          className="text-xl font-bold mb-2 text-invoice-text-primary dark:text-invoice-text-light"
        >
          Confirm Deletion
        </h2>
        <p
          id="modal-description"
          className="text-invoice-text-secondary dark:text-gray-300 mb-6"
        >
          Are you sure you want to delete invoice {invoiceId}? This action
          cannot be undone.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
