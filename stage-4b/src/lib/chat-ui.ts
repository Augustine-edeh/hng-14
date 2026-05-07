import { MessageResponse } from "./types";

export type AuthMode = "login" | "register";
export type SocketState = "offline" | "connecting" | "online";
export type SidebarView = "chats" | "users";
export type ThemeMode = "dark" | "light";

export const emptyAuth = {
  username: "",
  displayName: "",
  password: "",
};

export function displayInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "W";
}

export function formatTime(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function normalizeWsMessage(event: MessageEvent): MessageResponse | null {
  try {
    const frame = JSON.parse(event.data as string);
    if (frame?.type === "message.receive" && frame.message)
      return frame.message;
    if (frame?.event === "message.receive" && frame.payload)
      return frame.payload;
    if (frame?.payload?.ciphertext && frame?.from_user_id) return frame;
  } catch {
    return null;
  }
  return null;
}

export function normalizePresenceMessage(event: MessageEvent) {
  try {
    const frame = JSON.parse(event.data as string);
    const payload = frame?.payload ?? frame;
    const type = frame?.type ?? frame?.event;
    if (type !== "presence.update" && type !== "user.presence") return null;
    const userId = payload?.user_id ?? payload?.userId;
    if (!userId) return null;
    return {
      userId: String(userId),
      online: Boolean(payload?.online ?? payload?.status === "online"),
    };
  } catch {
    return null;
  }
}
