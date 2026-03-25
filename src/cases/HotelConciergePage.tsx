import { useEffect, useRef, useState } from "react";

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

/* ── Animated counter ── */
function useCounter(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* ── KPI Card ── */
interface KpiProps {
  value: string;
  label: string;
  delay?: number;
}

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
        boxShadow: "inset 0 0 40px rgba(255, 70, 58, 0.08)",
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: "linear-gradient(129deg, rgba(255,70,58,0.8) 0%, transparent 70%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        className="[font-family:'Geologica',Helvetica] font-bold text-[#ff463a] leading-none mb-2"
        style={{ fontSize: "clamp(28px,5vw,44px)" }}
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
interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
}

function Section({ title, children, delay = 0, accentColor = "rgba(255,70,58,1)" }: SectionProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: "inset 0 0 40px rgba(255, 70, 58, 0.06)",
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${accentColor} 0%, transparent 70%)`,
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

/* ── Bullet list item ── */
function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/80 text-sm sm:text-base leading-relaxed">
      <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-[#ff463a]" />
      <span>{children}</span>
    </li>
  );
}

/* ── Feature pill ── */
function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-[#ffffff08] border border-[#ff463a22]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ff463a] shrink-0" />
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/80 text-sm leading-snug">
        {children}
      </span>
    </div>
  );
}

/* ── Tag pill ── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full bg-[#ff463a18] border border-[#ff463a33] [font-family:'Geologica',Helvetica] font-light text-[#ff8880] text-xs">
      {children}
    </span>
  );
}

/* ── Main page ── */
export function HotelConciergePage() {
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
          {/* eyebrow */}
          <p className="[font-family:'Geologica',Helvetica] font-light text-[#ff463a] text-sm uppercase tracking-widest mb-3">
            Case Study
          </p>

          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            AI concierge for boutique hotel<br className="hidden sm:block" /> guest services
          </h1>

          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            Multilingual booking assistant with PMS integration and upsell automation
          </p>

          <div className="flex flex-wrap gap-2">
            <Tag>Hospitality</Tag>
            <Tag>Conversational AI</Tag>
            <Tag>Booking automation</Tag>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="42%" label="Reduction in front desk workload" delay={0} />
          <KpiCard value="72%" label="Requests handled without staff" delay={80} />
          <KpiCard value="30 days" label="Implementation time" delay={160} />
          <KpiCard value="3–5 sec" label="Average response time" delay={240} />
        </div>

        {/* The Challenge */}
        <Section title="The challenge" delay={0}>
          <ul className="space-y-3">
            <BulletItem>60% of guest inquiries were routine — room availability, pricing, amenities — consuming front desk time that should go to personal service</BulletItem>
            <BulletItem>International guests faced a language barrier with no 24/7 multilingual support in place</BulletItem>
            <BulletItem>Time zone differences caused delays in booking confirmations and basic requests</BulletItem>
            <BulletItem>Upsell and loyalty opportunities were missed during every guest interaction</BulletItem>
            <BulletItem>No systematic way to capture and act on guest preferences across stays</BulletItem>
          </ul>
        </Section>

        {/* What we built */}
        <Section title="What we built" delay={60}>
          <ul className="space-y-3">
            <BulletItem>Conversational AI concierge that detects guest language automatically and responds natively — Russian, English, German, Chinese, Georgian and more</BulletItem>
            <BulletItem>Real-time room availability and pricing pulled from PMS (Exely) and OTA platforms (Booking.com / TravelLine) via an adapter layer that normalises different APIs</BulletItem>
            <BulletItem>End-to-end booking flow: guest provides details, bot completes the reservation in the hotel's management system, confirmation sent automatically</BulletItem>
            <BulletItem>Voice channel via Twilio + Whisper — guests can call, speak naturally, and get answers without waiting on hold</BulletItem>
            <BulletItem>Personalised upsell engine that offers spa, restaurant, transfer, and tours based on stay context — romantic packages on weekend bookings, etc.</BulletItem>
            <BulletItem>Post-stay retention flow: automated review request, loyalty programme invitation, and personalised return offer</BulletItem>
            <BulletItem>Analytics dashboard capturing request volume, peak hours, popular services, and unmet demand patterns</BulletItem>
          </ul>
        </Section>

        {/* Results */}
        <Section title="Results" delay={120}>
          <ul className="space-y-3">
            <BulletItem>42% reduction in routine front desk load in the first month of operation</BulletItem>
            <BulletItem>72% of all guest requests resolved without any staff involvement</BulletItem>
            <BulletItem>Zero outdated pricing or availability shown — RAG architecture ensures every response pulls live data</BulletItem>
            <BulletItem>Consistent guest experience across all time zones, 24/7</BulletItem>
          </ul>
        </Section>

        {/* Key features */}
        <Section title="Key features" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill>Real-time availability and pricing</FeaturePill>
            <FeaturePill>End-to-end booking via OTA / PMS</FeaturePill>
            <FeaturePill>Auto language detection</FeaturePill>
            <FeaturePill>Voice channel (Twilio + Whisper)</FeaturePill>
            <FeaturePill>Guest preference memory</FeaturePill>
            <FeaturePill>Personalised upsell and loyalty</FeaturePill>
            <FeaturePill>Post-stay retention automation</FeaturePill>
            <FeaturePill>Request analytics and reporting</FeaturePill>
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
              Python · OpenAI API · Whisper · Twilio · TravelLine / Bnovo API · Telegram Bot API / WhatsApp
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">
              Timeline
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">
              30 working days
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
