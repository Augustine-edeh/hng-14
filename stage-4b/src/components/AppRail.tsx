import { MessageCircle, MessagesSquare, Moon, Sun, Users } from "lucide-react";
import styles from "@/app/page.module.css";
import { displayInitial, SidebarView, ThemeMode } from "@/lib/chat-ui";
import { UserProfile } from "@/lib/types";

type AppRailProps = {
  sidebarView: SidebarView;
  theme: ThemeMode;
  user: UserProfile;
  onLogoutClick: () => void;
  onThemeToggle: () => void;
  onViewChange: (view: SidebarView) => void;
};

export function AppRail({
  sidebarView,
  theme,
  user,
  onLogoutClick,
  onThemeToggle,
  onViewChange,
}: AppRailProps) {
  return (
    <nav
      className={`${styles.desktopRail} bg-red-500`}
      aria-label="Chat sections"
    >
      <div className={styles.railBrand}>
        <MessageCircle size={24} aria-hidden />
      </div>
      <button
        className={sidebarView === "chats" ? styles.activeRailItem : ""}
        onClick={() => onViewChange("chats")}
        type="button"
        title="Chats"
      >
        <MessagesSquare size={22} aria-hidden />
      </button>
      <button
        className={sidebarView === "users" ? styles.activeRailItem : ""}
        onClick={() => onViewChange("users")}
        type="button"
        title="Users"
      >
        <Users size={22} aria-hidden />
      </button>
      <button onClick={onThemeToggle} type="button" title="Toggle theme">
        {theme === "dark" ? (
          <Sun size={21} aria-hidden />
        ) : (
          <Moon size={21} aria-hidden />
        )}
      </button>
      <button
        className={styles.railAvatar}
        data-profile-trigger
        onClick={onLogoutClick}
        type="button"
        title="Account"
      >
        {displayInitial(user.display_name)}
      </button>
    </nav>
  );
}
