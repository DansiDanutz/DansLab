import { useState } from "react";
import { tasksClient } from "@/lib/tasks/store";

const ASKED = "danslab-asked-task";
/** The task a link asked for before signing in, once. */
export function takeAskedTask(): string | null {
  const asked = sessionStorage.getItem(ASKED);
  sessionStorage.removeItem(ASKED);
  return asked;
}

const failedBefore = (): boolean => {
  const said = new URLSearchParams(window.location.search + window.location.hash.replace("#", "&"));
  return said.has("error");
};

export function NoAccess({ email }: { email?: string }) {
  return (
    <section className="tk-signin">
      <h1>Taskuri</h1>
      <p role="alert">{email ? `Contul ${email} nu are acces aici.` : "Contul acesta nu are acces aici."}</p>
      <div className="tk-signin-ways">
        <button type="button" onClick={() => void tasksClient().auth.signOut({ scope: "local" })}>Intră cu alt cont</button>
      </div>
    </section>
  );
}

export function SignIn() {
  const [error, setError] = useState(() => (failedBefore() ? "Intrarea în cont nu a reușit. Încearcă din nou." : ""));
  const start = async (provider: "google" | "github") => {
    const asked = new URLSearchParams(window.location.search).get("t");
    if (asked) sessionStorage.setItem(ASKED, asked);
    const { error: refused } = await tasksClient().auth.signInWithOAuth({ provider, options: {
      redirectTo: `${window.location.origin}/tasks`,
      // Otherwise Google goes straight back in with the account it already knows.
      ...(provider === "google" && { queryParams: { prompt: "select_account" } }),
    } });
    if (refused) setError("Intrarea în cont nu a pornit. Încearcă din nou.");
  };
  return (
    <section className="tk-signin">
      <h1>Taskuri</h1>
      <p>Pagina e privată. Intră cu contul tău ca să vezi taskurile, videourile și skillurile.</p>
      <div className="tk-signin-ways">
        <button type="button" onClick={() => void start("google")}>Intră cu Google</button>
        <button type="button" onClick={() => void start("github")}>Intră cu GitHub</button>
      </div>
      {error && <p className="tk-error" role="alert">{error}</p>}
    </section>
  );
}
