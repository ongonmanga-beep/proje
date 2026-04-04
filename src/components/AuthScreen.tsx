import styles from "./AuthScreen.module.css";

export type AuthMode = "login" | "create";

interface Props {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
  onSubmit: (data: Record<string, string>) => void;
}

export default function AuthScreen({ mode, onSwitch, onSubmit }: Props) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Portföy Takip</h1>
      <div className={styles.card}>
        <h3>{mode === "login" ? "Giriş" : "Kayıt"}</h3>
        {mode === "create" && (
          <input className={styles.input} id="auth-name" placeholder="İsim" />
        )}
        <input className={styles.input} id="auth-email" type="email" placeholder="E-posta" />
        <input className={styles.input} id="auth-password" type="password" placeholder="Şifre" />
        <button
          className={styles.btn}
          onClick={handleSubmit(mode, onSubmit)}
        >
          {mode === "login" ? "Giriş Yap" : "Oluştur"}
        </button>
        <button className={styles.link} onClick={() => onSwitch(mode === "login" ? "create" : "login")}>
          {mode === "login" ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
        </button>
      </div>
    </main>
  );
}

function handleSubmit(mode: AuthMode, onSubmit: (data: Record<string, string>) => void) {
  return () => {
    const name = (document.getElementById("auth-name") as HTMLInputElement)?.value ?? "";
    const email = (document.getElementById("auth-email") as HTMLInputElement)?.value ?? "";
    const password = (document.getElementById("auth-password") as HTMLInputElement)?.value ?? "";

    if (!email || !password) return;
    const data: Record<string, string> = { email, passwordHash: btoa(password) };
    if (mode === "create") data.name = name;
    onSubmit(data);
  };
}
