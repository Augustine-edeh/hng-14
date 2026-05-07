import { LogOut } from "lucide-react";
import { RefObject } from "react";
import styles from "@/app/page.module.css";
import { displayInitial } from "@/lib/chat-ui";
import { UserProfile } from "@/lib/types";

type ProfileMenuProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  user: UserProfile;
  onLogout: () => void;
};

export function ProfileMenu({ menuRef, user, onLogout }: ProfileMenuProps) {
  return (
    <div className={styles.profileMenu} ref={menuRef}>
      <div className={styles.profileMenuIdentity}>
        <div className={styles.avatar}>{displayInitial(user.display_name)}</div>
        <div>
          <strong>{user.display_name}</strong>
          <span>@{user.username}</span>
        </div>
      </div>
      <button onClick={onLogout} type="button">
        <LogOut size={18} aria-hidden />
        Log out
      </button>
    </div>
  );
}
