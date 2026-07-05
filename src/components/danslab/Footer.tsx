const BUILD_DATE = new Date().toISOString().slice(0, 10);
const COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

export function Footer() {
  return (
    <footer className="dl-footer">
      <div className="dl-wrap">
        <div className="dl-footer-inner">
          <div>
            <div className="dl-footer-mark">
              Dans<span style={{ color: "var(--dl-accent-hot)" }}>Lab</span>
            </div>
            <p className="dl-footer-line">
              A human-led autonomous AI lab. Dan orchestrates 30+ agents across 5 products.
              Built in Cluj-Napoca · Frankfurt · US-East.
            </p>
          </div>
          <div>
            <h4>PRODUCTS</h4>
            <ul>
              <li><a href="https://nervix.ai" target="_blank" rel="noreferrer noopener">nervix.ai</a></li>
              <li><a href="https://crawdbot.com" target="_blank" rel="noreferrer noopener">crawdbot.com</a></li>
              <li><a href="#">MyWork-AI</a></li>
              <li><a href="https://zmarty.vercel.app" target="_blank" rel="noreferrer noopener">zmarty.me</a></li>
              <li><a href="/semeclaw">SemeClaw</a></li>
            </ul>
          </div>
          <div>
            <h4>LAB</h4>
            <ul>
              <li><a href="/ecosystem">Ecosystem</a></li>
              <li><a href="/lab">Agents</a></li>
              <li><a href="/semeclaw">War Room</a></li>
              <li><a href="/story">Story</a></li>
            </ul>
          </div>
          <div>
            <h4>SIGNAL</h4>
            <ul>
              <li><a href="https://github.com/DansiDanutz" target="_blank" rel="noreferrer noopener">GitHub</a></li>
              <li><a href="https://x.com/dansemenescu" target="_blank" rel="noreferrer noopener">X / Twitter</a></li>
              <li><a href="https://dansemenescu.vercel.app" target="_blank" rel="noreferrer noopener">dansemenescu.app</a></li>
              <li><a href="mailto:semebitcoin@gmail.com">semebitcoin@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="dl-footer-bottom">
        <span>© 2026 DANSLAB · POWERED BY OPENCLAW v2026.2.14</span>
        <span>
          UPTIME 99.94% / 30D · LAST DEPLOY {BUILD_DATE}
          {COMMIT_SHA && (
            <>
              {" · "}
              <a
                href={`https://github.com/DansiDanutz/DansLab/commit/${COMMIT_SHA}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "inherit" }}
              >
                {COMMIT_SHA}
              </a>
            </>
          )}
        </span>
      </div>
    </footer>
  );
}
