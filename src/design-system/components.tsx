import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export type Accent =
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "purple"
  | "cyan"
  | "red";
export type CtaTone = Extract<Accent, "green" | "blue" | "yellow" | "orange">;
export type DemoState =
  | "default"
  | "hover"
  | "focus"
  | "pressed"
  | "loading"
  | "disabled";
type BoxProps = HTMLAttributes<HTMLDivElement>;
const cx = (...names: (string | undefined | false)[]) =>
  names.filter(Boolean).join(" ");

export function PageContainer({ className, ...props }: BoxProps) {
  return <div className={cx("aihub-container", className)} {...props} />;
}
export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx("aihub-section", className)} {...props} />;
}
export function SectionHeading({
  eyebrow,
  children,
  description,
  tone = "green",
  level = 2,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  eyebrow?: string;
  description?: ReactNode;
  tone?: Accent;
  level?: 1 | 2 | 3;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <header className="aihub-heading" data-tone={tone}>
      {eyebrow && (
        <span className="aihub-eyebrow">
          <GlowDot tone={tone} />
          {eyebrow}
        </span>
      )}
      <Tag
        className={cx(
          level === 1 ? "aihub-hero-title" : "aihub-section-title",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
      {description && <p className="aihub-lead">{description}</p>}
    </header>
  );
}
export function Grid({
  columns = 3,
  className,
  ...props
}: BoxProps & { columns?: 2 | 3 | 4 }) {
  return (
    <div
      className={cx("aihub-grid", className)}
      data-columns={columns}
      {...props}
    />
  );
}
export function Split({ className, ...props }: BoxProps) {
  return <div className={cx("aihub-split", className)} {...props} />;
}

type ActionProps = {
  tone?: CtaTone;
  compact?: boolean;
  loading?: boolean;
  demoState?: DemoState;
  children: ReactNode;
  className?: string;
};
export type ButtonProps = ActionProps &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
        disabled?: boolean;
      })
  );
