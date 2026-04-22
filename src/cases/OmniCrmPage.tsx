import { useEffect, useRef, useState } from "react";

const PURPLE = "rgba(191,91,243,1)";
const PURPLE_80 = "rgba(191,91,243,0.8)";
const PURPLE_20 = "rgba(191,91,243,0.20)";
const PURPLE_13 = "rgba(191,91,243,0.13)";
const PURPLE_08 = "rgba(191,91,243,0.08)";
const PURPLE_06 = "rgba(191,91,243,0.06)";
const GREEN = "rgba(8,208,112,1)";
const GREEN_20 = "rgba(8,208,112,0.20)";
const GREEN_08 = "rgba(8,208,112,0.08)";
const MUTED = "rgba(255,255,255,0.45)";

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

interface KpiProps { value: string; label: string; delay?: number; color?: string; }

function KpiCard({ value, label, delay = 0, color = PURPLE }: KpiProps) {
  const { ref, visible } = useReveal();
  const color80 = color === PURPLE ? PURPLE_80 : "rgba(8,208,112,0.8)";
  const color08 = color === PURPLE ? PURPLE_08 : GREEN_08;
  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${color08}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${color80} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        className="[font-family:'Geologica',Helvetica] font-bold leading-none mb-1.5 sm:mb-2"
        style={{ fontSize: "clamp(18px,3.5vw,36px)", color }}
      >
        {value}
      </span>
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-xs sm:text-sm leading-snug">
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
      className="relative rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-5 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${PURPLE_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-lg sm:text-2xl mb-4 sm:mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/80 text-sm leading-relaxed">
      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
      <span>{children}</span>
    </li>
  );
}

function FeaturePill({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#ffffff08]" style={{ border: `1px solid ${PURPLE_13}` }}>
      {icon && <span className="text-base shrink-0 mt-0.5">{icon}</span>}
      {!icon && <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]" style={{ background: PURPLE }} />}
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
      style={{ background: PURPLE_08, border: `1px solid ${PURPLE_20}`, color: PURPLE }}
    >
      {children}
    </span>
  );
}

/* ── Animated Demo ── */
interface TgMessage { init: string; name: string; text: string; highlight?: boolean; trigger?: boolean; }

const TG_MSGS: TgMessage[] = [
  { init: "C1", name: "Colleague 1", text: "Who's available?" },
  { init: "C2", name: "Colleague 2", text: "Here, sorting out EUR" },
  { init: "AL", name: "Alexander", text: "@Manager need to exchange 50K USDT", highlight: true, trigger: true },
  { init: "C1", name: "Colleague 1", text: "Need to send 20k EUR to Monaco" },
  { init: "MN", name: "Manager", text: "Alexander, rate 92.5 — works for you?" },
  { init: "AL", name: "Alexander", text: "Yes, let's go 👍" },
];

