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

export function KybScreeningPage() {
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
            Gamified KYB risk assessment platform<br className="hidden sm:block" /> for financial onboarding
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[720px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            60x faster KYB compliance screening for businesses that used to wait weeks for a risk assessment.
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            Interactive quiz, automated risk scoring, and AI-personalised compliance reports — delivered in real time
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag>Fintech / Compliance</Tag>
            <Tag>KYB</Tag>
            <Tag>Workflow automation</Tag>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="60x faster" label="KYB screening vs. traditional process" delay={0} />
          <KpiCard value="9 params" label="Scored per submission (max 108 pts)" delay={80} />
          <KpiCard value="3 tiers" label="Automated risk classification" delay={160} />
          <KpiCard value="5 days" label="Implementation time" delay={240} />
        </div>

        {/* The Challenge */}
        <Section title="The challenge" delay={0}>
          <ul className="space-y-3">
            <BulletItem>Banks and financial organisations needed to run KYB checks on new clients — a process traditionally involving complex forms, manual review, and weeks of processing time</BulletItem>
            <BulletItem>Standard compliance forms had low completion rates — entrepreneurs found them confusing, bureaucratic, and time-consuming</BulletItem>
            <BulletItem>No existing tool made the risk assessment process engaging or transparent for the business owner being assessed</BulletItem>
            <BulletItem>Compliance teams received unstructured data that required manual scoring and categorisation before any decision could be made</BulletItem>
            <BulletItem>Personalised follow-up recommendations required analyst time to write — not scalable across high volumes of applicants</BulletItem>
          </ul>
        </Section>

        {/* What we built */}
        <Section title="What we built" delay={60}>
          <ul className="space-y-3">
            <BulletItem>Gamified web platform built with Tailwind CSS and shadcn/ui — a 9-question interactive quiz that feels like an assessment tool, not a compliance form</BulletItem>
            <BulletItem>Weighted scoring engine in JavaScript calculating a risk score across 9 parameters — jurisdiction, legal structure, compliance history, transaction risk, and more — with a maximum of 108 points</BulletItem>
            <BulletItem>Three-tier risk classifier: low risk (≥80 pts), moderate (50–79), high (&lt;50) — category determined automatically on submission, driving all downstream logic</BulletItem>
            <BulletItem>Google Gemini AI agent that generates a unique personalised recommendation letter for each submission based on the specific answers and risk tier — not a template, but a tailored output</BulletItem>
            <BulletItem>PDF compliance checklist attached automatically from Google Drive based on risk category</BulletItem>
            <BulletItem>SendGrid email delivery of results and recommendations — triggered automatically on scoring, no manual send required</BulletItem>
            <BulletItem>Full submission history stored in Airtable with client data, scores, and interaction log for compliance team review</BulletItem>
            <BulletItem>Multilingual support (EN / RU) across the full flow — form, scoring, and AI-generated output</BulletItem>
          </ul>
        </Section>

        {/* Results */}
        <Section title="Results" delay={120}>
          <ul className="space-y-3">
            <BulletItem>60x faster KYB screening — risk assessment that previously took weeks now completes in minutes, end-to-end</BulletItem>
            <BulletItem>Every submission receives a personalised AI-generated compliance letter — zero analyst time required per applicant</BulletItem>
            <BulletItem>Three-tier classification applied automatically — compliance team receives structured, pre-scored data instead of raw form responses</BulletItem>
            <BulletItem>Gamified format drives higher completion rates compared to standard compliance forms</BulletItem>
          </ul>
        </Section>

        {/* Key features */}
        <Section title="Key features" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill>9-question gamified quiz</FeaturePill>
            <FeaturePill>Weighted risk scoring engine</FeaturePill>
            <FeaturePill>3-tier automated classification</FeaturePill>
            <FeaturePill>AI-personalised recommendation letter</FeaturePill>
            <FeaturePill>PDF checklist auto-attachment</FeaturePill>
            <FeaturePill>SendGrid email delivery</FeaturePill>
            <FeaturePill>Airtable compliance data store</FeaturePill>
            <FeaturePill>Multilingual EN / RU support</FeaturePill>
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Technology</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              n8n · Google Gemini API · Airtable · SendGrid · Google Drive · JavaScript · Tailwind CSS · shadcn/ui
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">Timeline</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">5 working days</p>
          </div>
        </div>

      </main>
    </div>
  );
}
