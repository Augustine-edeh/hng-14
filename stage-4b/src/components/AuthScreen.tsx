import { Eye, EyeOff, KeyRound, Lock, UserPlus } from "lucide-react";
import { FormEvent } from "react";
import styles from "@/app/page.module.css";
import { AuthMode } from "@/lib/chat-ui";
import { UserProfile } from "@/lib/types";

type AuthFormState = {
  username: string;
  displayName: string;
  password: string;
};

type AuthScreenProps = {
  authMode: AuthMode;
  authForm: AuthFormState;
  busy: boolean;
  hasSavedSession: boolean;
  showAuthPassword: boolean;
  showUnlockPassword: boolean;
  unlockPassword: string;
  user: UserProfile | null;
  onAuth: (event: FormEvent<HTMLFormElement>) => void;
  onAuthModeChange: (mode: AuthMode) => void;
  onAuthFormChange: (form: AuthFormState) => void;
  onLogout: () => void;
  onShowAuthPasswordChange: (show: boolean) => void;
  onShowUnlockPasswordChange: (show: boolean) => void;
  onUnlock: (event: FormEvent<HTMLFormElement>) => void;
  onUnlockPasswordChange: (value: string) => void;
};

export function AuthScreen({
  authMode,
  authForm,
  busy,
  hasSavedSession,
  showAuthPassword,
  showUnlockPassword,
  unlockPassword,
  user,
  onAuth,
  onAuthModeChange,
  onAuthFormChange,
  onLogout,
  onShowAuthPasswordChange,
  onShowUnlockPasswordChange,
  onUnlock,
  onUnlockPasswordChange,
}: AuthScreenProps) {
  return (
    <main className={styles.authShell}>
      <p className="text-emerald-800">The secure messaging app for everyone.</p>

      <section className={styles.authPanel}>
        <div>
          <p className={`${styles.kicker} text-center`}>WhisprApp</p>
          <h1 className="text-center">
            {hasSavedSession
              ? "Unlock this device"
              : "Private messages you can trust."}
          </h1>
        </div>

        {hasSavedSession ? (
          <form className={styles.authForm} onSubmit={onUnlock}>
            <label>
              Password
              <span className={styles.passwordField}>
                <input
                  type={showUnlockPassword ? "text" : "password"}
                  value={unlockPassword}
                  onChange={(event) =>
                    onUnlockPasswordChange(event.target.value)
                  }
                  placeholder={`Password for @${user?.username}`}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    onShowUnlockPasswordChange(!showUnlockPassword)
                  }
                  title={showUnlockPassword ? "Hide password" : "Show password"}
                >
                  {showUnlockPassword ? (
                    <EyeOff size={18} aria-hidden />
                  ) : (
                    <Eye size={18} aria-hidden />
                  )}
                </button>
              </span>
            </label>
            <button className={styles.primaryButton} disabled={busy}>
              <KeyRound size={18} aria-hidden />
              Unlock private key
            </button>
            <button
              type="button"
              className={styles.textButton}
              onClick={onLogout}
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
                className={`${authMode === "login" ? styles.activeSegment : ""}`}
                onClick={() => onAuthModeChange("login")}
                type="button"
              >
                Sign in
              </button>
              <button
                className={authMode === "register" ? styles.activeSegment : ""}
                onClick={() => onAuthModeChange("register")}
                type="button"
              >
                Sign up
              </button>
            </div>
            <form className={styles.authForm} onSubmit={onAuth}>
              <label>
                Username
                <input
                  value={authForm.username}
                  onChange={(event) =>
                    onAuthFormChange({
                      ...authForm,
                      username: event.target.value,
                    })
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
                      onAuthFormChange({
                        ...authForm,
                        displayName: event.target.value,
                      })
                    }
                    placeholder="Alice"
                    maxLength={128}
                    required
                  />
                </label>
              ) : null}
              <label>
                Password
                <span className={styles.passwordField}>
                  <input
                    type={showAuthPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(event) =>
                      onAuthFormChange({
                        ...authForm,
                        password: event.target.value,
                      })
                    }
                    minLength={authMode === "register" ? 8 : 1}
                    maxLength={128}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => onShowAuthPasswordChange(!showAuthPassword)}
                    title={showAuthPassword ? "Hide password" : "Show password"}
                  >
                    {showAuthPassword ? (
                      <EyeOff size={18} aria-hidden />
                    ) : (
                      <Eye size={18} aria-hidden />
                    )}
                  </button>
                </span>
              </label>
              <button className={styles.primaryButton} disabled={busy}>
                {authMode === "register" ? (
                  <UserPlus size={18} aria-hidden />
                ) : (
                  <KeyRound size={18} aria-hidden />
                )}
                {authMode === "register"
                  ? "Generate keys and register"
                  : "Sign in securely"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
