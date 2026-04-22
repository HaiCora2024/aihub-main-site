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
      className="relative flex flex-col items-center justify-center p-6 rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${color08}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${color80} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        className="[font-family:'Geologica',Helvetica] font-bold leading-none mb-2"
        style={{ fontSize: "clamp(22px,3.5vw,36px)", color }}
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
        boxShadow: `inset 0 0 40px ${PURPLE_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`,
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
      <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
      <span>{children}</span>
    </li>
  );
}

function FeaturePill({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-[#ffffff08]" style={{ border: `1px solid ${PURPLE_13}` }}>
      {icon && <span className="text-base">{icon}</span>}
      {!icon && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PURPLE }} />}
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
  const { ref, visible } = useReveal(0.25);
  const [step, setStep] = useState(-1);
  const [crmVisible, setCrmVisible] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;
    TG_MSGS.forEach((msg, i) => {
      setTimeout(() => {
        setStep(i);
        if (msg.trigger) {
          setTimeout(() => setCrmVisible(true), 500);
        }
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
    <div ref={ref} className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{ boxShadow: `inset 0 0 40px ${PURPLE_06}`, opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}
    >
      <div className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{ background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
      />
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-2">How it works</h2>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/50 text-sm mb-6">A client sends a message in a group chat. The system extracts the deal and routes it to an operator — without noise.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Telegram panel */}
        <div className="rounded-[16px] bg-[#060c24] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-white/40 [font-family:'Geologica',Helvetica]">Telegram — OTC Working Group</span>
          </div>
          <div className="p-3 flex flex-col gap-2 min-h-[260px]">
            {TG_MSGS.map((msg, i) => (
              <div key={i} className="flex items-start gap-2"
                style={{ opacity: step >= i ? 1 : 0, transform: step >= i ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 flex-col"
                  style={{ background: msg.highlight ? PURPLE_13 : "rgba(255,255,255,0.06)", color: msg.highlight ? PURPLE : MUTED }}
                >
                  {msg.init}
                </div>
                <div className="rounded-[8px] px-2.5 py-1.5 text-xs leading-[1.45]"
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
        <div className="rounded-[16px] bg-[#060c24] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-white/40 [font-family:'Geologica',Helvetica]">CRM — Operator view</span>
          </div>
          <div className="p-4 min-h-[260px]">
            <div style={{ opacity: crmVisible ? 1 : 0, transition: "opacity 0.4s ease 0.2s" }}>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3"
                style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
                New deal
              </div>
              <div className="text-white font-bold text-base mb-4 [font-family:'Geologica',Helvetica]">OTC Exchange #2841</div>
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
                  <span className="text-white/40 min-w-[80px] [font-family:'Geologica',Helvetica]">{row.k}</span>
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
    <div ref={ref} className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-8 sm:p-12 text-center overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease", boxShadow: `inset 0 0 40px ${PURPLE_06}` }}
    >
      <div className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{ background: `linear-gradient(129deg, ${PURPLE} 0%, transparent 70%)`, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
      />
      <p className="text-xs font-light uppercase tracking-widest text-white/40 mb-8 [font-family:'Geologica',Helvetica]">Real case — SLA routing for operators</p>
      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-5">
        <div className="text-center">
          <div className="font-black leading-none [font-family:'Geologica',Helvetica]" style={{ fontSize: "clamp(56px,10vw,104px)", color: "rgba(255,70,58,1)" }}>4</div>
          <div className="text-sm text-white/40 mt-1">min</div>
        </div>
        <div className="text-2xl text-white/30 pb-5">→</div>
        <div className="text-center">
          <div className="font-black leading-none [font-family:'Geologica',Helvetica]" style={{ fontSize: "clamp(56px,10vw,104px)", color: GREEN }}>40</div>
          <div className="text-sm text-white/40 mt-1">sec</div>
        </div>
      </div>
      <p className="text-sm sm:text-base text-white/50 max-w-[440px] mx-auto [font-family:'Geologica',Helvetica] font-light">
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
      <div className="rounded-[20px] overflow-hidden" style={{ background: "#0a1030", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs text-white/40 [font-family:'Geologica',Helvetica]">CRM Space — Engagement Board · Leads</span>
        </div>
        <div className="flex" style={{ minHeight: 340 }}>
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col py-3 w-[180px] shrink-0" style={{ background: "rgba(0,0,0,0.2)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            {[{ icon: "🏠", label: "Home" }, { icon: "💬", label: "Chats" }, { icon: "📚", label: "Knowledge" }, { icon: "⚙️", label: "AI Settings" }, { icon: "📊", label: "CRM Space", active: true }].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 px-4 py-2.5 text-xs"
                style={{ color: item.active ? PURPLE : "rgba(255,255,255,0.35)", background: item.active ? PURPLE_08 : "transparent", borderLeft: `2px solid ${item.active ? PURPLE : "transparent"}` }}
              >
                <span>{item.icon}</span><span className="[font-family:'Geologica',Helvetica]">{item.label}</span>
              </div>
            ))}
          </div>
          {/* Main */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex gap-1 mb-4">
              {["Leads", "Deals", "Patients"].map((tab, i) => (
                <div key={tab} className="px-3 py-1.5 rounded-md text-xs [font-family:'Geologica',Helvetica]"
                  style={{ background: i === 0 ? PURPLE_08 : "transparent", color: i === 0 ? PURPLE : "rgba(255,255,255,0.35)", border: i === 0 ? `1px solid ${PURPLE_20}` : "1px solid transparent", fontWeight: i === 0 ? 600 : 400 }}
                >
                  {tab}
                </div>
              ))}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { num: "1 122", label: "All leads", color: "rgba(255,255,255,0.85)" },
                { num: "1 022", label: "Bot Active / New", color: PURPLE },
                { num: "23", label: "Converted", color: GREEN },
                { num: "26", label: "Call Later", color: "rgba(255,212,9,1)" },
              ].map(st => (
                <div key={st.label} className="rounded-[10px] p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-bold text-lg leading-none mb-1 [font-family:'Geologica',Helvetica]" style={{ color: st.color }}>{st.num}</div>
                  <div className="text-[10px] text-white/40 leading-tight [font-family:'Geologica',Helvetica]">{st.label}</div>
                </div>
              ))}
            </div>
            {/* Kanban */}
            <div className="grid grid-cols-4 gap-2 overflow-x-auto">
              {kanbanCols.map(col => (
                <div key={col.head} className="min-w-[120px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-white/40 [font-family:'Geologica',Helvetica]">{col.head}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded text-white/50 [font-family:'Geologica',Helvetica]" style={{ background: "rgba(255,255,255,0.06)" }}>{col.count}</span>
                  </div>
                  {col.cards.map(card => (
                    <div key={card.name} className="rounded-[8px] p-2.5 mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="text-xs font-bold text-white mb-1.5 [font-family:'Geologica',Helvetica]">{card.name}</div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {card.badges.map(b => (
                          <span key={b.label} className="text-[9px] font-semibold px-1.5 py-0.5 rounded [font-family:'Geologica',Helvetica]"
                            style={{ background: badgeColors[b.cl].bg, color: badgeColors[b.cl].color }}
                          >{b.label}</span>
                        ))}
                      </div>
                      <div className="text-[10px] text-white/30 [font-family:'Geologica',Helvetica]">{card.time}</div>
                    </div>
                  ))}
                </div>
              ))}
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
      <div className="rounded-[20px] overflow-hidden" style={{ background: "#0a1030", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs text-white/40 [font-family:'Geologica',Helvetica]">Chats — AI Assistant in action</span>
        </div>
        <div className="flex" style={{ minHeight: 320 }}>
          {/* Chat list */}
          <div className="hidden sm:flex flex-col w-[220px] shrink-0 py-2" style={{ background: "rgba(0,0,0,0.15)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 [font-family:'Geologica',Helvetica]">Chat Sessions</span>
            </div>
            {[
              { name: "yaninazusko", preview: "Calling the admin now...", time: "00:57", active: true },
              { name: "Pi... (Instagram)", preview: "Yes, I'm online...", time: "02:35" },
              { name: "Instagram_126...", preview: "<Content>", time: "23:59" },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-2.5 px-3 py-2.5"
                style={{ background: item.active ? PURPLE_08 : "transparent", borderLeft: `2px solid ${item.active ? PURPLE : "transparent"}` }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 [font-family:'Geologica',Helvetica]"
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
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div className="text-sm font-bold text-white [font-family:'Geologica',Helvetica]">User: yaninazusko</div>
                <div className="text-[11px] text-white/35 [font-family:'Geologica',Helvetica]">Created: 05.02.2026, 00:55 · 1 day ago</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-[6px] [font-family:'Geologica',Helvetica]" style={{ background: PURPLE_08, color: PURPLE }}>Telegram Mini-App</span>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {/* AI message */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: GREEN_08, color: GREEN }}>🤖</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed max-w-[80%] [font-family:'Geologica',Helvetica]"
                  style={{ background: GREEN_08, border: "1px solid rgba(8,208,112,0.2)" }}
                >
                  <div className="text-[10px] font-bold mb-1 uppercase tracking-wide" style={{ color: GREEN }}>AI ASSISTANT</div>
                  Good day! I'm Medina, AI assistant at PaNa Medica. I can help with general questions. If you'd like to speak with an administrator — I'll get one for you. For urgent pain, call: <strong>+48 511 111 595</strong>
                </div>
              </div>
              {/* Client message */}
              <div className="flex flex-row-reverse items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 [font-family:'Geologica',Helvetica] font-bold" style={{ background: "rgba(255,100,100,0.15)", color: "rgba(255,150,140,1)" }}>U</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed max-w-[80%] text-white/80 [font-family:'Geologica',Helvetica]"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  What's the cost of tooth restoration with a post and crown?
                </div>
              </div>
              {/* AI message 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: GREEN_08, color: GREEN }}>🤖</div>
                <div className="rounded-[10px] px-3 py-2.5 text-xs leading-relaxed max-w-[80%] [font-family:'Geologica',Helvetica]"
                  style={{ background: GREEN_08, border: "1px solid rgba(8,208,112,0.2)" }}
                >
                  <div className="text-[10px] font-bold mb-1 uppercase tracking-wide" style={{ color: GREEN }}>AI ASSISTANT</div>
                  I'm getting an administrator for you now. They'll connect as soon as available. Thank you for your patience! 🌹
                </div>
              </div>
            </div>
            <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.1)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] text-xs text-white/30 [font-family:'Geologica',Helvetica]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span>Type your message...</span>
                <button className="text-xs font-semibold px-2.5 py-1 rounded-[5px] text-black cursor-default" style={{ background: PURPLE }}>Send</button>
              </div>
            </div>
          </div>
        </div>
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
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p className="[font-family:'Geologica',Helvetica] font-light text-sm uppercase tracking-widest mb-3" style={{ color: PURPLE }}>
            Our own product
          </p>
          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            OMNI-Agentic CRM —<br className="hidden sm:block" /> from messenger chaos to a managed system
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[720px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(191,91,243,0.9)" }}
          >
            Clients reach out from Facebook ads, Instagram DMs, WhatsApp, Telegram bots — wherever you run campaigns. Every inbound lead lands in a different place. We built the system that captures all of it and turns scattered requests into a controllable sales pipeline.
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard value="40 sec" label="Average operator response time" delay={0} color={GREEN} />
          <KpiCard value="0%" label="Deals lost after go-live" delay={80} />
          <KpiCard value="TG + WA" label="+ Instagram in one unified inbox" delay={160} />
          <KpiCard value="24/7" label="AI first-line handles initial requests" delay={240} />
        </div>

        {/* The problem */}
        <Section title="The problem" delay={0}>
          <ul className="space-y-3">
            <BulletItem>Operators drown in group chats — with 10 people in a channel, nobody knows whose client is whose or what was promised</BulletItem>
            <BulletItem>Conversation history lost when a client switches channels — they messaged in Telegram, continued in WhatsApp, context is gone</BulletItem>
            <BulletItem>No way to control a remote team — operators in another country, no metrics, no logs, no visibility into what's happening</BulletItem>
            <BulletItem>Account credentials live with operators — an employee leaves and takes the client database access with them</BulletItem>
            <BulletItem>No data means no decisions — how many deals fell through? Where's the bottleneck? Unknown</BulletItem>
          </ul>
        </Section>

        {/* How it works — animated demo */}
        <DemoSection />

        {/* Metric */}
        <MetricBlock />

        {/* Real system — CRM mockup */}
        <Section title="In production at a medical network" delay={0}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm sm:text-base leading-relaxed mb-6">
            Clinics were receiving requests through Instagram and messengers. The AI assistant handles initial contact and passes only qualified leads to the administrator.
          </p>
          <CrmMockup />
        </Section>

        {/* Chat mockup */}
        <Section title="AI assistant in action" delay={60}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm sm:text-base leading-relaxed mb-6">
            The client sees a live human-named profile. The AI handles first-line questions and escalates to a human operator when needed.
          </p>
          <ChatMockup />
        </Section>

        {/* Who it works for */}
        <Section title="Works across industries" delay={0}>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm mb-6">Anywhere a team works in messengers and loses leads in the noise.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: "💱", title: "Fintech & Exchange", text: "OTC desk, P2P, crypto services — isolated operator circuit" },
              { icon: "🏥", title: "Medicine & Clinics", text: "Booking, reminders, repeat visits — AI first-line works 24/7" },
              { icon: "👥", title: "HR & Recruiting", text: "Candidate screening, onboarding, knowledge base — bot handles 70% of volume" },
              { icon: "🛍", title: "E-commerce & Retail", text: "Leads from multiple channels, manager assignment, sales funnel" },
              { icon: "🏗", title: "Construction & Services", text: "Requests from messengers into a unified view with auto-routing" },
              { icon: "🎓", title: "EdTech & Training", text: "Leads from social media and bots — in CRM with funnel progress tracking" },
            ].map(niche => (
              <div key={niche.title} className="rounded-[16px] p-5 text-center" style={{ background: PURPLE_08, border: `1px solid ${PURPLE_13}` }}>
                <div className="text-2xl mb-2">{niche.icon}</div>
                <div className="font-bold text-sm text-white mb-1.5 [font-family:'Geologica',Helvetica]">{niche.title}</div>
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

        {/* How to start */}
        <Section title="Three steps to go live" delay={0}>
          <div className="flex flex-col gap-6 mt-2 relative">
            <div className="absolute left-[19px] top-10 bottom-10 w-0.5" style={{ background: `linear-gradient(to bottom, ${PURPLE}, transparent)` }} />
            {[
              { n: 1, title: "We map your process", text: "How a deal flows from the first message to close. We collect criteria, triggers, and roles. 20–40 minutes." },
              { n: 2, title: "We build the plan and show a demo", text: "Concrete timeline and pricing. Demo on your data — so you see the result before development starts." },
              { n: 3, title: "We build and launch", text: "Into production. With support at every stage." },
            ].map(step => (
              <div key={step.n} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0 relative z-10 [font-family:'Geologica',Helvetica]"
                  style={{ background: PURPLE, color: "#fff" }}
                >
                  {step.n}
                </div>
                <div className="pt-1">
                  <div className="font-semibold text-white text-base mb-1 [font-family:'Geologica',Helvetica]">{step.title}</div>
                  <div className="text-sm text-white/55 leading-relaxed [font-family:'Geologica',Helvetica]">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div className="relative rounded-[24px] overflow-hidden p-8 sm:p-12 text-center"
          style={{ background: `linear-gradient(135deg, ${PURPLE_08} 0%, rgba(6,12,36,0.8) 100%)`, border: `1px solid ${PURPLE_20}`, boxShadow: `0 0 60px ${PURPLE_08}` }}
        >
          <p className="text-xs font-light uppercase tracking-widest mb-4 [font-family:'Geologica',Helvetica]" style={{ color: PURPLE }}>Next step</p>
          <h2 className="[font-family:'Geologica',Helvetica] font-bold text-white text-2xl sm:text-3xl leading-tight mb-3">
            Show us how it works now<br className="hidden sm:block" /> — we'll map it out in 20 minutes
          </h2>
          <p className="text-white/50 text-base mb-8 [font-family:'Geologica',Helvetica] font-light max-w-[480px] mx-auto">
            No pitch, no obligation. Just a look at your current process and what's possible.
          </p>
          <a
            href="https://t.me/danil_alto"
            className="inline-flex items-center gap-3 font-semibold text-base rounded-[14px] px-8 py-4 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 [font-family:'Geologica',Helvetica]"
            style={{ background: PURPLE, color: "#fff", boxShadow: `0 0 40px ${PURPLE_20}` }}
          >
            Write to us
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </a>
        </div>

      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/25 [font-family:'Geologica',Helvetica] font-light">
        © aihub.works
      </footer>
    </div>
  );
}
