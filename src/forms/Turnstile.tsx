import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./forms.css";

type Language = "en" | "ru";
type Status = "idle" | "loading" | "ready" | "error" | "expired";
type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export class BotCheckError extends Error {
  constructor(public code = "BOT_CHECK_FAILED") {
    super(code);
  }
}
export interface TurnstileHandle {
  activate: () => void;
  getToken: () => Promise<string | undefined>;
  reset: () => void;
}

const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      scriptPromise = null;
      reject(new BotCheckError("BOT_CHECK_UNAVAILABLE"));
    };
    const timer = window.setTimeout(fail, 10000);
    script.addEventListener("error", fail, { once: true });
    script.addEventListener(
      "load",
      () => {
        clearTimeout(timer);
        if (window.turnstile) resolve(window.turnstile);
        else fail();
      },
      { once: true },
    );
    document.head.appendChild(script);
  });
  return scriptPromise;
}

const copy = {
  en: {
    loading: "Checking you can send this request…",
    ready: "Security check complete.",
    error:
      "The security check could not be completed. Your details are still here.",
    expired: "The security check has expired. Please run it again.",
    retry: "Retry security check",
    label: "Security check",
  },
  ru: {
    loading: "Проверяем возможность отправки…",
    ready: "Проверка безопасности пройдена.",
    error:
      "Не удалось выполнить проверку безопасности. Введённые данные остались на странице.",
    expired: "Время проверки истекло. Пройдите её ещё раз.",
    retry: "Повторить проверку",
    label: "Проверка безопасности",
  },
};

export const Turnstile = forwardRef<
  TurnstileHandle,
  {
    action: "contact_submit" | "shop_submit";
    lang: Language;
  }
>(function Turnstile({ action, lang }, ref) {
  const [active, setActive] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<{ api: TurnstileApi; id: string } | null>(null);
  const token = useRef("");
  const currentStatus = useRef<Status>("idle");
  const waiter = useRef<{
    promise: Promise<string>;
    resolve: (value: string) => void;
    reject: (error: BotCheckError) => void;
    timer: number;
  } | null>(null);
  const updateStatus = (value: Status) => {
    currentStatus.current = value;
    setStatus(value);
  };
  const rejectWaiter = (code = "BOT_CHECK_FAILED") => {
    const pending = waiter.current;
    waiter.current = null;
    if (pending) {
      clearTimeout(pending.timer);
      pending.reject(new BotCheckError(code));
    }
  };
  const reset = () => {
    if (!siteKey) return;
    token.current = "";
    rejectWaiter();
    if (widget.current) {
      updateStatus("loading");
      widget.current.api.reset(widget.current.id);
    } else if (active) {
      updateStatus("loading");
      setGeneration((value) => value + 1);
    }
  };

  useImperativeHandle(ref, () => ({
    activate() {
      if (siteKey) setActive(true);
    },
    reset,
    async getToken() {
      if (!siteKey) return undefined;
      setActive(true);
      if (token.current) return token.current;
      if (waiter.current) return waiter.current.promise;
      if (["error", "expired"].includes(currentStatus.current)) reset();
      if (token.current) return token.current;
      let resolve!: (value: string) => void;
      let reject!: (error: BotCheckError) => void;
      const promise = new Promise<string>((yes, no) => {
        resolve = yes;
        reject = no;
      });
      const timer = window.setTimeout(() => {
        token.current = "";
        updateStatus("error");
        rejectWaiter("BOT_CHECK_UNAVAILABLE");
      }, 60000);
      waiter.current = { promise, resolve, reject, timer };
      return promise;
    },
  }));

  useEffect(() => {
    if (!active || !siteKey) return;
    let alive = true;
    updateStatus("loading");
    void loadScript()
      .then((api) => {
        if (!alive || !container.current) return;
        const id = api.render(container.current, {
          sitekey: siteKey,
          action,
          language: lang,
          theme: "dark",
          size: "flexible",
          appearance: "interaction-only",
          "response-field": false,
          callback: (value: string) => {
            if (!alive) return;
            token.current = value;
            updateStatus("ready");
            const pending = waiter.current;
            waiter.current = null;
            if (pending) {
              clearTimeout(pending.timer);
              pending.resolve(value);
            }
          },
          "expired-callback": () => {
            if (!alive) return;
            token.current = "";
            updateStatus("expired");
            rejectWaiter();
          },
          "timeout-callback": () => {
            if (!alive) return;
            token.current = "";
            updateStatus("error");
            rejectWaiter("BOT_CHECK_UNAVAILABLE");
          },
          "error-callback": () => {
            if (!alive) return true;
            token.current = "";
            updateStatus("error");
            rejectWaiter("BOT_CHECK_UNAVAILABLE");
            return true;
          },
        });
        widget.current = { api, id };
      })
      .catch(() => {
        if (!alive) return;
        updateStatus("error");
        rejectWaiter("BOT_CHECK_UNAVAILABLE");
      });
    return () => {
      alive = false;
      token.current = "";
      rejectWaiter();
      if (widget.current) {
        widget.current.api.remove(widget.current.id);
        widget.current = null;
      }
    };
    // Widget callbacks use refs so they do not recreate the challenge on form edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, action, lang, generation]);

  if (!siteKey || !active) return null;
  const t = copy[lang];
  return (
    <div className="form-security" aria-label={t.label}>
      <div ref={container} className="form-security__widget" />
      <p
        role="status"
        aria-live="polite"
        className={status === "ready" ? "form-security__sr" : undefined}
      >
        {status === "error"
          ? t.error
          : status === "expired"
            ? t.expired
            : status === "ready"
              ? t.ready
              : t.loading}
      </p>
      {(status === "error" || status === "expired") && (
        <button type="button" onClick={reset}>
          {t.retry}
        </button>
      )}
    </div>
  );
});
