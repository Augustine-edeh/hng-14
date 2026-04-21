export type InvoiceStatus = "draft" | "pending" | "paid";

export interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  total: number;
  createdAt: string;
  paymentDue: string;
}

export interface CreateInvoiceInput {
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  paymentDue: string;
}
