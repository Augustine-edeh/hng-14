import { Copy, Maximize2, MessageCircle, Minus, X } from "lucide-react";
import { ThemeMode } from "@/lib/chat-ui";

type WindowTitleBarProps = {
  theme: ThemeMode;
};

export function WindowTitleBar({ theme }: WindowTitleBarProps) {
  const isLight = theme === "light";

  return (
    <header
      className={`hidden h-12 shrink-0 items-center justify-between px-3 md:flex ${
        isLight
          ? "border-[#e9edef] bg-[#f0f2f5] text-[#111b21]"
          : "border-[#222e35] bg-[#111b21] text-[#e9edef]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <MessageCircle className="size-7 text-[#00a884]" aria-hidden />
        <strong className="truncate text-[15px] font-semibold">
          WhisprApp
        </strong>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={`grid size-9 place-items-center rounded-md transition ${
            isLight ? "hover:bg-[#e9edef]" : "hover:bg-[#202c33]"
          }`}
          type="button"
          title="Minimize"
        >
          <Minus size={18} aria-hidden />
        </button>
        <button
          className={`grid size-9 place-items-center rounded-md transition ${
            isLight ? "hover:bg-[#e9edef]" : "hover:bg-[#202c33]"
          }`}
          type="button"
          title="Maximize"
        >
          {/* <Maximize2 size={15} aria-hidden /> */}
          <Copy size={15} aria-hidden className=" rotate-180" />
        </button>
        <button
          className="grid size-9 place-items-center rounded-md transition hover:bg-[#e81123] hover:text-white"
          type="button"
          title="Close"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
    </header>
  );
}
