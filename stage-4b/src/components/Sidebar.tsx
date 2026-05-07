import { MessageCircle, Search, Users, X } from "lucide-react";
import styles from "@/app/page.module.css";
import { displayInitial, formatTime, SidebarView } from "@/lib/chat-ui";
import { ConversationSummary, UserPublicInfo } from "@/lib/types";

type SidebarProps = {
  activePartner: UserPublicInfo | null;
  chatSearchQuery: string;
  conversations: ConversationSummary[];
  isOpen: boolean;
  sidebarView: SidebarView;
  userSearchQuery: string;
  userSearchResults: UserPublicInfo[];
  onChatSearchChange: (value: string) => void;
  onClose: () => void;
  onPartnerSelect: (partner: UserPublicInfo) => void;
  onUserSearchChange: (value: string) => void;
  className?: string;
};

export function Sidebar({
  activePartner,
  chatSearchQuery,
  conversations,
  isOpen,
  sidebarView,
  userSearchQuery,
  userSearchResults,
  onChatSearchChange,
  onClose,
  onPartnerSelect,
  onUserSearchChange,
  className,
}: SidebarProps) {
  const filteredConversations = conversations.filter((conversation) => {
    const query = chatSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      conversation.display_name.toLowerCase().includes(query) ||
      conversation.username.toLowerCase().includes(query)
    );
  });

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""} ${className || ""}`}
      aria-label="Workspace navigation"
    >
      <header className={styles.sidebarTopBar}>
        <div>
          <strong>{sidebarView === "chats" ? "Chats" : "Users"}</strong>
          <span>
            {sidebarView === "chats"
              ? `${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`
              : "Find people"}
          </span>
        </div>
        <button
          className={`${styles.iconButton} ${styles.mobileCloseButton}`}
          onClick={onClose}
          title="Close menu"
        >
          <X size={18} aria-hidden />
        </button>
      </header>

      {sidebarView === "chats" ? (
        <label className={styles.searchBox}>
          <Search size={17} aria-hidden />
          <input
            value={chatSearchQuery}
            onChange={(event) => onChatSearchChange(event.target.value)}
            placeholder="Search chats"
          />
        </label>
      ) : (
        <label className={styles.searchBox}>
          <Search size={17} aria-hidden />
          <input
            value={userSearchQuery}
            onChange={(event) => onUserSearchChange(event.target.value)}
            placeholder="Search users"
          />
        </label>
      )}

      {sidebarView === "chats" ? (
        <nav className={styles.conversationList} aria-label="Conversations">
          {filteredConversations.length === 0 ? (
            <div className={styles.emptyList}>
              <MessageCircle size={22} aria-hidden />
              <p>
                {chatSearchQuery.trim()
                  ? "No chats matched that search."
                  : "Search users to start an encrypted chat."}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.user_id}
                className={
                  activePartner?.id === conversation.user_id
                    ? styles.activeConversation
                    : ""
                }
                onClick={() =>
                  onPartnerSelect({
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
      ) : (
        <nav className={styles.conversationList} aria-label="Users">
          {userSearchQuery.trim().length === 0 ? (
            <div className={styles.emptyList}>
              <Users size={22} aria-hidden />
              <p>Search by name or username to list platform users.</p>
            </div>
          ) : userSearchResults.length === 0 ? (
            <div className={styles.emptyList}>
              <Search size={22} aria-hidden />
              <p>No users matched that search.</p>
            </div>
          ) : (
            userSearchResults.map((result) => (
              <button
                key={result.id}
                className={
                  activePartner?.id === result.id
                    ? styles.activeConversation
                    : ""
                }
                onClick={() => onPartnerSelect(result)}
              >
                <span className={styles.smallAvatar}>
                  {displayInitial(result.display_name)}
                </span>
                <span>
                  <strong>{result.display_name}</strong>
                  <small>@{result.username}</small>
                </span>
                <MessageCircle size={16} aria-hidden />
              </button>
            ))
          )}
        </nav>
      )}
    </aside>
  );
}
