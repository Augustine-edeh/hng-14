import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Lock,
  Menu,
  MessageCircle,
  MoreVertical,
  RefreshCw,
  Send,
} from "lucide-react";
import { FormEvent, RefObject } from "react";
import styles from "@/app/page.module.css";
import { displayInitial, formatTime, SocketState } from "@/lib/chat-ui";
import { DecryptedMessage, UserProfile, UserPublicInfo } from "@/lib/types";

type ChatPaneProps = {
  activePartner: UserPublicInfo | null;
  bottomRef: RefObject<HTMLDivElement | null>;
  busy: boolean;
  draft: string;
  draftRef: RefObject<HTMLTextAreaElement | null>;
  messages: DecryptedMessage[];
  partnerOnline: boolean | null;
  socketState: SocketState;
  user: UserProfile;
  onAccountMenuToggle: () => void;
  onDraftChange: (value: string) => void;
  onMenuOpen: () => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
};

export function ChatPane({
  activePartner,
  bottomRef,
  busy,
  draft,
  draftRef,
  messages,
  partnerOnline,
  socketState,
  user,
  onAccountMenuToggle,
  onDraftChange,
  onMenuOpen,
  onSend,
  className,
}: ChatPaneProps) {
  return (
    <section className={`${styles.chatPane} ${className || ""}`}>
      {activePartner ? (
        <>
          <header className={styles.chatHeader}>
            <button
              className={`${styles.iconButton} ${styles.mobileMenuButton}`}
              onClick={onMenuOpen}
              title="Open menu"
            >
              <Menu size={19} aria-hidden />
            </button>
            <div className={styles.avatar}>
              {displayInitial(activePartner.display_name)}
            </div>
            <div>
              <strong>{activePartner.display_name}</strong>
              <span>
                {partnerOnline === null
                  ? `@${activePartner.username}`
                  : partnerOnline
                    ? "online"
                    : "offline"}
              </span>
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
            <button
              className={`${styles.iconButton} ${styles.profileMenuButton}`}
              data-profile-trigger
              onClick={onAccountMenuToggle}
              title="Account menu"
            >
              <MoreVertical size={19} aria-hidden />
            </button>
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

          <form className={styles.composer} onSubmit={onSend}>
            <textarea
              ref={draftRef}
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
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
          <button
            className={`${styles.iconButton} ${styles.noThreadMenuButton}`}
            onClick={onMenuOpen}
            title="Open menu"
          >
            <Menu size={20} aria-hidden />
          </button>
          <button
            className={`${styles.iconButton} ${styles.noThreadAccountButton}`}
            data-profile-trigger
            onClick={onAccountMenuToggle}
            title="Account menu"
          >
            <MoreVertical size={20} aria-hidden />
          </button>
          <div className={styles.noThreadIcon}>
            <MessageCircle size={42} aria-hidden />
          </div>
          <h1>Choose a conversation</h1>
          <p>Search users or select a thread to get a conversation started.</p>
        </div>
      )}
    </section>
  );
}
