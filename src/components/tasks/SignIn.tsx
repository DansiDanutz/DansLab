import { useState } from "react";
import { tasksClient } from "@/lib/tasks/store";

const failedBefore = (): boolean => {
  const said = new URLSearchParams(window.location.search + window.location.hash.replace("#", "&"));
  return said.has("error");
};

export function SignIn() {
  const [error, setError] = useState(() => (failedBefore() ? "Intrarea în cont nu a reușit. Încearcă din nou." : ""));
  const start = async (provider: "google" | "github") => {
    const { error: refused } = await tasksClient().auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/tasks` } });
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
