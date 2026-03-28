import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.20)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.90)";

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

interface KpiProps { value: string; label: string; delay?: number; }

function KpiCard({ value, label, delay = 0 }: KpiProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center p-6 rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${GREEN_08}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${GREEN_80} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        className="[font-family:'Geologica',Helvetica] font-bold leading-none mb-2"
        style={{ fontSize: "clamp(22px,3.5vw,36px)", color: GREEN }}
      >
        {value}
      </span>
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-snug">
        {label}
      </span>
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; delay?: number; }

function Section({ title, children, delay = 0 }: SectionProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${GREEN_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${GREEN} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/80 text-sm sm:text-base leading-relaxed">
      <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
      <span>{children}</span>
    </li>
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-[#ffffff08]" style={{ border: `1px solid ${GREEN_13}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GREEN }} />
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/80 text-sm leading-snug">
        {children}
      </span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-3 py-1 rounded-full [font-family:'Geologica',Helvetica] font-light text-xs"
      style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN_90 }}
    >
      {children}
    </span>
  );
}

export function MultilangDigestPage() {
  const base = import.meta.env.BASE_URL;
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060c24] text-white">

      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 flex items-center gap-4">
          <a
            href={`${base}#cases`}
            className="flex items-center gap-2 [font-family:'Geologica',Helvetica] font-light text-white/60 hover:text-white text-sm transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to cases
          </a>
          <span className="text-white/20">·</span>
          <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">AIHUB Works</span>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14 space-y-6 sm:space-y-8">

        {/* Hero */}
        <div
          ref={heroRef}
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p className="[font-family:'Geologica',Helvetica] font-light text-sm uppercase tracking-widest mb-3" style={{ color: GREEN }}>
            Case Study
          </p>
          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            AI-powered PDF translation with<br className="hidden sm:block" /> layout preservation for multilanguage digest production
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[720px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            20x faster multilanguage digest creation at a news agency — including scanned documents where the text couldn't even be copied.
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            OCR extraction, AI translation, and PDF reassembly via Telegram bot — end-to-end in one send
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag>Media / Publishing</Tag>
            <Tag>Document automation</Tag>
            <Tag>AI translation</Tag>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="20x faster" label="Multilanguage digest production" delay={0} />
          <KpiCard value="Any PDF" label="Including scans and image-only docs" delay={80} />
          <KpiCard value="Layout preserved" label="Tables and structure intact" delay={160} />
          <KpiCard value="2 weeks" label="Implementation time" delay={240} />
        </div>

        {/* The Challenge */}
        <Section title="The challenge" delay={0}>
          <ul className="space-y-3">
            <BulletItem>The news agency needed to produce multilanguage digests from source PDF documents — including scanned reports and image-based files where text couldn't be selected or copied</BulletItem>
            <BulletItem>Standard translation tools only worked on copyable text — scanned documents required manual retyping before any translation could begin</BulletItem>
            <BulletItem>Translating content was only half the problem — reassembling the translated text into a readable, structured PDF with tables and layout intact was a separate manual effort</BulletItem>
            <BulletItem>The volume of documents made the existing process a daily bottleneck for the editorial team</BulletItem>
          </ul>
        </Section>

        {/* What we built */}
        <Section title="What we built" delay={60}>
          <ul className="space-y-3">
            <BulletItem>Telegram bot interface — user sends a PDF and specifies the target language, translated document arrives in the same chat with no additional tools or logins required</BulletItem>
            <BulletItem>Google Cloud Storage intake — file uploaded to cloud storage to enable asynchronous processing of large documents without timeout failures</BulletItem>
            <BulletItem>Google Vision AI OCR — runs asynchronous text extraction across all pages, including scans, image overlays, and non-selectable text layers</BulletItem>
            <BulletItem>Polling mechanism that monitors long-running OCR tasks and proceeds only on confirmed completion — ensures stability with large or complex documents</BulletItem>
            <BulletItem>Google Gemini translation layer that simultaneously translates content and restructures it into HTML — tables, headings, and document hierarchy preserved in a single prompt pass</BulletItem>
            <BulletItem>Api2Pdf conversion — HTML rendered back to a clean, downloadable PDF delivered directly to the user in Telegram</BulletItem>
          </ul>
        </Section>

        {/* Results */}
        <Section title="Results" delay={120}>
          <ul className="space-y-3">
            <BulletItem>20x faster multilanguage digest production — what previously required manual extraction, translation, and reformatting now completes in a single bot interaction</BulletItem>
            <BulletItem>Scanned and image-based PDFs fully supported — no document type excluded from the workflow</BulletItem>
            <BulletItem>Table and document structure preserved in the output — translated digests are publication-ready without manual reformatting</BulletItem>
            <BulletItem>Entire pipeline hidden behind a Telegram interface — no technical knowledge required from editorial staff</BulletItem>
          </ul>
        </Section>

        {/* Key features */}
        <Section title="Key features" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill>Telegram bot interface</FeaturePill>
            <FeaturePill>Google Vision AI OCR</FeaturePill>
            <FeaturePill>Scanned document support</FeaturePill>
            <FeaturePill>Async OCR with polling</FeaturePill>
            <FeaturePill>Gemini AI translation</FeaturePill>
            <FeaturePill>Table and layout preservation</FeaturePill>
            <FeaturePill>HTML-to-PDF reassembly</FeaturePill>
            <FeaturePill>Cloud storage pipeline</FeaturePill>
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Technology</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              n8n · Google Vision AI · Google Gemini · Google Cloud Storage · Api2Pdf · Telegram Bot API
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Timeline</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">2 weeks</p>
          </div>
        </div>

      </main>
    </div>
  );
}
