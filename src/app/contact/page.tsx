"use client";

import { useEffect, useState } from "react";
import { SectionLabel } from "@/components/danslab/atoms";

// ===== CONFIG =====
const EMAIL = "semebitcoin@gmail.com";
const WHATSAPP = "40744602272"; // international format, digits only
// ==================

type Intent = "partnership" | "press" | "investor" | "consulting" | "other";

const INTENTS: { id: Intent; label: string; glyph: string }[] = [
  { id: "partnership", label: "Partnership", glyph: "⎔" },
  { id: "press",       label: "Press",       glyph: "✎" },
  { id: "investor",    label: "Investor",    glyph: "◆" },
  { id: "consulting",  label: "Consulting",  glyph: "⚒" },
  { id: "other",       label: "Other",       glyph: "✦" },
];

const TEMPLATES: Record<Intent, string> = {
  partnership: "Hi Dan,\n\nWe'd like to explore a partnership with DansLab.\n\nWhat we do:\n\nWhat we're proposing:\n  (integration · co-marketing · technical · other)\n\nIdeal timeline:\n",
  press:       "Hi Dan,\n\nReporting on [topic]. Looking for one of:\n  - background on DansLab\n  - quote / interview\n  - screenshots / b-roll\n\nPublication / outlet:\nDeadline:\n",
  investor:    "Hi Dan,\n\nWe're interested in learning more about DansLab.\n\nFund / firm:\nStage focus:\nTypical check size:\nWhat would be useful as a next step:\n  (intro call · data room · product walkthrough)\n",
  consulting:  "Hi Dan,\n\nWe'd like to hire DansLab for a project.\n\nScope:\n\nBudget range:\n\nIdeal timeline:\n",
  other:       "Hi Dan,\n\n",
};

const SUBJECTS: Record<Intent, string> = {
  partnership: "Partnership inquiry",
  press:       "Press inquiry",
  investor:    "Investor inquiry",
  consulting:  "Consulting / project inquiry",
  other:       "General inquiry",
};

export default function ContactPage() {
  const [intent, setIntent] = useState<Intent>("partnership");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState(TEMPLATES.partnership);
  const [messageEdited, setMessageEdited] = useState(false);

  // Update template when intent changes — unless user has edited the message
  useEffect(() => {
    if (!messageEdited) setMessage(TEMPLATES[intent]);
  }, [intent, messageEdited]);

  const subject = `DansLab · ${SUBJECTS[intent]}${company ? ` · ${company}` : ""}`;
  const body = `${message}\n\n---\nName: ${name || "—"}\nCompany: ${company || "—"}\nEmail: ${email || "—"}\nWhatsApp: ${whatsapp || "—"}\nIntent: ${SUBJECTS[intent]}\nSent from: https://danslab.vercel.app/contact`;

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`*${subject}*\n\n${body}`)}`;

  return (
    <div className="contact-page">
      <header className="contact-hero">
        <SectionLabel n={6} title="CONTACT // DAN @ DANSLAB" />
        <h1>
          One <em>founder</em>, one <em>fleet</em>,
          <br /> one inbox that answers within 24h.
        </h1>
        <p>
          Pick what you&apos;re here for, drop a structured note, and pick your
          delivery channel. Email lands in <code>{EMAIL}</code>. WhatsApp lands on
          Dan&apos;s phone. Both pre-fill your name, company, and reply address so
          the response can come back fast.
        </p>
      </header>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-field">
            <label className="contact-label">
              What&apos;s this about?
            </label>
            <div className="contact-intent-grid">
              {INTENTS.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className={`contact-intent ${intent === it.id ? "is-active" : ""}`}
                  onClick={() => { setIntent(it.id); setMessageEdited(false); }}
                >
                  <span className="contact-intent-glyph">{it.glyph}</span>
                  {it.label}
                </button>
              ))}
            </div>
          </div>

          <div className="contact-input-row">
            <div className="contact-field">
              <label className="contact-label" htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                className="contact-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="c-company">Company / outlet</label>
              <input
                id="c-company"
                className="contact-input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="contact-input-row">
            <div className="contact-field">
              <label className="contact-label" htmlFor="c-email">
                Email <span className="contact-label-hint">(for reply)</span>
              </label>
              <input
                id="c-email"
                className="contact-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="c-whatsapp">
                WhatsApp <span className="contact-label-hint">(country code)</span>
              </label>
              <input
                id="c-whatsapp"
                className="contact-input"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+40 7XX XXX XXX"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="contact-field">
            <label className="contact-label" htmlFor="c-message">
              Message
              <span className="contact-label-hint">— template pre-filled, edit freely</span>
            </label>
            <textarea
              id="c-message"
              className="contact-textarea"
              value={message}
              onChange={(e) => { setMessage(e.target.value); setMessageEdited(true); }}
              rows={9}
            />
          </div>

          <div className="contact-actions">
            <a
              href={mailtoHref}
              className="contact-send contact-send-email"
            >
              <span style={{ fontSize: 16 }}>✉</span>
              Send via Email
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="contact-send contact-send-whatsapp"
            >
              <span style={{ fontSize: 16 }}>◉</span>
              Send via WhatsApp
            </a>
          </div>

          <p className="contact-disclaimer">
            BOTH BUTTONS OPEN YOUR OWN EMAIL CLIENT / WHATSAPP WITH EVERYTHING
            PRE-FILLED. NOTHING IS STORED ON THIS SITE. NO TRACKING, NO FORM
            BACKEND, NO MAILING LIST.
          </p>
        </form>

        <aside className="contact-sidebar">
          <div className="contact-sidebar-row">
            <h4>DIRECT CHANNELS</h4>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer noopener">
              +40 744 602 272 · WhatsApp
            </a>
          </div>

          <div className="contact-sidebar-divider" />

          <div className="contact-sidebar-row">
            <h4>SOCIALS</h4>
            <a href="https://github.com/DansiDanutz" target="_blank" rel="noreferrer noopener">
              github.com/DansiDanutz
            </a>
            <a href="https://x.com/dansemenescu" target="_blank" rel="noreferrer noopener">
              x.com / @dansemenescu
            </a>
            <a href="https://dansemenescu.vercel.app" target="_blank" rel="noreferrer noopener">
              dansemenescu.vercel.app
            </a>
          </div>

          <div className="contact-sidebar-divider" />

          <div className="contact-sidebar-row">
            <h4>LIVE PRODUCTS</h4>
            <a href="https://nervix.ai" target="_blank" rel="noreferrer noopener">nervix.ai</a>
            <a href="https://crawdbot.com" target="_blank" rel="noreferrer noopener">crawdbot.com</a>
            <a href="https://zmarty.me" target="_blank" rel="noreferrer noopener">zmarty.me</a>
            <a href="https://pypi.org/project/mywork-ai/" target="_blank" rel="noreferrer noopener">mywork-ai · PyPI</a>
            <a href="https://semeclaw.fly.dev" target="_blank" rel="noreferrer noopener">semeclaw.fly.dev</a>
          </div>

          <div className="contact-sidebar-divider" />

          <div className="contact-sidebar-row">
            <h4>LOCATION</h4>
            <span>Cluj-Napoca, Romania</span>
            <span>UTC+2 · async-friendly</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
