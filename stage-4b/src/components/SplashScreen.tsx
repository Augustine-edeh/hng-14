import { MessageCircle, RefreshCw } from "lucide-react";
import styles from "@/app/page.module.css";

export function SplashScreen() {
  return (
    <main className={styles.authShell}>
      <section className={`${styles.authPanel} ${styles.splashPanel}`}>
        <div className={styles.splashMark}>
          <MessageCircle size={30} aria-hidden />
          <RefreshCw size={18} aria-hidden className={styles.splashSpinner} />
        </div>
        <div>
          <p className={styles.kicker}>WhisperBox E2EE</p>
          <h1>Reopening your chats</h1>
          <p className={styles.authCopy}>
            Restoring your encrypted session on this device.
          </p>
        </div>
        <div className={styles.splashProgress} aria-hidden>
          <span />
        </div>
      </section>
    </main>
  );
}