function DemoSection() {
  const { ref, visible } = useReveal(0.15);
  const [step, setStep] = useState(-1);
  const [crmVisible, setCrmVisible] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;
    TG_MSGS.forEach((msg, i) => {
      setTimeout(() => {
        setStep(i);
        if (msg.trigger) setTimeout(() => setCrmVisible(true), 500);
      }, i * 950);
    });
  }, [visible]);

  function replay() {
    hasRun.current = false;
    setStep(-1);
    setCrmVisible(false);
    setTimeout(() => {
      hasRun.current = true;
      TG_MSGS.forEach((msg, i) => {
        setTimeout(() => {
          setStep(i);
          if (msg.trigger) setTimeout(() => setCrmVisible(true), 500);
        }, i * 950);
      });
    }, 100);
  }

  return (
    <div ref={ref} className="relative rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-5 sm:p-8"
      style={{ boxShadow: `inset 0 0 40px ${PURPLE_06}`, opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      <div className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{ background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
      />
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-lg sm:text-2xl mb-1.5">What is OMNI-Agentic CRM?</h2>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/50 text-sm mb-5">A client sends a message. The system extracts the deal and routes it to an operator — without noise.</p>

      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Telegram panel */}
        <div className="rounded-[14px] bg-[#060c24] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2 h-2 rounded-full bg-[#ff5c57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-white/40 [font-family:'Geologica',Helvetica] truncate">Telegram — OTC Working Group</span>
          </div>
          <div className="p-3 flex flex-col gap-2 min-h-[220px]">
            {TG_MSGS.map((msg, i) => (
              <div key={i} className="flex items-start gap-2"
                style={{ opacity: step >= i ? 1 : 0, transform: step >= i ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{ background: msg.highlight ? PURPLE_13 : "rgba(255,255,255,0.06)", color: msg.highlight ? PURPLE : MUTED }}
                >
                  {msg.init}
                </div>
                <div className="rounded-[8px] px-2 py-1.5 text-xs leading-[1.45] flex-1 min-w-0"
                  style={{ background: msg.highlight ? PURPLE_08 : "rgba(255,255,255,0.04)", border: `1px solid ${msg.highlight ? PURPLE_20 : "rgba(255,255,255,0.05)"}` }}
                >
                  <div className="font-semibold mb-0.5 text-[10px]" style={{ color: msg.highlight ? PURPLE : MUTED }}>{msg.name}</div>
                  <div className="text-white/70">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM panel */}
        <div className="rounded-[14px] bg-[#060c24] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2 h-2 rounded-full bg-[#ff5c57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-white/40 [font-family:'Geologica',Helvetica]">CRM — Operator view</span>
          </div>
          <div className="p-4 min-h-[220px]">
            <div style={{ opacity: crmVisible ? 1 : 0, transition: "opacity 0.4s ease 0.2s" }}>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3"
                style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
                New deal
              </div>
              <div className="text-white font-bold text-sm sm:text-base mb-3 [font-family:'Geologica',Helvetica]">OTC Exchange #2841</div>
              {[
                { k: "Client", v: "Alexander (@alex_tg)", hi: false },
                { k: "Amount", v: "50,000 USDT", hi: true },
                { k: "Rate", v: "92.5 RUB/USDT", hi: false },
                { k: "Source", v: "TG Group", hi: false },
                { k: "Assigned to", v: "Manager Dima ↗", hi: "purple" },
              ].map((row, i) => (
                <div key={i} className="flex gap-2 text-xs mb-2"
                  style={{ opacity: crmVisible ? 1 : 0, transition: `opacity 0.35s ease ${0.4 + i * 0.18}s` }}
                >
                  <span className="text-white/40 min-w-[72px] shrink-0 [font-family:'Geologica',Helvetica]">{row.k}</span>
                  <span className="font-semibold [font-family:'Geologica',Helvetica]"
                    style={{ color: row.hi === true ? GREEN : row.hi === "purple" ? PURPLE : "rgba(255,255,255,0.85)" }}
                  >{row.v}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 10, paddingTop: 10, opacity: crmVisible ? 1 : 0, transition: "opacity 0.3s ease 1.4s" }}>
                <span className="text-[11px] italic text-white/35 [font-family:'Geologica',Helvetica]">«Great weather» and noise — <strong className="text-white/50">not shown</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-white/30 mt-4 [font-family:'Geologica',Helvetica]">
        Animation plays automatically
        {" · "}
        <button onClick={replay} className="underline hover:text-white/60 transition-colors cursor-pointer" style={{ background: "none", border: "none", color: "inherit", font: "inherit" }}>↺ Replay</button>
      </p>
    </div>
  );
}

/* ── Metric block ── */
function MetricBlock() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="relative rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-12 text-center overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease", boxShadow: `inset 0 0 40px ${PURPLE_06}` }}
    >
      <div className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{ background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
      />
      <p className="text-xs font-light uppercase tracking-widest text-white/40 mb-6 sm:mb-8 [font-family:'Geologica',Helvetica]">Real case — SLA routing for operators</p>
      <div className="flex items-center justify-center gap-4 sm:gap-10 mb-4 sm:mb-5">
        <div className="text-center">
          <div className="font-black leading-none [font-family:'Geologica',Helvetica]" style={{ fontSize: "clamp(48px,10vw,104px)", color: "rgba(255,70,58,1)" }}>4</div>
          <div className="text-xs sm:text-sm text-white/40 mt-1">min</div>
        </div>
        <div className="text-xl sm:text-2xl text-white/30 pb-4">→</div>
        <div className="text-center">
          <div className="font-black leading-none [font-family:'Geologica',Helvetica]" style={{ fontSize: "clamp(48px,10vw,104px)", color: GREEN }}>40</div>
          <div className="text-xs sm:text-sm text-white/40 mt-1">sec</div>
        </div>
      </div>
      <p className="text-sm text-white/50 max-w-[440px] mx-auto [font-family:'Geologica',Helvetica] font-light leading-relaxed">
        Average operator response time after switching to an isolated circuit with a smart request queue.
      </p>
    </div>
  );
}

/* ── CRM Kanban Mockup ── */
function CrmMockup() {
  const { ref, visible } = useReveal();
  const kanbanCols = [
    { head: "Bot Active", count: 1022, cards: [
      { name: "@yaninazusko", badges: [{ label: "TG Mini-App", cl: "teal" }, { label: "Bot Active", cl: "purple" }], time: "8 hrs ago" },
      { name: "INTERNAL_27C0", badges: [{ label: "Internal", cl: "gray" }, { label: "Bot Active", cl: "purple" }], time: "10 hrs ago" },
    ]},
    { head: "In Progress", count: 24, cards: [
      { name: "Ivan Rudnitski", badges: [{ label: "Instagram", cl: "red" }, { label: "No Show", cl: "red" }], time: "Yesterday" },
      { name: "Maria K.", badges: [{ label: "Instagram", cl: "red" }, { label: "Waiting", cl: "yellow" }], time: "3 hrs ago" },
    ]},
    { head: "Waiting List", count: 7, cards: [
      { name: "Andrei V.", badges: [{ label: "Instagram", cl: "red" }, { label: "Call Later", cl: "yellow" }], time: "2 hrs ago" },
    ]},
    { head: "Converted", count: 23, cards: [
      { name: "Novik Lidziya", badges: [{ label: "Instagram", cl: "red" }, { label: "Converted ✓", cl: "green" }], time: "Yesterday" },
      { name: "Natallia P.", badges: [{ label: "Instagram", cl: "red" }, { label: "Appt Scheduled", cl: "green" }], time: "8 hrs ago" },
    ]},
  ];
  const badgeColors: Record<string, { bg: string; color: string }> = {
    teal: { bg: "rgba(99,230,225,0.12)", color: "rgba(99,230,225,1)" },
    purple: { bg: PURPLE_08, color: PURPLE },
    red: { bg: "rgba(255,70,58,0.12)", color: "rgba(255,120,110,1)" },
    gray: { bg: "rgba(255,255,255,0.07)", color: "rgba(200,200,200,0.7)" },
    yellow: { bg: "rgba(255,212,9,0.12)", color: "rgba(255,212,9,1)" },
    green: { bg: GREEN_08, color: GREEN },
  };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}>
      <div className="rounded-[16px] sm:rounded-[20px] overflow-hidden" style={{ background: "#0a1030", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-2 h-2 rounded-full bg-[#ff5c57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] text-white/40 [font-family:'Geologica',Helvetica] truncate">CRM Space — Engagement Board · Leads</span>
        </div>
        <div className="flex" style={{ minHeight: 300 }}>
          {/* Sidebar — desktop only */}
          <div className="hidden sm:flex flex-col py-3 w-[180px] shrink-0" style={{ background: "rgba(0,0,0,0.2)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            {[{ icon: "🏠", label: "Home" }, { icon: "💬", label: "Chats" }, { icon: "📚", label: "Knowledge" }, { icon: "⚙️", label: "AI Settings" }, { icon: "📊", label: "CRM Space", active: true }].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 px-4 py-2.5 text-xs"
                style={{ color: item.active ? PURPLE : "rgba(255,255,255,0.35)", background: item.active ? PURPLE_08 : "transparent", borderLeft: `2px solid ${item.active ? PURPLE : "transparent"}` }}
              >
                <span>{item.icon}</span><span className="[font-family:'Geologica',Helvetica]">{item.label}</span>
              </div>
            ))}
          </div>
          {/* Main content */}
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            <div className="flex gap-1 mb-3">
              {["Leads", "Deals", "Patients"].map((tab, i) => (
                <div key={tab} className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs [font-family:'Geologica',Helvetica]"
                  style={{ background: i === 0 ? PURPLE_08 : "transparent", color: i === 0 ? PURPLE : "rgba(255,255,255,0.35)", border: i === 0 ? `1px solid ${PURPLE_20}` : "1px solid transparent", fontWeight: i === 0 ? 600 : 400 }}
                >
                  {tab}
                </div>
              ))}
            </div>
            {/* Stats — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { num: "1 122", label: "All leads", color: "rgba(255,255,255,0.85)" },
                { num: "1 022", label: "Bot Active / New", color: PURPLE },
                { num: "23", label: "Converted", color: GREEN },
                { num: "26", label: "Call Later", color: "rgba(255,212,9,1)" },
              ].map(st => (
                <div key={st.label} className="rounded-[8px] sm:rounded-[10px] p-2 sm:p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-bold text-base sm:text-lg leading-none mb-1 [font-family:'Geologica',Helvetica]" style={{ color: st.color }}>{st.num}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/40 leading-tight [font-family:'Geologica',Helvetica]">{st.label}</div>
                </div>
              ))}
            </div>
            {/* Kanban — horizontally scrollable */}
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-2" style={{ minWidth: 480 }}>
                {kanbanCols.map(col => (
                  <div key={col.head} className="flex-1 min-w-[110px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-white/40 [font-family:'Geologica',Helvetica]">{col.head}</span>
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded text-white/50 [font-family:'Geologica',Helvetica]" style={{ background: "rgba(255,255,255,0.06)" }}>{col.count}</span>
                    </div>
                    {col.cards.map(card => (
                      <div key={card.name} className="rounded-[7px] p-2 mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-[11px] font-bold text-white mb-1 [font-family:'Geologica',Helvetica] truncate">{card.name}</div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {card.badges.map(b => (
                            <span key={b.label} className="text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded [font-family:'Geologica',Helvetica]"
                              style={{ background: badgeColors[b.cl].bg, color: badgeColors[b.cl].color }}
                            >{b.label}</span>
                          ))}
                        </div>
                        <div className="text-[9px] text-white/30 [font-family:'Geologica',Helvetica]">{card.time}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat Mockup ── */
function ChatMockup() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}>
      <div className="rounded-[16px] sm:rounded-[20px] overflow-hidden" style={{ background: "#0a1030", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-2 h-2 rounded-full bg-[#ff5c57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] text-white/40 [font-family:'Geologica',Helvetica]">Chats — AI Assistant in action</span>
        </div>
        <div className="flex" style={{ minHeight: 300 }}>
          {/* Chat list — desktop only */}
          <div className="hidden sm:flex flex-col w-[200px] shrink-0 py-2" style={{ background: "rgba(0,0,0,0.15)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="px-3 py-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 [font-family:'Geologica',Helvetica]">Chat Sessions</span>
            </div>
            {[
              { name: "yaninazusko", preview: "Calling the admin now...", time: "00:57", active: true },
              { name: "Pi... (Instagram)", preview: "Yes, I'm online...", time: "02:35" },
              { name: "Instagram_126...", preview: "<Content>", time: "23:59" },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-2 px-3 py-2"
                style={{ background: item.active ? PURPLE_08 : "transparent", borderLeft: `2px solid ${item.active ? PURPLE : "transparent"}` }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 [font-family:'Geologica',Helvetica]"
                  style={{ background: "rgba(255,100,100,0.15)", color: "rgba(255,150,140,1)" }}
                >y</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate [font-family:'Geologica',Helvetica]">{item.name}</div>
                  <div className="text-[10px] text-white/30 truncate [font-family:'Geologica',Helvetica]">{item.preview}</div>
                </div>
                <div className="text-[10px] text-white/25 shrink-0 [font-family:'Geologica',Helvetica]">{item.time}</div>
              </div>
            ))}
          </div>
          {/* Chat view */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2.5" style={{ background: "rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white [font-family:'Geologica',Helvetica] truncate">User: yaninazusko</div>
                <div className="text-[11px] text-white/35 [font-family:'Geologica',Helvetica]">Created: 05.02.2026, 00:55</div>
              </div>
              <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-[6px] [font-family:'Geologica',Helvetica] shrink-0 whitespace-nowrap" style={{ background: PURPLE_08, color: PURPLE }}>TG Mini-App</span>
            </div>
            <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm shrink-0" style={{ background: GREEN_08, color: GREEN }}>🤖</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed flex-1 [font-family:'Geologica',Helvetica]"
                  style={{ background: GREEN_08, border: "1px solid rgba(8,208,112,0.2)" }}
                >
                  <div className="text-[10px] font-bold mb-1 uppercase tracking-wide" style={{ color: GREEN }}>AI ASSISTANT</div>
                  Good day! I'm Medina, AI assistant at PaNa Medica. I can help with general questions. If you'd like to speak with an administrator — I'll get one for you. For urgent pain, call: <strong>+48 511 111 595</strong>
                </div>
              </div>
              <div className="flex flex-row-reverse items-start gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shrink-0 [font-family:'Geologica',Helvetica] font-bold" style={{ background: "rgba(255,100,100,0.15)", color: "rgba(255,150,140,1)" }}>U</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed text-white/80 [font-family:'Geologica',Helvetica]"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: "85%" }}
                >
                  What's the cost of tooth restoration with a post and crown?
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm shrink-0" style={{ background: GREEN_08, color: GREEN }}>🤖</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed flex-1 [font-family:'Geologica',Helvetica]"
                  style={{ background: GREEN_08, border: "1px solid rgba(8,208,112,0.2)" }}
                >
                  <div className="text-[10px] font-bold mb-1 uppercase tracking-wide" style={{ color: GREEN }}>AI ASSISTANT</div>
                  I'm getting an administrator for you now. They'll connect as soon as available. Thank you for your patience! 🌹
                </div>
              </div>
            </div>
            <div className="px-3 sm:px-4 py-2.5" style={{ background: "rgba(0,0,0,0.1)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] text-xs text-white/30 [font-family:'Geologica',Helvetica]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span>Type your message...</span>
                <button className="text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-[5px] text-black cursor-default shrink-0" style={{ background: PURPLE }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── THE PROBLEM ── */
function ProblemSection() {
  const { ref, visible } = useReveal();
  const pains = [
    {
      icon: "💬",
      title: "Managers drown in threads",
      text: "Hundreds of simultaneous chats across multiple apps. Nothing gets answered on time.",
    },
    {
      icon: "👁",
      title: "No visibility into conversations",
      text: "You can't coach what you can't see. Deal outcomes are a mystery.",
    },
    {
      icon: "⏱",
      title: "Leads go cold before you reply",
      text: "Speed is everything in messaging. Slow response = lost deal.",
    },
    {
      icon: "🔌",
      title: "CRM and messengers don't talk",
      text: "Manual copy-paste, scattered history, zero automation.",
    },
  ];
  return (
    <div
      ref={ref}
      className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden p-5 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        background: "rgba(6,12,36,0.6)",
        border: "1px solid rgba(255,70,58,0.2)",
        boxShadow: "inset 0 0 60px rgba(255,70,58,0.04)",
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          background: "linear-gradient(129deg, rgba(255,70,58,0.5) 0%, transparent 65%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <p className="[font-family:'Geologica',Helvetica] font-light text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,70,58,0.8)" }}>
        The problem
      </p>
      <h2 className="[font-family:'Geologica',Helvetica] font-bold text-white text-lg sm:text-2xl leading-tight mb-5 sm:mb-7">
        Why messenger-based sales are broken today
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {pains.map((p, i) => (
          <div
            key={p.title}
            className="rounded-[14px] p-4 sm:p-5"
            style={{
              background: "rgba(255,70,58,0.05)",
              border: "1px solid rgba(255,70,58,0.14)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <div className="text-xl sm:text-2xl mb-2.5">{p.icon}</div>
            <div className="[font-family:'Geologica',Helvetica] font-semibold text-white text-sm sm:text-base mb-1.5">{p.title}</div>
            <div className="[font-family:'Geologica',Helvetica] font-light text-white/55 text-xs sm:text-sm leading-relaxed">{p.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CUSTOMER JOURNEY TIMELINE ── */
function JourneySection() {
  const { ref, visible } = useReveal(0.1);
  const steps = [
    {
      n: "01",
      title: "Lead messages in",
      text: "Customer writes via any connected messaging channel.",
      highlight: false,
    },
    {
      n: "02",
      title: "AI responds instantly",
      text: "Agent opens dialogue, qualifies intent and warms up the prospect — 24/7.",
      highlight: true,
    },
    {
      n: "03",
      title: "Manager takes over",
      text: "Hot lead handed off with full conversation context already attached.",
      highlight: false,
    },
    {
      n: "04",
      title: "Deal logged automatically",
      text: "CRM updates the pipeline, analytics refresh — no manual entry needed.",
      highlight: false,
    },
  ];
  return (
    <div
      ref={ref}
      className="relative rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-5 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        boxShadow: `inset 0 0 40px ${PURPLE_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <p className="[font-family:'Geologica',Helvetica] font-light text-xs uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
        How it works end-to-end
      </p>
      <h2 className="[font-family:'Geologica',Helvetica] font-bold text-white text-lg sm:text-2xl mb-6 sm:mb-8">
        The customer journey in OMNI CRM
      </h2>

      {/* Desktop: horizontal timeline */}
      <div className="hidden sm:block relative">
        {/* connector line */}
        <div className="absolute top-[28px] left-[40px] right-[40px] h-px" style={{ background: `linear-gradient(90deg, ${PURPLE_20}, ${PURPLE_20})` }} />
        <div className="grid grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative flex flex-col items-center text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
              }}
            >
              {/* circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mb-4 relative z-10 [font-family:'Geologica',Helvetica]"
                style={{
                  background: s.highlight ? PURPLE : "rgba(191,91,243,0.12)",
                  color: s.highlight ? "#fff" : PURPLE,
                  border: `2px solid ${s.highlight ? PURPLE : PURPLE_20}`,
                  boxShadow: s.highlight ? `0 0 24px ${PURPLE_20}` : "none",
                }}
              >
                {s.n}
              </div>
              {/* card */}
              <div
                className="w-full rounded-[14px] p-4 text-left"
                style={{
                  background: s.highlight ? `linear-gradient(135deg, ${PURPLE_13} 0%, ${PURPLE_06} 100%)` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${s.highlight ? PURPLE_20 : "rgba(255,255,255,0.07)"}`,
                  boxShadow: s.highlight ? `0 0 30px ${PURPLE_08}` : "none",
                }}
              >
                {s.highlight && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2" style={{ background: PURPLE_13, color: PURPLE }}>
                    ★ Key moment
                  </span>
                )}
                <div className="[font-family:'Geologica',Helvetica] font-semibold text-white text-sm mb-1.5" style={{ color: s.highlight ? "#fff" : "rgba(255,255,255,0.9)" }}>
                  {s.title}
                </div>
                <div className="[font-family:'Geologica',Helvetica] font-light text-xs leading-relaxed" style={{ color: s.highlight ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}>
                  {s.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="sm:hidden flex flex-col gap-3 relative">
        <div className="absolute left-[21px] top-6 bottom-6 w-px" style={{ background: `linear-gradient(to bottom, ${PURPLE_20}, transparent)` }} />
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="flex items-start gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-12px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative z-10 [font-family:'Geologica',Helvetica]"
              style={{
                background: s.highlight ? PURPLE : "rgba(191,91,243,0.12)",
                color: s.highlight ? "#fff" : PURPLE,
                border: `2px solid ${s.highlight ? PURPLE : PURPLE_20}`,
                boxShadow: s.highlight ? `0 0 20px ${PURPLE_20}` : "none",
              }}
            >
              {s.n}
            </div>
            <div
              className="flex-1 rounded-[12px] p-3.5"
              style={{
                background: s.highlight ? `linear-gradient(135deg, ${PURPLE_13} 0%, ${PURPLE_06} 100%)` : "rgba(255,255,255,0.03)",
                border: `1px solid ${s.highlight ? PURPLE_20 : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {s.highlight && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2" style={{ background: PURPLE_13, color: PURPLE }}>
                  ★ Key moment
                </span>
              )}
              <div className="[font-family:'Geologica',Helvetica] font-semibold text-white text-sm mb-1">
                {s.title}
              </div>
              <div className="[font-family:'Geologica',Helvetica] font-light text-xs leading-relaxed" style={{ color: s.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)" }}>
                {s.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── WHY OMNI CRM ── */
function WhyCrmSection() {
  const { ref, visible } = useReveal();
  const reasons = [
    {
      icon: "💬",
      title: "Messenger-first by design",
      text: "Not a bolt-on feature. The entire system is architected around the channels your customers already use every day.",
    },
    {
      icon: "📊",
      title: "Full pipeline visibility",
      text: "Every deal, every message, every stage tracked in one dashboard. No manual data entry, no guesswork.",
    },
    {
      icon: "🤖",
      title: "Agentic AI, not just chatbots",
      text: "The AI understands context, adapts its replies and takes goal-oriented actions. It's not scripted — it thinks.",
    },
    {
      icon: "⚡",
      title: "Days to go live, not months",
      text: "Connect your channels, configure your flow and start capturing leads almost immediately.",
    },
  ];
  return (
    <div
      ref={ref}
      className="relative rounded-[20px] sm:rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-5 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        boxShadow: `inset 0 0 40px ${PURPLE_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[20px] sm:rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <p className="[font-family:'Geologica',Helvetica] font-light text-xs uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
        Why OMNI CRM
      </p>
      <h2 className="[font-family:'Geologica',Helvetica] font-bold text-white text-lg sm:text-2xl mb-6 sm:mb-7">
        Built differently from traditional CRMs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {reasons.map((r, i) => (
          <div
            key={r.title}
            className="rounded-[14px] p-4 sm:p-5"
            style={{
              background: PURPLE_08,
              border: `1px solid ${PURPLE_13}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <div className="text-xl sm:text-2xl mb-2.5">{r.icon}</div>
            <div className="[font-family:'Geologica',Helvetica] font-semibold text-white text-sm sm:text-base mb-1.5">{r.title}</div>
            <div className="[font-family:'Geologica',Helvetica] font-light text-white/55 text-xs sm:text-sm leading-relaxed">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OmniCrmPage() {
  const base = import.meta.env.BASE_URL;
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#060c24] text-white">

      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 flex items-center gap-3">
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
          <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm hidden sm:block">AIHUB Works</span>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-14 space-y-5 sm:space-y-8">

        {/* Hero */}
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p className="[font-family:'Geologica',Helvetica] font-light text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ color: PURPLE }}>
            Our own product
          </p>
          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(24px,5vw,52px)" }}
          >
            OMNI-Agentic CRM —<br className="hidden sm:block" /> from messenger chaos to a managed system
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-3 max-w-[720px]"
            style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(191,91,243,0.9)", lineHeight: 1.6 }}
          >
            Clients reach out from Facebook ads, Instagram DMs, WhatsApp, Telegram bots — wherever you run campaigns. Every inbound lead lands in a different place. We built the system that captures all of it and turns scattered requests into a controllable sales pipeline.
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm sm:text-lg leading-relaxed mb-5 sm:mb-6 max-w-[680px]">
            Isolated operator circuit · AI-first qualification · Unified inbox for TG, WA, and Instagram
          </p>
          <div className="flex flex-wrap gap-2">
            <Tag>Own product</Tag>
            <Tag>Messenger CRM</Tag>
            <Tag>AI qualification</Tag>
            <Tag>Omni-channel</Tag>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard value="40 sec" label="Average operator response time" delay={0} color={GREEN} />
          <KpiCard value="0%" label="Deals lost after go-live" delay={80} />
          <KpiCard value="TG + WA" label="+ Instagram in unified inbox" delay={160} />
          <KpiCard value="24/7" label="AI first-line qualification" delay={240} />
        </div>

        {/* THE PROBLEM */}
        <ProblemSection />

        {/* Animated demo */}
        <DemoSection />

        {/* Customer journey timeline */}
        <JourneySection />

        {/* Metric */}
        <MetricBlock />

        {/* CRM mockup */}
        <Section title="In production at a medical network" delay={0}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed mb-5">
            Clinics were receiving requests through Instagram and messengers. The AI assistant handles initial contact and passes only qualified leads to the administrator.
          </p>
          <CrmMockup />
        </Section>

        {/* Chat mockup */}
        <Section title="AI assistant in action" delay={60}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed mb-5">
            The client sees a live human-named profile. The AI handles first-line questions and escalates to a human operator when needed.
          </p>
          <ChatMockup />
        </Section>

        {/* Niches */}
        <Section title="Works across industries" delay={0}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm mb-4">Anywhere a team works in messengers and loses leads in the noise.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { icon: "💱", title: "Fintech & Exchange", text: "OTC desk, P2P, crypto services — isolated operator circuit" },
              { icon: "🏥", title: "Medicine & Clinics", text: "Booking, reminders, repeat visits — AI first-line works 24/7" },
              { icon: "👥", title: "HR & Recruiting", text: "Candidate screening, onboarding, knowledge base — bot handles 70% of volume" },
              { icon: "🛍", title: "E-commerce & Retail", text: "Leads from multiple channels, manager assignment, sales funnel" },
              { icon: "🏗", title: "Construction & Services", text: "Requests from messengers into a unified view with auto-routing" },
              { icon: "🎓", title: "EdTech & Training", text: "Leads from social media and bots — in CRM with funnel progress tracking" },
            ].map(niche => (
              <div key={niche.title} className="rounded-[14px] sm:rounded-[16px] p-4 sm:p-5 text-center" style={{ background: PURPLE_08, border: `1px solid ${PURPLE_13}` }}>
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{niche.icon}</div>
                <div className="font-bold text-xs sm:text-sm text-white mb-1 sm:mb-1.5 [font-family:'Geologica',Helvetica]">{niche.title}</div>
                <div className="text-xs text-white/50 leading-relaxed [font-family:'Geologica',Helvetica]">{niche.text}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Platform features */}
        <Section title="Platform capabilities" delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FeaturePill icon="🔒">Isolated operator circuit — no direct access to account credentials. Access revoked instantly on offboarding.</FeaturePill>
            <FeaturePill icon="👤">User API, not a bot — the client sees a real human profile. Full Telegram feature support: edits, voice, reactions.</FeaturePill>
            <FeaturePill icon="🗂">Unified inbox — all requests from Telegram, WhatsApp, Instagram in one feed with smart queue. Nothing lost, nothing duplicated.</FeaturePill>
            <FeaturePill icon="📈">Full control — every manager action logged. Efficiency analytics. Real-time operator KPIs. Conversations linked to deals.</FeaturePill>
          </div>
        </Section>

        {/* WHY OMNI CRM */}
        <WhyCrmSection />

        {/* CTA */}
        <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden p-6 sm:p-12 text-center"
          style={{ background: `linear-gradient(135deg, ${PURPLE_08} 0%, rgba(6,12,36,0.8) 100%)`, border: `1px solid ${PURPLE_20}`, boxShadow: `0 0 60px ${PURPLE_08}` }}
        >
          <p className="text-xs font-light uppercase tracking-widest mb-3 sm:mb-4 [font-family:'Geologica',Helvetica]" style={{ color: PURPLE }}>Next step</p>
          <h2 className="[font-family:'Geologica',Helvetica] font-bold text-white text-xl sm:text-3xl leading-tight mb-3">
            Show us how it works now —<br className="hidden sm:block" /> we'll map it out in 20 minutes
          </h2>
          <p className="text-white/50 text-sm sm:text-base mb-6 sm:mb-8 [font-family:'Geologica',Helvetica] font-light max-w-[480px] mx-auto">
            No pitch, no obligation. Just a look at your current process and what's possible.
          </p>
          <a
            href="https://t.me/danil_alto"
            className="inline-flex items-center gap-3 font-semibold text-sm sm:text-base rounded-[12px] sm:rounded-[14px] px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 [font-family:'Geologica',Helvetica]"
            style={{ background: PURPLE, color: "#fff", boxShadow: `0 0 40px ${PURPLE_20}` }}
          >
            Write to us
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </a>
        </div>

      </main>

      <footer className="border-t border-white/5 py-5 text-center text-xs text-white/25 [font-family:'Geologica',Helvetica] font-light">
        © aihub.works
      </footer>
    </div>
  );
}
