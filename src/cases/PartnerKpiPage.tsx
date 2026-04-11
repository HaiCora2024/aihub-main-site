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
        style={{ fontSize: "clamp(24px,4vw,40px)", color: GREEN }}
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

export function PartnerKpiPage() {
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
            Automated real-time KPI calculation<br className="hidden sm:block" /> for a partner portal
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[680px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            61% reduction in time spent on partner KPI reporting for a company tracking commissions manually.
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            Event-driven pipeline for lead attribution, commission calculation, and live dashboard sync
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag>Partner management</Tag>
            <Tag>Workflow automation</Tag>
            <Tag>Real-time analytics</Tag>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="61%" label="Reduction in KPI reporting time" delay={0} />
          <KpiCard value="100%" label="Accuracy in commission calculations" delay={80} />
          <KpiCard value="Real-time" label="Dashboard updates on every event" delay={160} />
          <KpiCard value="25 days" label="Implementation time" delay={240} />
        </div>

        {/* The Challenge */}
        <Section title="The challenge" delay={0}>
          <ul className="space-y-3">
            <BulletItem>Tracking partner performance across leads and applications required manual data collection from each partner — time-consuming and error-prone</BulletItem>
            <BulletItem>Commission calculations were done by hand, introducing frequent mistakes and disputes</BulletItem>
            <BulletItem>No real-time visibility meant business decisions on partner development were always based on stale data</BulletItem>
            <BulletItem>Lead-to-partner attribution had no automated logic — matching was done manually, slowing down reporting cycles</BulletItem>
            <BulletItem>Managers received no proactive alerts when key events occurred, relying instead on periodic manual checks</BulletItem>
          </ul>
        </Section>

        {/* What we built */}
        <Section title="What we built" delay={60}>
          <ul className="space-y-3">
            <BulletItem>Event-driven n8n pipeline triggered by webhooks from Airtable on every record creation or status change — no polling, no delay</BulletItem>
            <BulletItem>Automatic lead-to-partner linking: when a new lead arrives, the system identifies the corresponding partner and establishes the relationship in the database without manual input</BulletItem>
            <BulletItem>Custom JavaScript commission engine that calculates partner payouts and performance statistics using configurable formulas — handles complex multi-tier logic</BulletItem>
            <BulletItem>Data aggregation module that merges multiple event streams into a single consolidated view across all partners</BulletItem>
            <BulletItem>Live Airtable dashboard updated automatically on every event — managers see current KPIs without refreshing or running reports</BulletItem>
            <BulletItem>Email alert system that notifies managers immediately when key records are created or statuses change</BulletItem>
          </ul>
        </Section>

        {/* Results */}
        <Section title="Results" delay={120}>
          <ul className="space-y-3">
            <BulletItem>61% reduction in time spent on partner performance reporting — previously a manual, recurring task</BulletItem>
            <BulletItem>Commission calculation errors eliminated — 100% accuracy enforced by automation with no human re-keying</BulletItem>
            <BulletItem>Real-time partner dashboard allows immediate decisions on network development without waiting for end-of-period reports</BulletItem>
            <BulletItem>Event-driven architecture ensures every connected system reacts to changes instantly — no batch delays or sync gaps</BulletItem>
          </ul>
        </Section>

        {/* Key features */}
        <Section title="Key features" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill>Webhook-triggered event pipeline</FeaturePill>
            <FeaturePill>Automatic lead-to-partner attribution</FeaturePill>
            <FeaturePill>Custom commission calculation engine</FeaturePill>
            <FeaturePill>Multi-stream data aggregation</FeaturePill>
            <FeaturePill>Real-time Airtable dashboard sync</FeaturePill>
            <FeaturePill>Configurable KPI formulas</FeaturePill>
            <FeaturePill>Instant manager alerts via email</FeaturePill>
            <FeaturePill>External system webhook broadcast</FeaturePill>
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Technology</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              n8n workflow automation · JavaScript · Airtable API · Webhooks · Email
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Timeline</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">25 working days</p>
          </div>
        </div>

      </main>
    </div>
  );
}
