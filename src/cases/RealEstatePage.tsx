import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.20)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.90)";

/* ── Scroll-reveal hook ── */
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

/* ── KPI Card ── */
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
        style={{ fontSize: "clamp(26px,4.5vw,40px)", color: GREEN }}
      >
        {value}
      </span>
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-snug">
        {label}
      </span>
    </div>
  );
}

/* ── Section block ── */
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

/* ── Main page ── */
export function RealEstatePage() {
  const base = import.meta.env.BASE_URL;
  const backHref = `${base}#cases`;

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060c24] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 flex items-center gap-4">
          <a
            href={backHref}
            className="flex items-center gap-2 [font-family:'Geologica',Helvetica] font-light text-white/60 hover:text-white text-sm transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to cases
          </a>
          <span className="text-white/20">·</span>
          <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">
            AIHUB Works
          </span>
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
          <p
            className="[font-family:'Geologica',Helvetica] font-light text-sm uppercase tracking-widest mb-3"
            style={{ color: GREEN }}
          >
            Case Study
          </p>

          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            AI pipeline for real estate<br className="hidden sm:block" /> data automation
          </h1>

          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[680px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            2 hours of manual CRM updates every day — eliminated on day one.
          </p>

          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            Omnichannel intake, extraction, and structured CRM sync for property developers
          </p>

          <div className="flex flex-wrap gap-2">
            <Tag>PropTech</Tag>
            <Tag>Document intelligence</Tag>
            <Tag>CRM automation</Tag>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="2 hrs → 0" label="Daily time spent on data updates" delay={0} />
          <KpiCard value="< 3 min" label="File received to CRM updated" delay={80} />
          <KpiCard value="7 formats" label="Supported input types" delay={160} />
          <KpiCard value="120 days" label="Implementation time" delay={240} />
        </div>

        {/* The Challenge */}
        <Section title="The challenge" delay={0}>
          <ul className="space-y-3">
            <BulletItem>Developer updates arrived in every format imaginable — Excel floor plans, PDF presentations, WhatsApp voice notes, PowerPoint renders — with no consistent structure</BulletItem>
            <BulletItem>Sales managers spent up to 2 hours daily manually transferring data into CRM, introducing delays and frequent errors</BulletItem>
            <BulletItem>Listings were often outdated before they reached the sales team, costing deals and trust</BulletItem>
            <BulletItem>Each developer used their own terminology and templates — no single parsing approach could handle them all</BulletItem>
            <BulletItem>No audit trail: it was impossible to see what changed, when, or why</BulletItem>
          </ul>
        </Section>

        {/* What we built */}
        <Section title="What we built" delay={60}>
          <ul className="space-y-3">
            <BulletItem>Universal file intake across three channels — email attachments, a Telegram bot for developer managers, and a shared folder — accepting PPTX, DOCX, XLSX, PDF, MP3, OGG, and MP4</BulletItem>
            <BulletItem>Speech-to-text module (Whisper) that transcribes voice messages with real estate domain vocabulary — complex names, floor plan codes, building phases all handled accurately</BulletItem>
            <BulletItem>Per-format document pipeline: OCR for PDFs and scans, structural parser for Excel price tables, text extraction from PPTX slide layers</BulletItem>
            <BulletItem>LLM extractor that pulls structured fields — construction status, handover dates, floor plan changes, current prices, discounts, mortgage terms — from both documents and transcripts</BulletItem>
            <BulletItem>Few-shot prompting per developer so the system learns each source's terminology and template without retraining</BulletItem>
            <BulletItem>Validation layer that checks price ranges, future-dated handovers, and required fields before any write to CRM — anomalies trigger a manual review task instead of silent errors</BulletItem>
            <BulletItem>Real-time CRM sync via REST API with full change history: every manager sees exactly what changed and when</BulletItem>
          </ul>
        </Section>

        {/* Results */}
        <Section title="Results" delay={120}>
          <ul className="space-y-3">
            <BulletItem>Data update time reduced from 2 hours to zero — fully automated from file receipt to CRM write</BulletItem>
            <BulletItem>End-to-end latency under 3 minutes regardless of file type or source channel</BulletItem>
            <BulletItem>Data consistency guaranteed across all developers and formats via unified JSON schema</BulletItem>
            <BulletItem>Modular architecture allows new file formats or developer sources to be added without reworking core logic</BulletItem>
          </ul>
        </Section>

        {/* Key features */}
        <Section title="Key features" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill>Multi-channel file intake</FeaturePill>
            <FeaturePill>Voice message transcription</FeaturePill>
            <FeaturePill>7-format document parsing</FeaturePill>
            <FeaturePill>LLM field extraction</FeaturePill>
            <FeaturePill>Per-developer few-shot adaptation</FeaturePill>
            <FeaturePill>Pre-write validation and anomaly flags</FeaturePill>
            <FeaturePill>Real-time CRM sync via API</FeaturePill>
            <FeaturePill>Full change history and audit trail</FeaturePill>
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">
              Technology
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              Python · OpenAI Whisper · Azure Document Intelligence · OpenAI API · REST API CRM
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">
              Timeline
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">
              120 working days
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
