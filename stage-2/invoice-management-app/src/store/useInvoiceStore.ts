import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Invoice,
  InvoiceStatus,
  CreateInvoiceInput,
  InvoiceItem,
} from "@/types/invoice";

interface InvoiceStore {
  invoices: Invoice[];
  filterStatus: InvoiceStatus | "all";

  // CRUD operations
  addInvoice: (input: CreateInvoiceInput, status: InvoiceStatus) => void;
  updateInvoice: (
    id: string,
    input: CreateInvoiceInput,
    status?: InvoiceStatus,
  ) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;

  // Filtering
  setFilterStatus: (status: InvoiceStatus | "all") => void;
  getFilteredInvoices: () => Invoice[];

  // Status updates
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      filterStatus: "all",

      addInvoice: (input, status) => {
        const newInvoice: Invoice = {
          id: `INV-${Date.now()}`,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          status,
          items: input.items,
          total: calculateTotal(input.items),
          createdAt: new Date().toISOString(),
          paymentDue: input.paymentDue,
        };
        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));
      },

      updateInvoice: (id, input, status) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) => {
            if (invoice.id === id) {
              // Cannot update paid invoices
              if (invoice.status === "paid") {
                return invoice;
              }
              return {
                ...invoice,
                clientName: input.clientName,
                clientEmail: input.clientEmail,
                items: input.items,
                total: calculateTotal(input.items),
                paymentDue: input.paymentDue,
                status: status || invoice.status,
              };
            }
            return invoice;
          }),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }));
      },

      getInvoiceById: (id) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },

      setFilterStatus: (status) => {
        set({ filterStatus: status });
      },

      getFilteredInvoices: () => {
        const { invoices, filterStatus } = get();
        if (filterStatus === "all") {
          return invoices;
        }
        return invoices.filter((invoice) => invoice.status === filterStatus);
      },

      updateInvoiceStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) => {
            if (invoice.id === id) {
              // Paid invoices cannot revert to draft or pending
              if (invoice.status === "paid") {
                return invoice;
              }
              // Can only go draft -> pending -> paid
              if (invoice.status === "pending" && status === "draft") {
                return invoice;
              }
              return { ...invoice, status };
            }
            return invoice;
          }),
        }));
      },
    }),
    {
      name: "invoice-storage",
    },
  ),
);

function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}
