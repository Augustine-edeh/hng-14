import { MessagesSquare, Moon, Sun, Users } from "lucide-react";
import styles from "@/app/page.module.css";
import { SidebarView, ThemeMode } from "@/lib/chat-ui";

type MobileBottomNavProps = {
  sidebarView: SidebarView;
  theme: ThemeMode;
  onThemeToggle: () => void;
  onViewChange: (view: SidebarView) => void;
};

export function MobileBottomNav({
  sidebarView,
  theme,
  onThemeToggle,
  onViewChange,
}: MobileBottomNavProps) {
  return (
    <nav className={styles.mobileBottomNav} aria-label="Chat sections">
      <button
        className={sidebarView === "chats" ? styles.activeMobileNavItem : ""}
        onClick={() => onViewChange("chats")}
        type="button"
      >
        <MessagesSquare size={20} aria-hidden />
        Chats
      </button>
      <button
        className={sidebarView === "users" ? styles.activeMobileNavItem : ""}
        onClick={() => onViewChange("users")}
        type="button"
      >
        <Users size={20} aria-hidden />
        Users
      </button>
      <button onClick={onThemeToggle} type="button">
        {theme === "dark" ? (
          <Sun size={20} aria-hidden />
        ) : (
          <Moon size={20} aria-hidden />
        )}
        Theme
      </button>
    </nav>
  );
}
