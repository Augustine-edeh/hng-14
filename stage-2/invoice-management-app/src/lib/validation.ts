import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Item name is required"),
  qty: z.number().int().positive("Quantity must be greater than 0"),
  price: z.number().positive("Price must be greater than 0"),
});

export const invoiceFormSchema = z.object({
  clientName: z
    .string()
    .min(1, "Client name is required")
    .min(3, "Client name must be at least 3 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  paymentDue: z.string().min(1, "Payment due date is required"),
});

export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;
