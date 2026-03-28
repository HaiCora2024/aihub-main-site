import { useEffect, useRef, useState } from "react";

import { useLanguage } from "../../../../src/i18n/LanguageContext";

/* ── Animated value hook ── */
function useAnimatedValue(target: number, duration = 1200, delay = 0, active = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!active) {
      setValue(0);
      return;
    }

    let start: number | null = null;
    let timeout: ReturnType<typeof setTimeout>;

    const animate = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, active]);

  return value;
}

/* ── Intersection-based appear trigger ── */
function useAppear(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return { ref, visible };
}

/* ── CircleGauge ── */
const CircleGauge = ({
  percent,
  color,
  size = 65,
  animDelay = 0,
  active = true,
}: {
  percent: number;
  color: string;
  size?: number;
  animDelay?: number;
  active?: boolean;
}) => {
  const animatedPercent = useAnimatedValue(percent, 1400, animDelay, active);
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (animatedPercent / 100) * circumference;
  const startAngle = -90;
  const displayLabel = `${Math.round(animatedPercent)}%`;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(72,73,73,1)" strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={0} strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span
        className="absolute font-semibold text-center whitespace-nowrap [font-family:'Manrope',Helvetica]"
        style={{ color, fontSize: size > 60 ? 22 : 18, lineHeight: "1.2" }}
      >
        {displayLabel}
      </span>
    </div>
  );
};

/* ── SpeedometerGauge ── */
const SpeedometerGauge = ({
  value,
  max,
  color,
  size = 65,
  animDelay = 0,
  active = true,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
  animDelay?: number;
  active?: boolean;
}) => {
  const animatedValue = useAnimatedValue(value, 1400, animDelay, active);
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const arcDeg = 240;
  const startDeg = 150;
  const arcLength = (arcDeg / 360) * 2 * Math.PI * radius;
  const fraction = Math.min(animatedValue / max, 1);
  const filledLength = fraction * arcLength;

  const needleAngle = startDeg + fraction * arcDeg;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = radius - 8;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  const displayNum = animatedValue < 10
    ? (Math.round(animatedValue * 10) / 10).toString()
    : Math.round(animatedValue).toString();

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke="rgba(72,73,73,1)" strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${2 * Math.PI * radius - arcLength}`}
          strokeDashoffset={0}
          transform={`rotate(${startDeg} ${cx} ${cy})`}
          strokeLinecap="round"
        />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${filledLength} ${2 * Math.PI * radius - filledLength}`}
          strokeDashoffset={0}
          transform={`rotate(${startDeg} ${cx} ${cy})`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <line
          x1={cx} y1={cy} x2={nx} y2={ny}
          stroke={color} strokeWidth={2} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
        <circle cx={cx} cy={cy} r={3} fill={color} />
      </svg>
      <span
        className="absolute font-semibold whitespace-nowrap [font-family:'Geologica',Helvetica]"
        style={{ color, fontSize: 10, lineHeight: "1", top: size * 0.72 }}
      >
        {displayNum}
      </span>
    </div>
  );
};

/* ── Shared styles ── */
const CARD_BASE = "card-item relative flex items-center gap-2.5 bg-[#060c2499] rounded-[30px] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] transition-all duration-300 p-4";

