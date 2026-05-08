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
  className?: string;
};

export function AppRail({
  sidebarView,
  theme,
  user,
  onLogoutClick,
  onThemeToggle,
  onViewChange,
  className,
}: AppRailProps) {
  return (
    <nav
      className={`${styles.desktopRail} ${className || ""}`}
      aria-label="Chat sections"
    >
      <div className="flex-1 flex flex-col items-center gap-3">
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

        {/* Theme toggler button */}
        <button
          onClick={onThemeToggle}
          type="button"
          title="Toggle theme"
          className="mt-auto"
        >
          {theme === "dark" ? (
            <Sun size={21} aria-hidden />
          ) : (
            <Moon size={21} aria-hidden />
          )}
        </button>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

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
