import { useRef, useState, type FormEvent } from "react";

import { useLanguage } from "../../../../src/i18n/LanguageContext";
import { BotCheckError, Turnstile } from "../../../../src/forms/Turnstile";
import type { TurnstileHandle } from "../../../../src/forms/Turnstile";
import { newFormKey } from "../../../../src/forms/submission-key";

const CONTACT_API_URL = (import.meta.env.VITE_CONTACT_API_URL || "").replace(
  /\/$/,
  "",
);

type SubmitState = "idle" | "sending" | "success" | "error";
class ContactSubmitError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

export const Home = (): JSX.Element => {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [locked, setLocked] = useState(false);
  const [reviewRequired, setReviewRequired] = useState(false);
  const actionLock = useRef(false);
  const botCheck = useRef<TurnstileHandle>(null);
  const pending = useRef<{
    key: string;
    body: {
      name: string;
      email: string;
      phone: string;
      source: string;
      page: string;
      website: string;
    };
  } | null>(null);

  const statusText = {
    requiredName:
      lang === "ru" ? "Заполните поле имени." : "Please enter your name.",
    requiredEmail:
      lang === "ru" ? "Заполните поле e-mail." : "Please enter your e-mail.",
    invalidEmail:
      lang === "ru"
        ? "Введите корректный e-mail."
        : "Please enter a valid e-mail.",
    notConfigured:
      lang === "ru"
        ? "Форма временно недоступна: API ещё не настроен."
        : "The form is temporarily unavailable: API is not configured yet.",
    sending: lang === "ru" ? "Отправляем заявку..." : "Sending your request...",
    success:
      lang === "ru"
        ? "Спасибо. Заявка отправлена, мы свяжемся с вами."
        : "Thank you. Your request has been sent.",
    error:
      lang === "ru"
        ? "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую."
        : "Could not send the request. Please try again or contact us directly.",
    botCheckFailed:
      lang === "ru"
        ? "Не удалось выполнить проверку безопасности. Повторите проверку и отправку. Данные остались на странице."
        : "The security check could not be completed. Retry the check and send again. Your details are still here.",
    rate:
      lang === "ru"
        ? "Слишком много попыток. Повторите через 15 минут."
        : "Too many attempts. Please try again in 15 minutes.",
    uncertain:
      lang === "ru"
        ? "Не удалось подтвердить отправку. Данные сохранены на странице: можно повторить ту же заявку."
        : "We could not confirm delivery. Your details are still here; you can retry the same request.",
    review:
      lang === "ru"
        ? "Результат отправки требует проверки. Свяжитесь с нами по email и укажите примерное время обращения."
        : "We need to check the delivery result. Please email us with the approximate time of your request.",
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actionLock.current || reviewRequired) return;

    if (!name.trim()) {
      setSubmitState("error");
      setSubmitMessage(statusText.requiredName);
      return;
    }

    if (!email.trim()) {
      setSubmitState("error");
      setSubmitMessage(statusText.requiredEmail);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitState("error");
      setSubmitMessage(statusText.invalidEmail);
      return;
    }

    if (!CONTACT_API_URL) {
      setSubmitState("error");
      setSubmitMessage(statusText.notConfigured);
      return;
    }

    setSubmitState("sending");
    setSubmitMessage(statusText.sending);
    actionLock.current = true;
    const hadPending = !!pending.current;

    try {
      const token = await botCheck.current?.getToken();
      const submission = pending.current || {
        key: newFormKey(),
        body: {
          name,
          email,
          phone,
          source: "aihub-site",
          page: window.location.href,
          website,
        },
      };
      pending.current = submission;
      setLocked(true);
      const response = await fetch(`${CONTACT_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submission.key,
          ...(token ? { "X-Turnstile-Token": token } : {}),
        },
        body: JSON.stringify(submission.body),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true)
        throw new ContactSubmitError(
          typeof result?.error === "string" ? result.error : "NETWORK_UNKNOWN",
          response.status,
        );

      pending.current = null;
      setLocked(false);
      setName("");
      setEmail("");
      setPhone("");
      setSubmitState("success");
      setSubmitMessage(statusText.success);
    } catch (error) {
      setSubmitState("error");
      const code =
        error instanceof BotCheckError || error instanceof ContactSubmitError
          ? error.code
          : "NETWORK_UNKNOWN";
      const botFailure = ["BOT_CHECK_FAILED", "BOT_CHECK_UNAVAILABLE"].includes(
        code,
      );
      const needsReview = [
        "CONTACT_DELIVERY_UNKNOWN",
        "IDEMPOTENCY_CONFLICT",
      ].includes(code);
      if (
        !hadPending &&
        (botFailure ||
          code === "RATE_LIMITED" ||
          (error instanceof ContactSubmitError && error.status === 400))
      ) {
        pending.current = null;
        setLocked(false);
      }
      setReviewRequired(needsReview);
      setSubmitMessage(
        needsReview
          ? statusText.review
          : botFailure
            ? statusText.botCheckFailed
            : code === "RATE_LIMITED"
              ? statusText.rate
              : statusText.uncertain,
      );
    } finally {
      actionLock.current = false;
      botCheck.current?.reset();
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-visible relative">
      {/* Decorative glow */}
      <div className="absolute top-1/4 right-[10%] w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] bg-wqw-a-mg rounded-full blur-[200px] opacity-10 pointer-events-none" />

      {/* Left decorative bar — hidden on small screens */}
      <img
        className="hidden min-[1200px]:block absolute left-0 top-0 w-[6rem] h-full object-cover"
        alt="Union"
        src="https://c.animaapp.com/6QJxRgNq/img/union.svg"
      />

      {/* Main content wrapper */}
      <div className="flex flex-col min-[1200px]:flex-row items-center min-[1200px]:items-start justify-center gap-10 min-[1200px]:gap-20 w-full max-w-7xl px-6 sm:px-10 min-[1200px]:pl-28 min-[1200px]:pr-10 py-12 md:py-20 relative z-10">
        {/* ── Left column: Form ── */}
        <form
          onSubmit={handleSubmit}
          onFocusCapture={() => botCheck.current?.activate()}
          onPointerDownCapture={() => botCheck.current?.activate()}
          tool-name="book-consultation"
          tool-description="Submit a consultation request to AIHub Works. An AI specialist will contact you to discuss your business automation needs."
          className="flex flex-col w-full max-w-sm gap-6 order-2 min-[1200px]:order-1 shrink-0"
        >
          {/* Name input */}
          <div className="form-field-shell flex h-[4.5rem] items-center px-6 bg-[#060c2499] rounded-[1.875rem] backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[1.875rem] before:[background:linear-gradient(112deg,rgba(3,133,255,1)_0%,rgba(3,133,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:pointer-events-none">
            <input
              type="text"
              name="name"
              maxLength={120}
              readOnly={locked || submitState === "sending"}
              autoComplete="name"
              tool-param-description="Full name of the person requesting consultation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.contact.namePlaceholder}
              className="relative w-full font-normal text-white text-sm leading-[1.2] [font-family:'Geologica',Helvetica] bg-transparent border-none outline-none placeholder:opacity-50 placeholder:text-white"
            />
          </div>

          {/* Email input */}
          <div className="form-field-shell flex h-[4.5rem] items-center px-6 bg-[#060c2499] rounded-[1.875rem] backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[1.875rem] before:[background:linear-gradient(112deg,rgba(3,133,255,1)_0%,rgba(3,133,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:pointer-events-none">
            <input
              type="email"
              name="email"
              maxLength={160}
              readOnly={locked || submitState === "sending"}
              autoComplete="email"
              required
              tool-param-description="Email address for follow-up communication (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.contact.emailPlaceholder}
              className="relative w-full font-normal text-white text-sm leading-[1.2] [font-family:'Geologica',Helvetica] bg-transparent border-none outline-none placeholder:opacity-50 placeholder:text-white"
            />
          </div>

          {/* Phone input */}
          <div className="form-field-shell flex h-[4.5rem] items-center px-6 bg-[#060c2499] rounded-[1.875rem] backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[1.875rem] before:[background:linear-gradient(112deg,rgba(3,133,255,1)_0%,rgba(3,133,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:pointer-events-none">
            <input
              type="tel"
              name="phone"
              maxLength={60}
              readOnly={locked || submitState === "sending"}
              autoComplete="tel"
              tool-param-description="Phone number for direct contact (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.contact.phonePlaceholder}
              className="relative w-full font-normal text-white text-sm leading-[1.2] [font-family:'Geologica',Helvetica] bg-transparent border-none outline-none placeholder:opacity-50 placeholder:text-white"
            />
          </div>

          <div className="form-honeypot" aria-hidden="true">
            <label>
              Website
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>
          </div>
          <Turnstile ref={botCheck} action="contact_submit" lang={lang} />

          {/* Submit button */}
          <div className="relative w-full max-w-[22.5rem] h-[7.3rem] mx-auto min-[1200px]:mx-0">
            <button
              type="submit"
              disabled={submitState === "sending" || reviewRequired}
              className="glow-button glow-button--blue flex w-[calc(100%-2.5rem)] h-20 items-center justify-center px-10 absolute top-5 left-5 bg-wqw-a-mg rounded-[600px] shadow-[0px_2px_20px_#0385ff66,inset_0px_8px_12px_#ffffff4c] cursor-pointer disabled:cursor-wait disabled:opacity-70"
            >
              <span className="font-semibold text-white text-base text-center leading-[1.1] whitespace-nowrap [font-family:'Geologica',Helvetica]">
                {submitState === "sending"
                  ? statusText.sending
                  : t.contact.submitBtn}
              </span>
            </button>
            <img
              className="pointer-events-none absolute top-0 left-0 w-full h-full"
              alt="Rectangle"
              src="https://c.animaapp.com/6QJxRgNq/img/rectangle-12.svg"
            />
          </div>

          {submitMessage && (
            <p
              className={`min-h-5 text-center min-[1200px]:text-left text-sm leading-snug [font-family:'Geologica',Helvetica] ${
                submitState === "success" ? "text-[#08d070]" : "text-white/80"
              }`}
              role="status"
              aria-live="polite"
            >
              {submitMessage}
            </p>
          )}
          {reviewRequired && (
            <a
              className="text-white underline text-sm"
              href="mailto:techcrew@aihub.works"
            >
              techcrew@aihub.works
            </a>
          )}
        </form>

        {/* ── Right column: Text + Egg image ── */}
        <div className="relative flex flex-col gap-6 w-full min-[1200px]:max-w-[36rem] order-1 min-[1200px]:order-2">
          {/* Egg background images */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none overflow-visible">
            <div className="w-full max-w-[33rem] aspect-[529/709] bg-[url(https://c.animaapp.com/6QJxRgNq/img/egg-2.png)] bg-cover bg-center">
              <img
                className="w-full h-full object-cover"
                alt="Egg"
                src="https://c.animaapp.com/6QJxRgNq/img/egg-3.png"
              />
            </div>
          </div>

          {/* Text content */}
          <div className="relative z-10 flex flex-col gap-6">
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl min-[1200px]:text-[4rem] leading-[1.2] [font-family:'Geologica',Helvetica]">
              <span className="text-white">{t.contact.title1} </span>
              <span className="text-[#0385ff]">{t.contact.title2}</span>
            </p>

            <p className="font-medium text-xl sm:text-2xl md:text-[2rem] leading-[1.2] [font-family:'Geologica',Helvetica]">
              <span className="text-white">{t.contact.sub1} </span>
              <br className="hidden sm:inline" />
              <span className="text-[#0385ff]">{t.contact.sub2}</span>
            </p>

            <p className="font-bold text-3xl sm:text-4xl md:text-5xl min-[1200px]:text-[4rem] leading-[1.2] [font-family:'Geologica',Helvetica]">
              <span className="text-white">{t.contact.sub3}</span>
              <br />
              <span className="text-[#0385ff]">{t.contact.sub4}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
