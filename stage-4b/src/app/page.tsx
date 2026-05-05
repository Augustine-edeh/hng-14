"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  KeyRound,
  Lock,
  LogOut,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getConversationMessages,
  getConversations,
  getUserPublicKey,
  login,
  logout,
  refreshAccessToken,
  register,
  searchUsers,
  sendMessageRest,
  WS_BASE_URL,
} from "@/lib/api";
import {
  createUserKeyBundle,
  decryptMessage,
  encryptMessage,
  importPublicKey,
  unlockPrivateKey,
} from "@/lib/crypto";
import { clearSession, loadSession, saveSession } from "@/lib/storage";
import {
  ConversationSummary,
  DecryptedMessage,
  MessageResponse,
  StoredSession,
  UserProfile,
  UserPublicInfo,
} from "@/lib/types";
import styles from "./page.module.css";

type AuthMode = "login" | "register";
type SocketState = "offline" | "connecting" | "online";

const emptyAuth = {
  username: "",
  displayName: "",
  password: "",
};

function displayInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "W";
}

function formatTime(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function normalizeWsMessage(event: MessageEvent): MessageResponse | null {
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

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [storedSession, setStoredSession] = useState<StoredSession | null>(
    null,
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activePartner, setActivePartner] = useState<UserPublicInfo | null>(
    null,
  );
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserPublicInfo[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [socketState, setSocketState] = useState<SocketState>("offline");
  const [busy, setBusy] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);

  const isUnlocked = Boolean(user && accessToken && privateKey);

  const refreshConversationList = useCallback(async () => {
    if (!accessToken) return;
    const nextConversations = await getConversations(accessToken);
    setConversations(nextConversations);
  }, [accessToken]);

  const decryptMessages = useCallback(
    async (incoming: MessageResponse[]) => {
      if (!privateKey || !user) return [];
      return Promise.all(
        incoming
          .slice()
          .reverse()
          .map(async (message) => {
            try {
              const useSelfCopy = message.from_user_id === user.id;
              return {
                ...message,
                text: await decryptMessage(
                  message.payload,
                  privateKey,
                  useSelfCopy,
                ),
              };
            } catch {
              return {
                ...message,
                text: null,
                decryptError: "Unable to decrypt on this device",
              };
            }
          }),
      );
    },
    [privateKey, user],
  );

  const loadThread = useCallback(
    async (partner: UserPublicInfo) => {
      if (!accessToken || !privateKey) return;
      setActivePartner(partner);
      setStatus("Loading encrypted history...");
      setError("");
      try {
        const history = await getConversationMessages(partner.id, accessToken);
        setMessages(await decryptMessages(history));
        setStatus("");
      } catch (issue) {
        setError(
          issue instanceof Error ? issue.message : "Could not load messages.",
        );
      }
    },
    [accessToken, decryptMessages, privateKey],
  );

  useEffect(() => {
    loadSession()
      .then(async (session) => {
        if (!session) return;
        setStoredSession(session);
        setUser(session.user);
        setRefreshToken(session.refreshToken);
        if (session.privateKey) setPrivateKey(session.privateKey);
        try {
          const token = await refreshAccessToken(session.refreshToken);
          setAccessToken(token.access_token);
        } catch {
          await clearSession();
          setStoredSession(null);
          setUser(null);
        }
      })
      .catch(() => setError("Could not open IndexedDB for saved session data."))
      .finally(() => setRestoringSession(false));
  }, []);

  useEffect(() => {
    if (!accessToken || !privateKey) return;
    queueMicrotask(() => {
      refreshConversationList().catch(() => undefined);
    });
  }, [accessToken, privateKey, refreshConversationList]);

  useEffect(() => {
    if (!accessToken || !privateKey) return;

    queueMicrotask(() => setSocketState("connecting"));
    const socket = new WebSocket(
      `${WS_BASE_URL}?token=${encodeURIComponent(accessToken)}`,
    );
    socketRef.current = socket;

    socket.onopen = () => setSocketState("online");
    socket.onclose = () => setSocketState("offline");
    socket.onerror = () => setSocketState("offline");
    socket.onmessage = async (event) => {
      const incoming = normalizeWsMessage(event);
      if (!incoming) return;
      const decrypted = await decryptMessages([incoming]);
      setMessages((current) => {
        if (current.some((message) => message.id === incoming.id))
          return current;
        const belongsToOpenThread =
          activePartner &&
          [incoming.from_user_id, incoming.to_user_id].includes(
            activePartner.id,
          );
        return belongsToOpenThread ? [...current, ...decrypted] : current;
      });
      refreshConversationList().catch(() => undefined);
    };

    return () => {
      socket.close();
    };
  }, [
    accessToken,
    activePartner,
    decryptMessages,
    privateKey,
    refreshConversationList,
  ]);

  useEffect(() => {
    if (!accessToken || searchQuery.trim().length < 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      searchUsers(searchQuery.trim(), accessToken)
        .then(setSearchResults)
        .catch(() => setSearchResults([]));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [accessToken, searchQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const activeConversation = useMemo(
    () =>
      activePartner
        ? conversations.find(
            (conversation) => conversation.user_id === activePartner.id,
          )
        : null,
    [activePartner, conversations],
  );

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setStatus(
      authMode === "register"
        ? "Generating RSA keys..."
        : "Unlocking private key...",
    );

    try {
      const username = authForm.username.trim();
      const password = authForm.password;
      let sessionPrivateKey: CryptoKey | null = null;
      const response =
        authMode === "register"
          ? await (async () => {
              const keyBundle = await createUserKeyBundle(password);
              const auth = await register({
                username,
                display_name: authForm.displayName.trim(),
                password,
                public_key: keyBundle.publicKey,
                wrapped_private_key: keyBundle.wrappedPrivateKey,
                pbkdf2_salt: keyBundle.salt,
              });
              sessionPrivateKey = keyBundle.privateKey;
              setPrivateKey(keyBundle.privateKey);
              return auth;
            })()
          : await (async () => {
              const auth = await login(username, password);
              sessionPrivateKey = await unlockPrivateKey(
                password,
                auth.user.wrapped_private_key,
                auth.user.pbkdf2_salt,
              );
              setPrivateKey(sessionPrivateKey);
              return auth;
            })();

      setUser(response.user);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      setStoredSession({
        refreshToken: response.refresh_token,
        user: response.user,
        ...(sessionPrivateKey ? { privateKey: sessionPrivateKey } : {}),
      });
      await saveSession({
        refreshToken: response.refresh_token,
        user: response.user,
        ...(sessionPrivateKey ? { privateKey: sessionPrivateKey } : {}),
      });
      setAuthForm(emptyAuth);
      setStatus("Secure session ready.");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Authentication failed.",
      );
      setPrivateKey(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!storedSession || !accessToken) return;
    setBusy(true);
    setError("");
    setStatus("Deriving wrapping key...");
    try {
      const unlocked = await unlockPrivateKey(
        unlockPassword,
        storedSession.user.wrapped_private_key,
        storedSession.user.pbkdf2_salt,
      );
      setPrivateKey(unlocked);
      await saveSession({ ...storedSession, privateKey: unlocked });
      setStoredSession({ ...storedSession, privateKey: unlocked });
      setUnlockPassword("");
      setStatus("Device unlocked.");
    } catch {
      setError("That password could not unwrap this device key.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      if (refreshToken && accessToken) await logout(refreshToken, accessToken);
    } catch {
      // The local cleanup is still the important part for this device.
    } finally {
      socketRef.current?.close();
      await clearSession();
      setStoredSession(null);
      setUser(null);
      setAccessToken("");
      setRefreshToken("");
      setPrivateKey(null);
      setConversations([]);
      setActivePartner(null);
      setMessages([]);
      setBusy(false);
      setStatus("");
    }
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activePartner || !user || !accessToken || !draft.trim()) return;
    setBusy(true);
    setError("");

    try {
      const { public_key: recipientKey } = await getUserPublicKey(
        activePartner.id,
        accessToken,
      );
      let recipientPublicKey: CryptoKey;
      let senderKey: CryptoKey;

      try {
        [recipientPublicKey, senderKey] = await Promise.all([
          importPublicKey(recipientKey),
          importPublicKey(user.public_key),
        ]);
      } catch {
        throw new Error(
          `${activePartner.display_name}'s stored public key is not a supported RSA-OAEP key.`,
        );
      }

      const payload = await encryptMessage(
        draft.trim(),
        recipientPublicKey,
        senderKey,
      );
      const stored = await sendMessageRest(
        activePartner.id,
        payload,
        accessToken,
      );

      setDraft("");
      const decrypted = await decryptMessages([stored]);
      setMessages((current) => [...current, ...decrypted]);
      await refreshConversationList();
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Message could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (restoringSession) {
    return (
      <main className={styles.authShell}>
        <section className={styles.authPanel}>
          <div className={styles.brandMark}>
            <RefreshCw size={26} aria-hidden />
          </div>
          <div>
            <p className={styles.kicker}>WhisperBox E2EE</p>
            <h1>Restoring secure session</h1>
            <p className={styles.authCopy}>
              Checking your saved session and reopening the encrypted chat.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!isUnlocked || !user) {
    const hasSavedSession = Boolean(user && accessToken && storedSession);

    return (
      <main className={styles.authShell}>
        <section className={styles.authPanel}>
          <div className={styles.brandMark}>
            <Lock size={26} aria-hidden />
          </div>
          <div>
            <p className={styles.kicker}>WhisperBox E2EE</p>
            <h1>
              {hasSavedSession
                ? "Unlock this device"
                : "Private messages, actually private."}
            </h1>
            <p className={styles.authCopy}>
              Messages are encrypted in your browser with AES-GCM and RSA-OAEP
              before the WhisperBox backend stores them.
            </p>
          </div>

          {hasSavedSession ? (
            <form className={styles.authForm} onSubmit={handleUnlock}>
              <label>
                Password
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(event) => setUnlockPassword(event.target.value)}
                  placeholder={`Password for @${user?.username}`}
                  required
                />
              </label>
              <button className={styles.primaryButton} disabled={busy}>
                <KeyRound size={18} aria-hidden />
                Unlock private key
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={handleLogout}
              >
                Use another account
              </button>
            </form>
          ) : (
            <>
              <div
                className={styles.segmented}
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  className={authMode === "login" ? styles.activeSegment : ""}
                  onClick={() => setAuthMode("login")}
                  type="button"
                >
                  Sign in
                </button>
                <button
                  className={
                    authMode === "register" ? styles.activeSegment : ""
                  }
                  onClick={() => setAuthMode("register")}
                  type="button"
                >
                  Create account
                </button>
              </div>
              <form className={styles.authForm} onSubmit={handleAuth}>
                <label>
                  Username
                  <input
                    value={authForm.username}
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    placeholder="alice_92"
                    minLength={authMode === "register" ? 3 : 1}
                    maxLength={32}
                    required
                  />
                </label>
                {authMode === "register" ? (
                  <label>
                    Display name
                    <input
                      value={authForm.displayName}
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          displayName: event.target.value,
                        }))
                      }
                      placeholder="Alice"
                      maxLength={128}
                      required
                    />
                  </label>
                ) : null}
                <label>
                  Password
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    minLength={authMode === "register" ? 8 : 1}
                    maxLength={128}
                    required
                  />
                </label>
                <button className={styles.primaryButton} disabled={busy}>
                  {authMode === "register" ? (
                    <UserPlus size={18} />
                  ) : (
                    <KeyRound size={18} />
                  )}
                  {authMode === "register"
                    ? "Generate keys and register"
                    : "Sign in securely"}
                </button>
              </form>
            </>
          )}

          {status ? <p className={styles.status}>{status}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.appShell}>
      <aside className={styles.sidebar}>
        <header className={styles.profileBar}>
          <div className={styles.avatar}>
            {displayInitial(user.display_name)}
          </div>
          <div>
            <strong>{user.display_name}</strong>
            <span>@{user.username}</span>
          </div>
          <button
            className={styles.iconButton}
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={18} aria-hidden />
          </button>
        </header>

        <div className={styles.securityStrip}>
          <ShieldCheck size={18} aria-hidden />
          <span>Private key is unlocked in memory only</span>
        </div>

        <label className={styles.searchBox}>
          <Search size={17} aria-hidden />
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              if (!event.target.value.trim()) setSearchResults([]);
            }}
            placeholder="Search users"
          />
        </label>

        {searchResults.length > 0 ? (
          <div className={styles.searchResults}>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  loadThread(result);
                }}
              >
                <span className={styles.smallAvatar}>
                  {displayInitial(result.display_name)}
                </span>
                <span>
                  <strong>{result.display_name}</strong>
                  <small>@{result.username}</small>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        <nav className={styles.conversationList} aria-label="Conversations">
          {conversations.length === 0 ? (
            <div className={styles.emptyList}>
              <MessageCircle size={22} aria-hidden />
              <p>Search for a teammate to start an encrypted chat.</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.user_id}
                className={
                  activePartner?.id === conversation.user_id
                    ? styles.activeConversation
                    : ""
                }
                onClick={() =>
                  loadThread({
                    id: conversation.user_id,
                    username: conversation.username,
                    display_name: conversation.display_name,
                  })
                }
              >
                <span className={styles.smallAvatar}>
                  {displayInitial(conversation.display_name)}
                </span>
                <span>
                  <strong>{conversation.display_name}</strong>
                  <small>@{conversation.username}</small>
                </span>
                <time>{formatTime(conversation.last_message_at)}</time>
              </button>
            ))
          )}
        </nav>
      </aside>

      <section className={styles.chatPane}>
        {activePartner ? (
          <>
            <header className={styles.chatHeader}>
              <div className={styles.avatar}>
                {displayInitial(activePartner.display_name)}
              </div>
              <div>
                <strong>{activePartner.display_name}</strong>
                <span>@{activePartner.username}</span>
              </div>
              <div className={styles.connectionBadge}>
                {socketState === "online" ? (
                  <CheckCircle2 size={16} aria-hidden />
                ) : socketState === "connecting" ? (
                  <RefreshCw size={16} aria-hidden />
                ) : (
                  <Circle size={16} aria-hidden />
                )}
                {socketState}
              </div>
            </header>

            <div className={styles.messageScroller}>
              {messages.length === 0 ? (
                <div className={styles.emptyThread}>
                  <Lock size={32} aria-hidden />
                  <p>No readable messages yet.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const mine = message.from_user_id === user.id;
                  return (
                    <article
                      key={message.id}
                      className={`${styles.messageBubble} ${mine ? styles.mine : styles.theirs}`}
                    >
                      {message.text ? (
                        <p>{message.text}</p>
                      ) : (
                        <p className={styles.decryptFailure}>
                          <AlertTriangle size={15} aria-hidden />
                          {message.decryptError}
                        </p>
                      )}
                      <footer>
                        <Lock size={12} aria-hidden />
                        <span>AES-GCM</span>
                        <time>{formatTime(message.created_at)}</time>
                      </footer>
                    </article>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form className={styles.composer} onSubmit={handleSend}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write an encrypted message"
                rows={1}
              />
              <button
                className={styles.sendButton}
                disabled={busy || !draft.trim()}
                title="Send"
              >
                <Send size={19} aria-hidden />
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noThread}>
            <ShieldCheck size={48} aria-hidden />
            <h1>Choose a conversation</h1>
            <p>
              Search users or select a thread. Plaintext stays in this browser;
              the API receives only encrypted payloads.
            </p>
          </div>
        )}

        {activeConversation?.last_message_at ? null : null}
        {status ? <p className={styles.toast}>{status}</p> : null}
        {error ? (
          <p className={`${styles.toast} ${styles.toastError}`}>{error}</p>
        ) : null}
      </section>
    </main>
  );
}
