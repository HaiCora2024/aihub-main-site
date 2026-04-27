import { useState, type FormEvent } from "react";

import { useLanguage } from "../../../../src/i18n/LanguageContext";

const CONTACT_API_URL = (import.meta.env.VITE_CONTACT_API_URL || "").replace(/\/$/, "");

type SubmitState = "idle" | "sending" | "success" | "error";

export const Home = (): JSX.Element => {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const statusText = {
    requiredName: lang === "ru" ? "Заполните поле имени." : "Please enter your name.",
    requiredEmail: lang === "ru" ? "Заполните поле e-mail." : "Please enter your e-mail.",
    invalidEmail: lang === "ru" ? "Введите корректный e-mail." : "Please enter a valid e-mail.",
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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    try {
      const response = await fetch(`${CONTACT_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: "aihub-site",
          page: window.location.href,
          website: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Contact API returned ${response.status}`);
      }

      setName("");
      setEmail("");
      setPhone("");
      setSubmitState("success");
      setSubmitMessage(statusText.success);
    } catch (error) {
      console.error(error);
      setSubmitState("error");
      setSubmitMessage(statusText.error);
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
          tool-name="book-consultation"
          tool-description="Submit a consultation request to AIHub Works. An AI specialist will contact you to discuss your business automation needs."
          className="flex flex-col w-full max-w-sm gap-6 order-2 min-[1200px]:order-1 shrink-0"
        >
          {/* Name input */}
          <div className="form-field-shell flex h-[4.5rem] items-center px-6 bg-[#060c2499] rounded-[1.875rem] backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-[1.875rem] before:[background:linear-gradient(112deg,rgba(3,133,255,1)_0%,rgba(3,133,255,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:pointer-events-none">
            <input
              type="text"
              name="name"
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
              autoComplete="tel"
              tool-param-description="Phone number for direct contact (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.contact.phonePlaceholder}
              className="relative w-full font-normal text-white text-sm leading-[1.2] [font-family:'Geologica',Helvetica] bg-transparent border-none outline-none placeholder:opacity-50 placeholder:text-white"
            />
          </div>

          {/* Submit button */}
          <div className="relative w-full max-w-[22.5rem] h-[7.3rem] mx-auto min-[1200px]:mx-0">
            <button
              type="submit"
              disabled={submitState === "sending"}
              className="glow-button glow-button--blue flex w-[calc(100%-2.5rem)] h-20 items-center justify-center px-10 absolute top-5 left-5 bg-wqw-a-mg rounded-[600px] shadow-[0px_2px_20px_#0385ff66,inset_0px_8px_12px_#ffffff4c] cursor-pointer disabled:cursor-wait disabled:opacity-70"
            >
              <span className="font-semibold text-white text-base text-center leading-[1.1] whitespace-nowrap [font-family:'Geologica',Helvetica]">
                {submitState === "sending" ? statusText.sending : t.contact.submitBtn}
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
              <span className="text-white">{t.contact.sub1}{" "}</span>
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
