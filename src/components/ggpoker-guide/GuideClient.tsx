"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check,
  CheckCheck, ChevronDown, CircleCheck, Clock3, Copy, ExternalLink,
  FileText, GitBranch, GraduationCap, Info, KeyRound, Layers3,
  List, MessageSquare, Printer, Search, ShieldCheck, ShoppingBag,
  Sparkles, TriangleAlert, Users, X,
} from "lucide-react";
import type { GuideChapter } from "@/lib/ggpoker-guide/types";
import "./guide.css";

type Section = GuideChapter["sections"][number];
type Route = { chapter: string; section: string; revision: number };
const STORAGE_KEY = "danslab.ggpoker-guide.read.v1";
const GROUPS = [
  ["inceput", "Începe aici"], ["operare", "Administrare zilnică"],
  ["jocuri", "Mese și turnee"], ["marketplace", "Marketplace"],
  ["comunitate", "Comunitate și conținut"], ["siguranta", "Siguranță și control"],
  ["practica", "Învață prin practică"],
] as const;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ro").trim();
}

function groupKey(value: string) {
  const key = normalize(value);
  const aliases: Record<string, string> = { start: "inceput", introducere: "inceput", administrare: "operare", comunitate: "comunitate", securitate: "siguranta", exercitii: "practica" };
  return aliases[key] || key;
}

function chapterHref(chapter: string, section?: string) {
  return `#${encodeURIComponent(chapter)}${section ? `/${encodeURIComponent(section)}` : ""}`;
}

function focusArticle(chapter: string, section: string) {
  const target = document.getElementById(section ? `${chapter}/${section}` : `gg-chapter-${chapter}`);
  if (!target) return;
  target.scrollIntoView({ block: "start", behavior: "auto" });
  (target.querySelector("h1, h2") as HTMLElement | null)?.focus({ preventScroll: true });
}

function CopyBlock({ label, text, print = false }: { label: string; text: string; print?: boolean }) {
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  async function copy() {
    try {
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(text);
      } catch {
        const focused = document.activeElement as HTMLElement | null;
        const field = document.createElement("textarea");
        field.value = text;
        field.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(field);
        let copied = false;
        try { field.select(); copied = document.execCommand("copy"); }
        finally { field.remove(); focused?.focus({ preventScroll: true }); }
        if (!copied) throw new Error("Copy unavailable");
      }
      setNotice("Copiat");
    } catch { setNotice("Selectează textul pentru copiere manuală."); }
  }
  return <figure className="gg-code">
    <figcaption><span>{label}</span>{!print && <button type="button" onClick={() => void copy()} aria-label={`Copiază: ${label}`}><Copy size={14} aria-hidden="true" />Copiază</button>}</figcaption>
    <pre><code>{text}</code></pre>
    {!print && <span className="gg-copy-notice" role="status">{notice}</span>}
  </figure>;
}

