"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

type ToastKind = "error" | "loading" | "success";

type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
};

type ToastOptions = {
  id?: string;
};

const TOAST_EVENT = "whisperbox-toast";

function emit(kind: ToastKind, message: string, options: ToastOptions = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastItem>(TOAST_EVENT, {
      detail: {
        id: options.id ?? crypto.randomUUID(),
        kind,
        message,
      },
    }),
  );
}

export const toast = {
  error: (message: string, options?: ToastOptions) =>
    emit("error", message, options),
  loading: (message: string, options?: ToastOptions) =>
    emit("loading", message, options),
  success: (message: string, options?: ToastOptions) =>
    emit("success", message, options),
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handleToast(event: Event) {
      const next = (event as CustomEvent<ToastItem>).detail;
      setItems((current) => {
        const withoutExisting = current.filter((item) => item.id !== next.id);
        return [...withoutExisting, next].slice(-4);
      });
      if (next.kind !== "loading") {
        window.setTimeout(() => {
          setItems((current) => current.filter((item) => item.id !== next.id));
        }, 3600);
      }
    }

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={styles.toastStack} role="status" aria-live="polite">
      {items.map((item) => (
        <div
          className={`${styles.appToast} ${styles[`appToast${item.kind}`]}`}
          key={item.id}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
