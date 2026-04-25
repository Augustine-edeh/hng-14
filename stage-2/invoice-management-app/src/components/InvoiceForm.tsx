"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceFormSchema, InvoiceFormInput } from "@/lib/validation";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/input";

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: InvoiceFormInput, status: InvoiceStatus) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  showDraftButton?: boolean;
  canChangeStatus?: boolean;
  onCancel?: () => void; // ✅ ADD THIS
}

export function InvoiceForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Save & Send",
  showDraftButton = true,
  canChangeStatus = true,
  onCancel = () => {}, // ✅ DEFAULT NO-OP
}: InvoiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialData
      ? {
          clientName: initialData.clientName,
          clientEmail: initialData.clientEmail,
          items: initialData.items,
          paymentDue: initialData.paymentDue,
        }
      : {
          clientName: "",
          clientEmail: "",
          items: [{ id: uuidv4(), name: "", qty: 1, price: 0 }],
          paymentDue: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const handleFormSubmit = (status: InvoiceStatus) => {
    handleSubmit((data) => {
      onSubmit(data, status);
    })();
  };

  return (
    <form className="flex flex-col space-y-6">
      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-invoice-primary font-bold">Bill From</h3>
        <div>
          <label htmlFor="clientName" className="block">
            Client Name
          </label>
          <Input
            id="clientName"
            type="text"
            placeholder="Enter client name"
            {...register("clientName")}
            className={errors.clientName ? "input-error" : ""}
          />
          {errors.clientName && (
            <p className="error-message">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientEmail" className="block">
            Email
          </label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="Enter email address"
            {...register("clientEmail")}
            className={errors.clientEmail ? "input-error" : ""}
          />
          {errors.clientEmail && (
            <p className="error-message">{errors.clientEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentDue" className="block">
            Invoice Date
          </label>
          <Input
            id="paymentDue"
            type="date"
            {...register("paymentDue")}
            className={errors.paymentDue ? "input-error" : ""}
          />
          {errors.paymentDue && (
            <p className="error-message">{errors.paymentDue.message}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="text-invoice-primary font-bold">Items</h3>
        {errors.items && (
          <p className="error-message">{errors.items.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor={`items.${index}.name`} className="block">
                  Item Name
                </label>
                <Input
                  id={`items.${index}.name`}
                  type="text"
                  placeholder="e.g. Design work"
                  {...register(`items.${index}.name`)}
                  className={errors.items?.[index]?.name ? "input-error" : ""}
                />
                {errors.items?.[index]?.name && (
                  <p className="error-message">
                    {errors.items[index]?.name?.message}
                  </p>
                )}
              </div>

              <div className="w-10">
                <label htmlFor={`items.${index}.qty`} className="block">
                  Qty
                </label>
                <Input
                  id={`items.${index}.qty`}
                  type="number"
                  min="1"
                  {...register(`items.${index}.qty`, { valueAsNumber: true })}
                  className={errors.items?.[index]?.qty ? "input-error" : ""}
                />
                {errors.items?.[index]?.qty && (
                  <p className="error-message">
                    {errors.items[index]?.qty?.message}
                  </p>
                )}
              </div>

              <div className="w-24">
                <label htmlFor={`items.${index}.price`} className="block">
                  Price
                </label>
                <Input
                  id={`items.${index}.price`}
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  className={errors.items?.[index]?.price ? "input-error" : ""}
                />
                {errors.items?.[index]?.price && (
                  <p className="error-message">
                    {errors.items[index]?.price?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block">Total</label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-invoice-text-secondary">
                  {items[index].qty * items[index].price}
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ id: uuidv4(), name: "", qty: 1, price: 0 })}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-[24px] bg-[#DFE3FA]/60 hover:bg-[#DFE3FA] dark:bg-invoice-card-dark text-[#7E88C3] dark:text-invoice-text-light dark:hover:bg-gray-700 font-medium transition-colors w-full"
        >
          <Plus className="size-5" />
          Add New Item
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-invoice-bg-dark">
        <button
          type="button"
          onClick={onCancel}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-full bg-invoice-action-button-edit-light dark:bg-invoice-action-button-edit-dark text-invoice-action-button-edit-text-light dark:text-invoice-text-light"
        >
          Cancel
        </button>

        <div className="flex gap-2">
          {showDraftButton && !initialData && (
            <button
              type="button"
              onClick={() => handleFormSubmit("draft")}
              disabled={isLoading}
              className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-full bg-invoice-status-draft text-invoice-text-secondary text-nowrap"
            >
              Save as Draft
            </button>
          )}
          <button
            type="button"
            onClick={() => handleFormSubmit(initialData?.status ?? "pending")}
            disabled={isLoading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-nowrap"
          >
            {isLoading ? "Saving..." : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
}