function SectionBlock({ section, chapter, print = false }: { section: Section; chapter: string; print?: boolean }) {
  const Heading = print ? "h3" : "h2";
  const StepHeading = print ? "h4" : "h3";
  const CalloutIcon = section.callout?.tone === "warning" ? TriangleAlert : section.callout?.tone === "success" ? CircleCheck : Info;
  return <section className="gg-section" id={`${print ? "print-" : ""}${chapter}/${section.id}`} aria-labelledby={`${print ? "print-" : ""}${chapter}-${section.id}-title`}>
    <Heading tabIndex={print ? undefined : -1} id={`${print ? "print-" : ""}${chapter}-${section.id}-title`}>{section.title}</Heading>
    {section.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
    {section.steps && <ol className="gg-steps">{section.steps.map((step, i) => <li key={i}><span className="gg-step-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><StepHeading>{step.title}</StepHeading><p>{step.text}</p></div></li>)}</ol>}
    {section.bullets && <ul className="gg-bullets">{section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>}
    {section.table && <div className="gg-table-wrap" tabIndex={print ? undefined : 0} role="region" aria-label={`Tabel: ${section.title}`}><table><caption className="gg-sr-only">{section.title}</caption><thead><tr>{section.table.headers.map((header, i) => <th scope="col" key={i}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
    {section.callout && <aside className={`gg-callout gg-callout-${section.callout.tone}`} role="note"><CalloutIcon size={20} aria-hidden="true" /><div><StepHeading>{section.callout.title}</StepHeading><p>{section.callout.text}</p></div></aside>}
    {section.code && <CopyBlock label={section.code.label} text={section.code.text} print={print} />}
  </section>;
}

const FLOW = [
  { title: "Produs", label: "O ofertă publicată", Icon: ShoppingBag, text: "Produsul Disponibil poate primi solicitări și poate fi selectat la acordarea accesului. În pregătire colectează interes, fără acces activ nou.", result: "O ofertă vizibilă în catalog. Nicio plată și niciun acces acordat." },
  { title: "Solicitare", label: "Clientul își exprimă interesul", Icon: MessageSquare, text: "Un utilizator autentificat trimite cererea, cu un mesaj opțional. Aceasta apare În așteptare în admin și În evaluare în contul său.", result: "O cerere de analizat. Nu este o comandă achitată." },
  { title: "Aprobare", label: "Răspunzi și salvezi decizia", Icon: CircleCheck, text: "Administratorul scrie Răspuns pentru utilizator și apasă Aprobă cererea. Clientul vede răspunsul în Solicitările mele.", result: "O cerere aprobată. Accesul rămâne o operațiune separată." },
  { title: "Acces", label: "Înregistrezi dreptul și termenul", Icon: KeyRound, text: "Acordă acces înregistrează utilizatorul, produsul și opțional expirarea. Furnizarea serviciului și conectarea funcțiilor la acest drept se gestionează separat.", result: "O evidență de acces. Nicio încasare sau activare automată de funcții." },
];

function EducationalTools() {
  const [value, setValue] = useState("10");
  const [stage, setStage] = useState(0);
  const amount = Number(value.replace(",", "."));
  const valid = /^\d+(?:[.,]\d{0,2})?$/.test(value.trim()) && Number.isFinite(amount) && amount >= 0 && amount <= 1000000;
  const format = (number: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(number);
  const selected = FLOW[stage];
  return <section className="gg-tools" aria-labelledby="gg-tools-title">
    <div className="gg-tools-heading"><span className="gg-eyebrow"><GraduationCap size={15} aria-hidden="true" />EXERSEAZĂ ÎN SIGURANȚĂ</span><h2 id="gg-tools-title">Înțelege înainte să modifici.</h2><p>Simulări educative, doar în această pagină. Nu se conectează la admin, nu schimbă solduri și nu procesează plăți.</p></div>
    <div className="gg-converter"><div className="gg-tool-title"><span>01</span><h3>Unități afișate și valori interne</h3></div><label htmlFor="gg-demo-amount">Valoare demonstrativă</label><div className="gg-amount-field"><input id="gg-demo-amount" type="text" inputMode="decimal" value={value} maxLength={15} onChange={(event) => setValue(event.target.value)} aria-describedby="gg-demo-amount-hint" aria-invalid={!valid} /><span>unități</span></div><p id="gg-demo-amount-hint" className="gg-small">O valoare pozitivă sau zero, cu maximum două zecimale.</p><div className="gg-conversions" aria-live="polite"><div><span>În evidența internă a jocului</span><strong>{valid ? format(Math.round(amount * 100)) : "—"}</strong><small>cenți interni pentru {valid ? format(amount) : "—"} unități afișate</small></div><div><span>În formularul Marketplace</span><strong>{valid ? format(amount) : "—"}<em>EUR</em></strong><small>{valid && amount === 0 ? "pentru zero, selectează tarifarea Gratuit" : "introduci suma normală în Preț afișat"}</small></div></div>{!valid && <p className="gg-input-error">Introdu o sumă între 0 și un milion, cu maximum două zecimale.</p>}<p className="gg-small">Exemplul compară două convenții de introducere a datelor. Jetoanele jocului sunt virtuale; acest calculator nu le convertește în bani.</p></div>
    <div className="gg-flow"><div className="gg-tool-title"><span>02</span><h3>Patru etape, patru rezultate</h3></div><p className="gg-small">Selectează o etapă pentru a vedea exact ce se întâmplă.</p><div className="gg-flow-stages" role="group" aria-label="Etapele simulării Marketplace">{FLOW.map(({ title, Icon }, index) => <button key={title} type="button" aria-pressed={stage === index} className={stage === index ? "is-active" : ""} onClick={() => setStage(index)}><span className="gg-flow-index">0{index + 1}</span><Icon size={22} aria-hidden="true" /><span>{title}</span></button>)}</div><div className="gg-flow-detail" aria-live="polite"><span className="gg-eyebrow">ETAPA {stage + 1} DIN 4 · SIMULARE</span><h4>{selected.label}</h4><p>{selected.text}</p><div><Check size={16} aria-hidden="true" /><span>{selected.result}</span></div></div></div>
  </section>;
}

export default function GuideClient({ chapters }: { chapters: GuideChapter[] }) {
  const first = chapters.find((chapter) => chapter.id === "start") || chapters[0];
  const [route, setRoute] = useState<Route>({ chapter: first?.id || "start", section: "", revision: 0 });
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const chapter = chapters.find((item) => item.id === route.chapter) || first;
  const chapterIndex = chapters.findIndex((item) => item.id === chapter?.id);
  const chapterRead = read.includes(chapter?.id || "");

  useEffect(() => {
    function syncRoute() {
      let parts: string[] = [];
      try { parts = window.location.hash.slice(1).split("/").map(decodeURIComponent); } catch { /* A malformed URL falls back to the introduction. */ }
      const found = chapters.find((item) => item.id === parts[0]) || first;
      if (!found) return;
      const section = found.sections.some((item) => item.id === parts[1]) ? parts[1] : "";
      setRoute((previous) => ({ chapter: found.id, section, revision: previous.revision + (window.location.hash ? 1 : 0) }));
      setMenuOpen(false);
    }
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, [chapters, first]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setRead([...new Set(saved.filter((id): id is string => typeof id === "string" && chapters.some((item) => item.id === id)))]);
    } catch { setStorageAvailable(false); }
  }, [chapters]);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setMenuOpen(true);
        window.requestAnimationFrame(() => { searchRef.current?.focus(); searchRef.current?.select(); });
      } else if (event.key === "Escape" && (document.activeElement === searchRef.current || menuOpen)) {
        if (query) setQuery(""); else { setMenuOpen(false); menuRef.current?.focus(); }
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [query, menuOpen]);

  useEffect(() => {
    setActiveSection(route.section || chapter?.sections[0]?.id || "");
    if (!route.revision) return;
    const frame = window.requestAnimationFrame(() => focusArticle(route.chapter, route.section));
    return () => window.cancelAnimationFrame(frame);
  }, [route, chapter]);

  useEffect(() => {
    if (!articleRef.current || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id.split("/")[1] || "");
    }, { rootMargin: "-100px 0px -60% 0px", threshold: 0 });
    articleRef.current.querySelectorAll(".gg-section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapter]);

  const groups = useMemo(() => {
    const known = GROUPS.map(([id, label]) => ({ id, label, items: chapters.filter((item) => groupKey(item.group) === id) })).filter((item) => item.items.length);
    const other = chapters.filter((item) => !GROUPS.some(([id]) => id === groupKey(item.group)));
    return other.length ? [...known, { id: "altele", label: "Mai departe", items: other }] : known;
  }, [chapters]);

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const matches = (text: string) => tokens.every((token) => normalize(text).includes(token));
    return chapters.flatMap<{ chapter: GuideChapter; section?: Section }>((item) => {
      if (matches(`${item.title} ${item.summary}`)) return [{ chapter: item }];
      const sections = item.sections.filter((section) => matches(JSON.stringify(section)));
      if (sections.length) return sections.map((section) => ({ chapter: item, section }));
      return [];
    });
  }, [chapters, query]);

  function navigate(chapterId: string, sectionId?: string) {
    setQuery(""); setMenuOpen(false);
    if (window.location.hash === chapterHref(chapterId, sectionId)) window.requestAnimationFrame(() => focusArticle(chapterId, sectionId || ""));
  }

  function toggleRead() {
    if (!chapter) return;
    const updated = chapterRead ? read.filter((id) => id !== chapter.id) : [...read, chapter.id];
    setRead(updated);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }

  if (!chapter) return <div className="gg-guide" lang="ro"><p>Ghidul nu conține încă un capitol.</p></div>;

  const intro = chapter.id === "start";
  const nextStart = chapters.find((item) => item.id === "dashboard") || chapters.find((item) => item.id === "platform") || chapters.find((item) => item.id !== "start");
  const quickPaths = [
    { chapter: nextStart, Icon: BookOpen, title: "Sunt la început", text: "Înțelege adminul, pas cu pas.", label: "PRIMII PAȘI" },
    { chapter: chapters.find((item) => item.id === "users"), Icon: Users, title: "Administrez comunitatea", text: "Conturi, roluri și intervenții.", label: "OPERAȚIUNI" },
    { chapter: chapters.find((item) => item.id === "marketplace"), Icon: ShoppingBag, title: "Pregătesc o ofertă", text: "De la catalog la acces.", label: "MARKETPLACE" },
  ].filter((item) => item.chapter);
  const groupLabel = groups.find((group) => group.items.some((item) => item.id === chapter.id))?.label || "Ghid de utilizare";
  const previous = chapters[chapterIndex - 1];
  const next = chapters[chapterIndex + 1];

  return <div className="gg-guide" lang="ro">
    <a className="gg-skip" href={`#gg-chapter-${chapter.id}`} onClick={(event) => { event.preventDefault(); focusArticle(chapter.id, ""); }}>Sari la capitol</a>
    <div className="gg-screen">
      <header className="gg-masthead"><a className="gg-guide-brand" href={chapterHref(first.id)} onClick={() => navigate(first.id)}><span className="gg-brand-mark" aria-hidden="true">GG</span><span>DanGG <b>Ghidul administratorului</b></span></a><div className="gg-masthead-actions"><span className="gg-edition"><span />GHID PUBLIC · RO</span><button type="button" className="gg-icon-action" onClick={() => window.print()} aria-label="Tipărește întregul ghid" title="Tipărește întregul ghid"><Printer size={18} aria-hidden="true" /></button><a className="gg-admin-link" href="http://127.0.0.1:5198/admin" target="_blank" rel="noopener noreferrer" title="Necesită conexiunea privată configurată pe acest computer">Deschide adminul<ArrowUpRight size={16} aria-hidden="true" /></a></div></header>
      <div className="gg-layout">
        <aside className="gg-sidebar" aria-label="Navigarea ghidului">
          <button ref={menuRef} type="button" className="gg-mobile-toggle" aria-expanded={menuOpen} aria-controls="gg-sidebar-panel" onClick={() => setMenuOpen((open) => !open)}><List size={18} aria-hidden="true" /><span>Cuprins <small>{chapterIndex + 1} / {chapters.length}</small></span><ChevronDown size={16} className={menuOpen ? "is-open" : ""} aria-hidden="true" /></button>
          <div id="gg-sidebar-panel" className={`gg-sidebar-panel ${menuOpen ? "is-open" : ""}`}>
            <div className="gg-search"><Search size={16} aria-hidden="true" /><label className="gg-sr-only" htmlFor="gg-search-input">Caută în ghid</label><input ref={searchRef} id="gg-search-input" type="search" placeholder="Caută în ghid…" value={query} onChange={(event) => setQuery(event.target.value)} aria-keyshortcuts="Control+k Meta+k" autoComplete="off" />{query ? <button type="button" onClick={() => { setQuery(""); searchRef.current?.focus(); }} aria-label="Șterge căutarea"><X size={14} aria-hidden="true" /></button> : <kbd title="Ctrl sau Command + K">⌘ K</kbd>}</div>
            {query.trim() ? <div className="gg-search-results"><p role="status">{results.length} {results.length === 1 ? "rezultat" : "rezultate"}</p>{results.slice(0, 30).map((result) => <a key={`${result.chapter.id}/${result.section?.id || ""}`} href={chapterHref(result.chapter.id, result.section?.id)} onClick={() => navigate(result.chapter.id, result.section?.id)}><small>{result.chapter.title}</small><strong>{result.section?.title || result.chapter.title}</strong><ArrowUpRight size={14} aria-hidden="true" /></a>)}{!results.length && <div className="gg-search-empty"><Search size={22} aria-hidden="true" /><strong>Niciun rezultat încă.</strong><span>Încearcă „acces”, „sold” sau „turnee”. Căutarea funcționează și fără diacritice.</span></div>}{results.length > 30 && <p>Primele 30 de rezultate. Adaugă un cuvânt pentru a restrânge căutarea.</p>}</div> : <nav aria-label="Capitole">{groups.map((group) => <div className="gg-nav-group" key={group.id}><h2>{group.label}</h2><ul>{group.items.map((item) => <li key={item.id}><a href={chapterHref(item.id)} className={chapter.id === item.id ? "is-current" : ""} aria-current={chapter.id === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><span className="gg-nav-number">{String(chapters.indexOf(item) + 1).padStart(2, "0")}</span><span>{item.title}</span>{read.includes(item.id) && <span className="gg-nav-read"><Check size={13} aria-hidden="true" /><span className="gg-sr-only">Citit</span></span>}</a></li>)}</ul></div>)}</nav>}
            <div className="gg-progress"><div><BookOpen size={14} aria-hidden="true" /><span>Progresul tău</span><strong>{read.length}/{chapters.length}</strong></div><progress value={read.length} max={chapters.length} aria-label={`${read.length} din ${chapters.length} capitole citite`} /><p>{storageAvailable ? "Salvat doar în acest browser." : "Stocarea este blocată. Progres păstrat doar până la reîncărcare."}</p></div>
            <div className="gg-private-hint"><ShieldCheck size={15} aria-hidden="true" /><span>Adminul se deschide pe computerul cu conexiunea privată activă.</span></div>
          </div>
        </aside>

        <article ref={articleRef} className="gg-article" id={`gg-chapter-${chapter.id}`}>
          <div className="gg-breadcrumb"><span>Manual DanGG</span><span>/</span><span>{groupLabel}</span></div>
          {intro ? <>
            <header className="gg-hero"><div className="gg-hero-art" aria-hidden="true"><span>♠</span><i /><b>GG</b></div><span className="gg-eyebrow"><span className="gg-live-dot" />MANUALUL ADMINISTRATORULUI</span><h1 tabIndex={-1}>DanGG, explicat.<br /><em>De la primul clic.</em></h1><p>Tu construiești comunitatea.<br />Aici înveți cum să ai grijă de tot ce o pune în mișcare.</p><div className="gg-hero-meta"><span><Layers3 size={14} aria-hidden="true" />{chapters.length} capitole</span><span><GraduationCap size={15} aria-hidden="true" />Exerciții practice</span><span><ShieldCheck size={14} aria-hidden="true" />Fără acțiuni în cont</span></div>{nextStart && <a className="gg-primary" href={chapterHref(nextStart.id)} onClick={() => navigate(nextStart.id)}>Începe cu primul pas<ArrowRight size={17} aria-hidden="true" /></a>}<a className="gg-hero-down" href={chapterHref(chapter.id, chapter.sections[0]?.id)} onClick={() => navigate(chapter.id, chapter.sections[0]?.id)} aria-label="Citește introducerea"><ArrowDown size={18} aria-hidden="true" /></a></header>
            <div className="gg-quick-paths">{quickPaths.map(({ chapter: target, Icon, title, text, label }) => target && <a key={target.id} href={chapterHref(target.id)} onClick={() => navigate(target.id)}><div><Icon size={19} aria-hidden="true" /><ArrowUpRight size={15} aria-hidden="true" /></div><span>{label}</span><h2>{title}</h2><p>{text}</p></a>)}</div>
          </> : <header className="gg-chapter-header"><div className="gg-chapter-kicker"><span className="gg-eyebrow">{chapter.kicker}</span><span className="gg-chapter-number">{String(chapterIndex + 1).padStart(2, "0")}<small> / {String(chapters.length).padStart(2, "0")}</small></span></div><h1 tabIndex={-1}>{chapter.title}</h1><p>{chapter.summary}</p><div className="gg-chapter-meta"><span><Clock3 size={15} aria-hidden="true" />{chapter.minutes} min de lectură</span><span><FileText size={15} aria-hidden="true" />{chapter.sections.length} secțiuni</span>{chapterRead && <span className="gg-meta-read"><CheckCheck size={16} aria-hidden="true" />Citit</span>}</div></header>}
          {chapter.id === "exercitii" && <EducationalTools />}
          <div className="gg-content">{chapter.sections.map((section) => <SectionBlock key={section.id} section={section} chapter={chapter.id} />)}</div>
          {chapter.sources?.length > 0 && <details className="gg-sources" key={`sources-${chapter.id}`}><summary><GitBranch size={17} aria-hidden="true" /><span>Surse și versiunea documentată</span><small>{chapter.sources.length}</small><ChevronDown size={16} aria-hidden="true" /></summary><p>Verifică implementarea și explicațiile în sursele capitolului. Linkurile se deschid într-o filă nouă.</p><ul>{chapter.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ExternalLink size={14} aria-hidden="true" /></a></li>)}</ul></details>}
          <div className="gg-finish"><div><span className="gg-eyebrow">UN PAS ÎNAINTE</span><h2>{chapterRead ? "Capitol parcurs." : "Gata cu acest capitol?"}</h2><p>Marchează-l pentru a-ți păstra locul în ghid.</p></div><button type="button" className={`gg-read-button ${chapterRead ? "is-read" : ""}`} aria-pressed={chapterRead} onClick={toggleRead}>{chapterRead ? <CheckCheck size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}{chapterRead ? "Capitol citit" : "Marchează ca citit"}</button></div>
          <nav className="gg-pagination" aria-label="Capitolul anterior și următor">{previous ? <a href={chapterHref(previous.id)} onClick={() => navigate(previous.id)}><ArrowLeft size={18} aria-hidden="true" /><span><small>CAPITOLUL ANTERIOR</small><strong>{previous.title}</strong></span></a> : <span />}{next ? <a className="gg-next" href={chapterHref(next.id)} onClick={() => navigate(next.id)}><span><small>URMĂTORUL CAPITOL</small><strong>{next.title}</strong></span><ArrowRight size={18} aria-hidden="true" /></a> : <a className="gg-next" href={chapterHref(first.id)} onClick={() => navigate(first.id)}><span><small>AI AJUNS LA FINAL</small><strong>Revino la început</strong></span><ArrowRight size={18} aria-hidden="true" /></a>}</nav>
          <p className="gg-article-footnote">Un ghid pentru oameni, construit pe funcțiile existente. Datele tale de administrare nu sunt accesate de această pagină.</p>
        </article>

        <aside className="gg-toc" aria-label="În acest capitol"><span className="gg-eyebrow">ÎN ACEST CAPITOL</span><nav>{chapter.sections.map((section) => <a key={section.id} href={chapterHref(chapter.id, section.id)} aria-current={activeSection === section.id ? "location" : undefined} onClick={() => navigate(chapter.id, section.id)}>{section.title}</a>)}</nav><div className="gg-toc-note"><Sparkles size={17} aria-hidden="true" /><p>Învață în ritmul tău.</p><span>Fiecare capitol poate fi citit separat.</span></div><button type="button" className="gg-print-link" onClick={() => window.print()}><Printer size={14} aria-hidden="true" />Tipărește ghidul</button></aside>
      </div>
    </div>

    <div className="gg-print-view"><header><span>DansLab · Manual de utilizare</span><h1>DanGG, explicat.</h1><p>Ghidul administratorului · {chapters.length} capitole</p><p>Document informativ. Instrucțiunile și simulările nu execută operațiuni în administrare.</p></header>{chapters.map((item, index) => <article key={item.id} className="gg-print-chapter"><header><span>{String(index + 1).padStart(2, "0")} · {item.kicker}</span><h2>{item.title}</h2><p>{item.summary}</p></header>{item.id === "exercitii" && <aside className="gg-callout"><p>Simulare: 10 unități afișate în joc corespund la 1.000 de cenți interni. În Preț afișat din Marketplace, o ofertă de 10 EUR se introduce ca 10. Fluxul produs → solicitare → aprobare → acces nu procesează plăți și nu activează automat funcții.</p></aside>}{item.sections.map((section) => <SectionBlock key={section.id} section={section} chapter={item.id} print />)}{item.sources?.length > 0 && <footer className="gg-print-sources"><h3>Surse</h3>{item.sources.map((source) => <p key={source.url}><strong>{source.label}</strong><br /><a href={source.url}>{source.url}</a></p>)}</footer>}</article>)}</div>
  </div>;
}
