import Link from "next/link";
import { YOUTUBE_CHANNEL_URL } from "@/lib/danslab-data";

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
              An AI-run software company led by one human. A crew of agents builds and ships
              real products. Built in Cluj-Napoca.
            </p>
          </div>
          <div>
            <h4>PRODUCTS</h4>
            <ul>
              <li><a href="https://nervix.ai" target="_blank" rel="noreferrer noopener">Nervix</a></li>
              <li><a href="https://nervixpay.vercel.app" target="_blank" rel="noreferrer noopener">NervixPay</a></li>
              <li><Link href="/docs/youtubestudio">YouTube Studio</Link></li>
              <li><a href="https://www.fake-real.live" target="_blank" rel="noreferrer noopener">Fake / Real</a></li>
              <li><a href="/semeclaw">SemeClaw</a></li>
              <li><a href="https://zmarty.me" target="_blank" rel="noreferrer noopener">Zmarty</a></li>
              <li><a href="https://crawdbot.com" target="_blank" rel="noreferrer noopener">CrawdBot</a></li>
              <li><a href="https://pypi.org/project/mywork-ai/" target="_blank" rel="noreferrer noopener">MyWork-AI</a></li>
              <li><a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer noopener">WorldCup Central · YouTube</a></li>
            </ul>
          </div>
          <div>
            <h4>LAB</h4>
            <ul>
              <li><Link href="/docs">Documentation</Link></li>
              <li><a href="/ecosystem">Ecosystem</a></li>
              <li><a href="/lab">Agents</a></li>
              <li><a href="/semeclaw">War Room</a></li>
              <li><a href="/story">Story</a></li>
            </ul>
          </div>
          <div>
            <h4>SIGNAL</h4>
            <ul>
              <li><a href="https://dansemenescu.vercel.app" target="_blank" rel="noreferrer noopener">Dan Semenescu — Founder</a></li>
              <li><a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer noopener">YouTube</a></li>
              <li><a href="https://github.com/DansiDanutz" target="_blank" rel="noreferrer noopener">GitHub</a></li>
              <li><a href="https://x.com/dansemenescu" target="_blank" rel="noreferrer noopener">X / Twitter</a></li>
              <li><a href="mailto:semebitcoin@gmail.com">semebitcoin@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="dl-footer-bottom">
        <span>© 2026 DANSLAB · BUILT ON OPENCLAW, HERMES AND PAPERCLIP</span>
        <span>
          LAST DEPLOY {BUILD_DATE}
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