export function Button(props: ButtonProps) {
  const {
    tone = "green",
    compact,
    loading,
    demoState = "default",
    className,
    children,
    disabled,
    ...native
  } = props;
  const busy = loading || demoState === "loading";
  const inactive = disabled || busy || demoState === "disabled";
  const common = {
    className: cx(
      "aihub-button",
      compact && "aihub-button--compact",
      className,
    ),
    "data-tone": tone,
    "data-state": demoState,
    "aria-busy": busy || undefined,
  };
  const content = (
    <>
      {busy && <span className="aihub-spinner" aria-hidden="true" />}
      <span>{children}</span>
    </>
  );
  if (typeof native.href === "string") {
    const link = native as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...link}
        {...common}
        aria-disabled={inactive || undefined}
        tabIndex={inactive ? -1 : link.tabIndex}
        onClick={(event) => {
          if (inactive) {
            event.preventDefault();
            return;
          }
          link.onClick?.(event);
        }}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      {...(native as ButtonHTMLAttributes<HTMLButtonElement>)}
      {...common}
      disabled={inactive}
    >
      {content}
    </button>
  );
}
export function CtaFrame({
  children,
  tone = "green",
  className,
  ...props
}: BoxProps & { tone?: CtaTone }) {
  return (
    <div
      className={cx("aihub-cta-frame", className)}
      data-tone={tone}
      {...props}
    >
      {children}
    </div>
  );
}
export function NavLink({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cx("aihub-nav-link", className)} {...props} />;
}
export function SurfaceCard({
  tone = "green",
  glow = true,
  border = "gradient",
  className,
  ...props
}: BoxProps & {
  tone?: Accent;
  glow?: boolean;
  border?: "gradient" | "solid" | "none";
}) {
  return (
    <div
      className={cx("aihub-card", className)}
      data-tone={tone}
      data-glow={glow}
      data-border={border}
      {...props}
    />
  );
}
export function Badge({
  tone = "green",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Accent }) {
  return (
    <span
      className={cx("aihub-badge", className)}
      data-tone={tone}
      {...props}
    />
  );
}
export function GlowDot({
  tone = "green",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Accent }) {
  return (
    <span
      {...props}
      className={cx("aihub-dot", className)}
      data-tone={tone}
      aria-hidden="true"
    />
  );
}
export function DecorativeGlow({
  tone = "green",
  className,
  ...props
}: BoxProps & { tone?: Accent }) {
  return (
    <div
      {...props}
      data-tone={tone}
      className={cx("aihub-decorative-glow", className)}
      aria-hidden="true"
    />
  );
}

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  tone?: Accent;
};
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, tone = "blue", id: suppliedId, className, ...props },
    ref,
  ) {
    const uid = useId();
    const id = suppliedId ?? uid;
    const message = error || hint;
    const described =
      [props["aria-describedby"], message && `${id}-message`]
        .filter(Boolean)
        .join(" ") || undefined;
    return (
      <div
        className={cx("aihub-field", className)}
        data-tone={error ? "red" : tone}
      >
        <label htmlFor={id}>
          {label}
          {props.required && (
            <span className="aihub-required" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        <input
          {...props}
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={described}
        />
        {message && (
          <span
            id={`${id}-message`}
            className={error ? "aihub-field-error" : "aihub-field-hint"}
          >
            {message}
          </span>
        )}
      </div>
    );
  },
);
export function FormMessage({
  kind = "info",
  className,
  ...props
}: BoxProps & { kind?: "info" | "error" | "success" }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cx("aihub-form-message", className)}
      data-tone={
        kind === "error" ? "red" : kind === "success" ? "green" : "blue"
      }
      {...props}
    />
  );
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}
function duration(node: HTMLElement, token: string, fallback: number) {
  const raw = getComputedStyle(node).getPropertyValue(token).trim();
  return parseFloat(raw) * (raw.endsWith("ms") ? 1 : 1000) || fallback;
}
const RevealReady = createContext(true);
export function Reveal({
  index = 0,
  className,
  style,
  children,
  ...props
}: BoxProps & { index?: number }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!visible || !ref.current) return;
    const wait = reduced
      ? 0
      : duration(ref.current, "--aihub-duration-reveal", 720) +
        index * duration(ref.current, "--aihub-stagger", 150);
    const timer = window.setTimeout(() => setReady(true), wait);
    return () => window.clearTimeout(timer);
  }, [index, reduced, visible]);
  return (
    <div
      {...props}
      ref={ref}
      className={cx("aihub-reveal", className)}
      data-visible={visible || reduced}
      style={{ ...style, "--aihub-reveal-index": index } as CSSProperties}
    >
      <RevealReady.Provider value={ready || reduced}>
        {children}
      </RevealReady.Provider>
    </div>
  );
}
function useAnimatedValue(value: number) {
  const { ref, visible } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const revealed = useContext(RevealReady);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!visible || !revealed || !ref.current) return;
    if (reduced) {
      setCurrent(value);
      return;
    }
    let frame = 0;
    let start: number | undefined;
    const ms = duration(ref.current, "--aihub-duration-metric", 1400);
    const tick = (now: number) => {
      start ??= now;
      const fraction = Math.min((now - start) / ms, 1);
      setCurrent(value * (1 - (1 - fraction) ** 3));
      if (fraction < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, revealed, reduced, value]);
  return { ref, current: reduced ? value : current };
}
export function Metric({
  value,
  suffix = "%",
  label,
  tone = "green",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  value: number;
  suffix?: string;
  label: string;
  tone?: Accent;
}) {
  const { ref, current } = useAnimatedValue(value);
  return (
    <div {...props} className={cx("aihub-metric", className)} data-tone={tone}>
      <span
        ref={ref}
        className="aihub-metric-number"
        role="img"
        aria-label={`${value}${suffix}`}
      >
        <span aria-hidden="true">
          {Math.round(current)}
          {suffix}
        </span>
      </span>
      <span className="aihub-muted">{label}</span>
    </div>
  );
}
export function ProgressRing({
  value,
  label,
  tone = "green",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  value: number;
  label: string;
  tone?: Accent;
}) {
  const bounded = Math.min(100, Math.max(0, value));
  const { ref, current } = useAnimatedValue(bounded);
  return (
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={`${label}: ${bounded}%`}
      className={cx("aihub-progress", className)}
      data-tone={tone}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="43" className="aihub-progress-track" />
        <circle
          cx="50"
          cy="50"
          r="43"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - current}
          className="aihub-progress-value"
        />
      </svg>
      <strong aria-hidden="true">{Math.round(current)}%</strong>
    </span>
  );
}
export function ChangeIndicator({
  children,
  direction = "up",
  tone = "green",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  direction?: "up" | "down";
  tone?: Accent;
}) {
  return (
    <span {...props} className={cx("aihub-change", className)} data-tone={tone}>
      <span aria-hidden="true">{direction === "up" ? "↗" : "↘"}</span>{" "}
      {children}
    </span>
  );
}
export function TimelineStep({
  number,
  title,
  children,
  tone = "yellow",
  className,
  ...props
}: BoxProps & { number: number; title: string; tone?: Accent }) {
  return (
    <div
      {...props}
      className={cx("aihub-timeline-step", className)}
      data-tone={tone}
    >
      <span className="aihub-step-number">
        {String(number).padStart(2, "0")}
      </span>
      <div>
        <h3>{title}</h3>
        <div className="aihub-muted">{children}</div>
      </div>
    </div>
  );
}
