import {
  AuthResponse,
  ConversationSummary,
  EncryptedPayload,
  MessageResponse,
  TokenResponse,
  UserProfile,
  UserPublicInfo,
} from "./types";

export const API_BASE_URL = "https://whisperbox.koyeb.app";
export const WS_BASE_URL = "wss://whisperbox.koyeb.app/ws";

type ApiErrorBody = {
  detail?: string | { msg?: string }[];
  message?: string;
};

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail.map((item) => item.msg).filter(Boolean).join(", ");
    }
    return body.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<T>;
}

export function register(payload: {
  username: string;
  display_name: string;
  password: string;
  public_key: string;
  wrapped_private_key: string;
  pbkdf2_salt: string;
}) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(username: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function refreshAccessToken(refresh_token: string) {
  return request<TokenResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

export function logout(refresh_token: string, token: string) {
  return request<Record<string, unknown>>(
    "/auth/logout",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    },
    token,
  );
}

export function getMe(token: string) {
  return request<UserProfile>("/auth/me", {}, token);
}

export function searchUsers(query: string, token: string) {
  return request<UserPublicInfo[]>(
    `/users/search?q=${encodeURIComponent(query)}`,
    {},
    token,
  );
}

export function getUserPublicKey(userId: string, token: string) {
  return request<{ public_key: string }>(`/users/${userId}/public-key`, {}, token);
}

export function getConversations(token: string) {
  return request<ConversationSummary[]>("/conversations", {}, token);
}

export function getConversationMessages(userId: string, token: string) {
  return request<MessageResponse[]>(
    `/conversations/${userId}/messages?limit=50`,
    {},
    token,
  );
}

export function sendMessageRest(to: string, payload: EncryptedPayload, token: string) {
  return request<MessageResponse>(
    "/messages",
    {
      method: "POST",
      body: JSON.stringify({ to, payload }),
    },
    token,
  );
}
