"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "@/components/ui/sonner";
import { AppRail } from "@/components/AppRail";
import { AuthScreen } from "@/components/AuthScreen";
import { ChatPane } from "@/components/ChatPane";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Sidebar } from "@/components/Sidebar";
import { SplashScreen } from "@/components/SplashScreen";
import { WindowTitleBar } from "@/components/WindowTitleBar";
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
import {
  AuthMode,
  emptyAuth,
  normalizePresenceMessage,
  normalizeWsMessage,
  SidebarView,
  SocketState,
  ThemeMode,
} from "@/lib/chat-ui";
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

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);
  const activePartnerRef = useRef<UserPublicInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const draftRef = useRef<HTMLTextAreaElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<UserPublicInfo[]>(
    [],
  );
  const [presenceByUserId, setPresenceByUserId] = useState<
    Record<string, boolean>
  >({});
  const [draft, setDraft] = useState("");
  const [socketState, setSocketState] = useState<SocketState>("offline");
  const [busy, setBusy] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>("chats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const isUnlocked = Boolean(user && accessToken && privateKey);

  useEffect(() => {
    activePartnerRef.current = activePartner;
  }, [activePartner]);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem("whisprapp-theme") ??
      window.localStorage.getItem("whisperbox-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("whisprapp-theme", theme);
  }, [theme]);

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
      try {
        const history = await getConversationMessages(partner.id, accessToken);
        setMessages(await decryptMessages(history));
      } catch (issue) {
        toast.error(
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
      .catch(() => toast.error("Could not open saved session data."))
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

    let reconnectTimeout: number | undefined;
    let closedByEffect = false;

    function connect() {
      setSocketState("connecting");
      const socket = new WebSocket(
        `${WS_BASE_URL}?token=${encodeURIComponent(accessToken)}`,
      );
      socketRef.current = socket;

      socket.onopen = () => setSocketState("online");
      socket.onerror = () => setSocketState("offline");
      socket.onclose = () => {
        setSocketState("offline");
        if (!closedByEffect) {
          reconnectTimeout = window.setTimeout(connect, 2500);
        }
      };
      socket.onmessage = async (event) => {
        const presence = normalizePresenceMessage(event);
        if (presence) {
          setPresenceByUserId((current) => ({
            ...current,
            [presence.userId]: presence.online,
          }));
          return;
        }

        const incoming = normalizeWsMessage(event);
        if (!incoming) return;
        const decrypted = await decryptMessages([incoming]);
        setMessages((current) => {
          if (current.some((message) => message.id === incoming.id))
            return current;
          const openPartner = activePartnerRef.current;
          const belongsToOpenThread =
            openPartner &&
            [incoming.from_user_id, incoming.to_user_id].includes(
              openPartner.id,
            );
          return belongsToOpenThread ? [...current, ...decrypted] : current;
        });
        refreshConversationList().catch(() => undefined);
      };
    }

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimeout) window.clearTimeout(reconnectTimeout);
      socketRef.current?.close();
    };
  }, [accessToken, decryptMessages, privateKey, refreshConversationList]);

  useEffect(() => {
    if (!accessToken || userSearchQuery.trim().length < 1) {
      setUserSearchResults([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      searchUsers(userSearchQuery.trim(), accessToken)
        .then(setUserSearchResults)
        .catch(() => setUserSearchResults([]));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [accessToken, userSearchQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const input = draftRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  }, [draft]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-profile-trigger]")
      ) {
        return;
      }
      if (
        profileMenuRef.current &&
        target instanceof Node &&
        !profileMenuRef.current.contains(target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  const activeConversation = useMemo(
    () =>
      activePartner
        ? conversations.find(
            (conversation) => conversation.user_id === activePartner.id,
          )
        : null,
    [activePartner, conversations],
  );

  const handleSelectPartner = useCallback(
    (partner: UserPublicInfo) => {
      setUserSearchQuery("");
      setUserSearchResults([]);
      setSidebarOpen(false);
      loadThread(partner);
    },
    [loadThread],
  );

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    toast.loading(
      authMode === "register"
        ? "Generating RSA keys..."
        : "Unlocking private key...",
      { id: "auth" },
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
      toast.success("Secure session ready.", { id: "auth" });
    } catch (issue) {
      toast.error(
        issue instanceof Error ? issue.message : "Authentication failed.",
        {
          id: "auth",
        },
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
    toast.loading("Unlocking this device...", { id: "unlock" });
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
      toast.success("Device unlocked.", { id: "unlock" });
    } catch {
      toast.error("That password could not unwrap this device key.", {
        id: "unlock",
      });
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
      setProfileMenuOpen(false);
      toast.success("Signed out.");
    }
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activePartner || !user || !accessToken || !draft.trim()) return;
    setBusy(true);

    const text = draft.trim();
    setDraft("");

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

      const payload = await encryptMessage(text, recipientPublicKey, senderKey);
      const socket = socketRef.current;

      if (socket?.readyState === WebSocket.OPEN) {
        const optimisticMessage: DecryptedMessage = {
          id: crypto.randomUUID(),
          from_user_id: user.id,
          to_user_id: activePartner.id,
          payload,
          delivered: false,
          created_at: new Date().toISOString(),
          text,
        };
        socket.send(
          JSON.stringify({
            type: "message.send",
            event: "message.send",
            to: activePartner.id,
            payload,
          }),
        );
        setMessages((current) => [...current, optimisticMessage]);
        refreshConversationList().catch(() => undefined);
      } else {
        const stored = await sendMessageRest(
          activePartner.id,
          payload,
          accessToken,
        );
        const decrypted = await decryptMessages([stored]);
        setMessages((current) => [...current, ...decrypted]);
        await refreshConversationList();
      }
    } catch (issue) {
      setDraft(text);
      toast.error(
        issue instanceof Error ? issue.message : "Message could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  function handleViewChange(view: SidebarView) {
    setSidebarView(view);
    setSidebarOpen(true);
  }

  if (restoringSession) return <SplashScreen />;

  if (!isUnlocked || !user) {
    return (
      <AuthScreen
        authMode={authMode}
        authForm={authForm}
        busy={busy}
        hasSavedSession={Boolean(user && accessToken && storedSession)}
        showAuthPassword={showAuthPassword}
        showUnlockPassword={showUnlockPassword}
        unlockPassword={unlockPassword}
        user={user}
        onAuth={handleAuth}
        onAuthFormChange={setAuthForm}
        onAuthModeChange={setAuthMode}
        onLogout={handleLogout}
        onShowAuthPasswordChange={setShowAuthPassword}
        onShowUnlockPasswordChange={setShowUnlockPassword}
        onUnlock={handleUnlock}
        onUnlockPasswordChange={setUnlockPassword}
      />
    );
  }

  return (
    <div className={styles.windowShell} data-theme={theme}>
      <WindowTitleBar theme={theme} />
      <main className={styles.appShell} data-theme={theme}>
        <div
          className={`${styles.mobileScrim} ${sidebarOpen ? styles.mobileScrimOpen : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <AppRail
          sidebarView={sidebarView}
          theme={theme}
          user={user}
          onLogoutClick={() => setProfileMenuOpen((current) => !current)}
          onThemeToggle={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
          onViewChange={setSidebarView}
          className="border-none"
        />
        <Sidebar
          activePartner={activePartner}
          chatSearchQuery={chatSearchQuery}
          conversations={conversations}
          isOpen={sidebarOpen}
          sidebarView={sidebarView}
          userSearchQuery={userSearchQuery}
          userSearchResults={userSearchResults}
          onChatSearchChange={setChatSearchQuery}
          onClose={() => setSidebarOpen(false)}
          onPartnerSelect={handleSelectPartner}
          onUserSearchChange={setUserSearchQuery}
          className="rounded-l-lg border !border-gray-300 dark:!border-gray-700"
        />
        <ChatPane
          activePartner={activePartner}
          bottomRef={bottomRef}
          busy={busy}
          draft={draft}
          draftRef={draftRef}
          messages={messages}
          partnerOnline={
            activePartner ? (presenceByUserId[activePartner.id] ?? null) : null
          }
          socketState={socketState}
          user={user}
          onAccountMenuToggle={() => setProfileMenuOpen((current) => !current)}
          onDraftChange={setDraft}
          onMenuOpen={() => setSidebarOpen(true)}
          onSend={handleSend}
          className="border !border-gray-300 dark:!border-gray-700"
        />

        {profileMenuOpen ? (
          <ProfileMenu
            menuRef={profileMenuRef}
            user={user}
            onLogout={handleLogout}
          />
        ) : null}
        <MobileBottomNav
          sidebarView={sidebarView}
          theme={theme}
          onThemeToggle={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
          onViewChange={handleViewChange}
        />
        {activeConversation?.last_message_at ? null : null}
      </main>
    </div>
  );
}