const BORDER: Record<string, string> = {
  purple: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(102deg,rgba(191,91,243,1)_0%,rgba(191,91,243,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
  red: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(129deg,rgba(255,70,58,1)_0%,rgba(255,70,58,0)_78%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
  green: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(135deg,rgba(8,208,112,1)_0%,rgba(8,208,112,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
  orange: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(100deg,rgba(254,138,4,1)_0%,rgba(254,138,4,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
  teal: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(109deg,rgba(99,230,225,1)_0%,rgba(99,230,225,0.1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
  yellow: "before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-[30px] before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none",
};

/* ── Animated Card wrapper ── */
const AnimCard = ({
  className,
  delay,
  children,
  href,
}: {
  className: string;
  delay: number;
  children: (visible: boolean) => React.ReactNode;
  href?: string;
}) => {
  const { ref, visible } = useAppear(delay);
  const sharedStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
    transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
  };
  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`${className} cursor-pointer`}
        style={sharedStyle}
      >
        {children(visible)}
      </a>
    );
  }
  return (
    <div
      ref={ref}
      className={className}
      style={sharedStyle}
    >
      {children(visible)}
    </div>
  );
};

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const texts = t.cases.cardTexts;

  interface CardDef {
    area: string;
    glow: string;
    border: string;
    delay: number;
    gaugeDelay: number;
    content: (gd: number, active: boolean) => JSX.Element;
    href?: string;
  }

  const cards: CardDef[] = [
    {
      area: "cases-c1", glow: "card-glow-purple", border: "purple", delay: 0, gaugeDelay: 300,
      href: `${import.meta.env.BASE_URL}cases/real-estate.html`,
      content: (gd, active) => (
        <>
          <CircleGauge percent={82} color="rgba(191,91,243,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[0]}</p>
        </>
      ),
    },
    {
      area: "cases-c4", glow: "card-glow-red", border: "red", delay: 120, gaugeDelay: 420,
      href: `${import.meta.env.BASE_URL}cases/order-processing-1c.html`,
      content: () => (
        <>
          <img className="h-[65px] w-[69px] shrink-0" alt="Frame" src="https://c.animaapp.com/Raa0F4h8/img/frame-1948760005.svg" />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[1]}</p>
        </>
      ),
    },
    {
      area: "cases-c10", glow: "card-glow-green", border: "green", delay: 200, gaugeDelay: 500,
      href: `${import.meta.env.BASE_URL}cases/partner-kpi.html`,
      content: (gd, active) => (
        <>
          <CircleGauge percent={61} color="rgba(8,208,112,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[2]}</p>
        </>
      ),
    },
    {
      area: "cases-c11", glow: "card-glow-orange", border: "orange", delay: 320, gaugeDelay: 620,
      href: `${import.meta.env.BASE_URL}cases/kyb-screening.html`,
      content: (gd, active) => (
        <>
          <SpeedometerGauge value={60} max={75} color="rgba(254,138,4,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[3]}</p>
        </>
      ),
    },
    {
      area: "cases-c9", glow: "card-glow-orange", border: "orange", delay: 180, gaugeDelay: 480,
      href: `${import.meta.env.BASE_URL}cases/robotics-fleet.html`,
      content: (gd, active) => (
        <>
          <CircleGauge percent={80} color="rgba(254,138,4,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[4]}</p>
        </>
      ),
    },
    {
      area: "cases-c7", glow: "card-glow-teal", border: "teal", delay: 400, gaugeDelay: 700,
      href: `${import.meta.env.BASE_URL}cases/telegram-sentiment.html`,
      content: (gd, active) => (
        <>
          <SpeedometerGauge value={7} max={10} color="rgba(99,230,225,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[5]}</p>
        </>
      ),
    },
    {
      area: "cases-c8", glow: "card-glow-yellow", border: "yellow", delay: 500, gaugeDelay: 800,
      href: `${import.meta.env.BASE_URL}cases/clinic-voice-ai.html`,
      content: (gd, active) => (
        <>
          <CircleGauge percent={30} color="rgba(255,212,9,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[6]}</p>
        </>
      ),
    },
    {
      area: "cases-c6", glow: "card-glow-teal", border: "teal", delay: 350, gaugeDelay: 650,
      href: `${import.meta.env.BASE_URL}cases/claude-code-landing.html`,
      content: (gd, active) => (
        <>
          <SpeedometerGauge value={80} max={100} color="rgba(99,230,225,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[7]}</p>
        </>
      ),
    },
    {
      area: "cases-c5", glow: "card-glow-purple", border: "purple", delay: 280, gaugeDelay: 580,
      href: `${import.meta.env.BASE_URL}cases/ad-moderation.html`,
      content: (gd, active) => (
        <>
          <SpeedometerGauge value={10} max={12} color="rgba(191,91,243,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[8]}</p>
        </>
      ),
    },
    {
      area: "cases-c3", glow: "card-glow-green", border: "green", delay: 450, gaugeDelay: 750,
      content: (gd, active) => (
        <>
          <SpeedometerGauge value={20} max={25} color="rgba(8,208,112,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[9]}</p>
        </>
      ),
    },
    {
      area: "cases-c2", glow: "card-glow-red", border: "red", delay: 550, gaugeDelay: 850,
      href: `${import.meta.env.BASE_URL}cases/hotel-concierge.html`,
      content: (gd, active) => (
        <>
          <CircleGauge percent={42} color="rgba(255,70,58,1)" animDelay={gd} active={active} />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[10]}</p>
        </>
      ),
    },
    {
      area: "cases-c12", glow: "card-glow-orange", border: "orange", delay: 600, gaugeDelay: 900,
      href: `${import.meta.env.BASE_URL}cases/bank-360-review.html`,
      content: () => (
        <>
          <img className="h-[65px] w-[65px] shrink-0" alt="Frame" src="https://c.animaapp.com/Raa0F4h8/img/frame-1948760005-2.svg" />
          <p className="font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica]">{texts[11]}</p>
        </>
      ),
    },
  ];

  return (
    <div className="w-full" data-model-id="316:6331">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-5 min-[1200px]:px-3 py-8 sm:py-12">

        {/* Header */}
        <header className="relative mb-8 sm:mb-10">
          <img className="w-full max-w-[646px] h-auto" alt="Union" src="https://c.animaapp.com/Raa0F4h8/img/union.svg" />
          <h1 className="mt-2 [font-family:'Geologica',Helvetica] font-bold text-j-0jl3o text-2xl sm:text-[32px] leading-tight">{t.cases.title}</h1>
        </header>

        {/* Cards grid */}
        <div className="cases-grid">
          {cards.map((c) => (
            <AnimCard
              key={c.area}
              className={`${c.area} ${c.glow} ${CARD_BASE} ${BORDER[c.border]}`}
              delay={c.delay}
              href={c.href}
            >
              {(visible) => c.content(c.gaugeDelay, visible)}
            </AnimCard>
          ))}
        </div>

        {/* Download button */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <div className="cta-frame">
            <button type="button" className="glow-button glow-button--orange absolute left-5 right-5 top-5 z-10 flex h-20 items-center justify-center gap-2.5 rounded-[600px] bg-j-0jl3o px-10 py-5 shadow-[0px_2px_20px_#fe8a0466,inset_0px_8px_12px_#ffffff4c] cursor-pointer transition-all duration-300 active:scale-[0.98] font-semibold text-black-100 text-base text-center leading-[17.6px] whitespace-nowrap [font-family:'Geologica',Helvetica]">
              {t.cases.downloadBtn}
            </button>
            <img className="absolute left-0 top-0 h-full w-full pointer-events-none hidden min-[1200px]:block" alt="Rectangle" src="https://c.animaapp.com/Raa0F4h8/img/rectangle-12.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};
