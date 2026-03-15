import { useEffect, useState } from "react";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";

const LINES = [
  { text: "ВАШ КАСТОМНЫЙ ", color: "text-[#ffffff]" },
  { text: "AI-АССИСТЕНТ", color: "text-[#08d070]" },
  { text: "ЗА ДВЕ НЕДЕЛИ", color: "text-[#ffffff]" },
];

const FULL_TEXT = LINES.map((l) => l.text).join("");

function useTypewriter(text: string, speed = 55, startDelay = 400) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed >= text.length) return;
    const t = setTimeout(() => setDisplayed((d) => d + 1), speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return displayed;
}

function TypewriterHero() {
  const count = useTypewriter(FULL_TEXT, 55, 400);
  const done = count >= FULL_TEXT.length;

  let remaining = count;
  const segments = LINES.map((line) => {
    const take = Math.min(remaining, line.text.length);
    remaining -= take;
    return { ...line, visible: line.text.slice(0, take) };
  });

  return (
    <p className="font-bold text-transparent text-[2rem] sm:text-[3rem] md:text-[4rem] min-[1200px]:text-[5rem] min-[1200px]:text-[86px] leading-[1.2] [font-family:'Geologica',Helvetica] tracking-[0]">
      <span className={segments[0].color}>{segments[0].visible}</span>
      {segments[0].visible.length === LINES[0].text.length && <br />}
      <span className={segments[1].color}>{segments[1].visible}</span>
      {segments[1].visible.length === LINES[1].text.length && (
        <>
          <span className="text-[#ffd409]"> </span>
          <br />
        </>
      )}
      <span className={segments[2].color}>{segments[2].visible}</span>
      {!done && (
        <span className="inline-block w-[4px] ml-[3px] bg-current align-middle animate-cursor-blink" style={{ height: "0.85em", verticalAlign: "middle" }} />
      )}
    </p>
  );
}

function TypewriterDesktop() {
  const count = useTypewriter(FULL_TEXT, 55, 400);
  const done = count >= FULL_TEXT.length;

  let remaining = count;
  const segments = LINES.map((line) => {
    const take = Math.min(remaining, line.text.length);
    remaining -= take;
    return { ...line, visible: line.text.slice(0, take) };
  });

  return (
    <>
      <span className={segments[0].color}>{segments[0].visible}</span>
      {segments[0].visible.length === LINES[0].text.length && <br />}
      <span className={segments[1].color}>{segments[1].visible}</span>
      {segments[1].visible.length === LINES[1].text.length && (
        <>
          <span className="text-[#ffd409]"> </span>
          <br />
        </>
      )}
      <span className={segments[2].color}>{segments[2].visible}</span>
      {!done && (
        <span className="inline-block w-[4px] ml-[3px] bg-current align-middle animate-cursor-blink" style={{ height: "0.85em", verticalAlign: "middle" }} />
      )}
    </>
  );
}

export const Home = (): JSX.Element => {
  const navItems = [
    { label: "Услуги", href: "#services" },
    { label: "Кейсы", href: "#cases" },
    { label: "Дорожная карта", href: "#roadmap" },
    { label: "Команда", href: "#team" },
  ];

  return (
    <div
      className="w-full relative overflow-visible"
      data-model-id="316:6178"
    >
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={800}
          contentLeft={389}
          contentWidth={1142}
          targetWidth={1140}
        >
          <div className="relative h-[800px] w-[1920px]">
        <img
          className="absolute top-[580px] left-[391px] w-[555px] h-[131px] mix-blend-screen"
          alt="Group"
          src="https://c.animaapp.com/fHEJ88Tu/img/group-1.png"
        />

        <div className="top-[50px] left-[961px] w-[456px] h-[456px] rounded-[228px] blur-[200px] opacity-20 absolute bg-LZ-cyid" />

        <div
          className="absolute top-[57px] left-[849px] w-[497px] h-[665px] flex opacity-60 bg-[url(https://c.animaapp.com/fHEJ88Tu/img/egg-2.png)] bg-cover bg-[50%_50%]"
          style={{ animation: "egg-float 6s ease-in-out infinite" }}
        >
          <img
            className="w-[496.59px] h-[665px] object-cover"
            alt="Egg"
            src="https://c.animaapp.com/fHEJ88Tu/img/egg-3.png"
          />
        </div>

        <div
          className="top-[54px] left-[389px] w-[45px] h-[45px] rounded-[22.5px] opacity-60 absolute bg-LZ-cyid"
          style={{ animation: "logo-glow-pulse 2.8s ease-in-out infinite", filter: "blur(20px)" }}
        />

        <img
          className="absolute w-[165px] h-[49px] top-[50px] left-[391px]"
          alt="Group"
          src="https://c.animaapp.com/fHEJ88Tu/img/group-3@2x.png"
        />

        <p className="top-[169px] left-[391px] w-[850px] font-bold text-transparent text-[86px] leading-[103.2px] absolute [font-family:'Geologica',Helvetica] tracking-[0]">
          <TypewriterDesktop />
        </p>

        <p className="top-[613px] left-[508px] w-[299px] font-light text-white text-sm leading-[16.8px] absolute [font-family:'Geologica',Helvetica] tracking-[0]">
          Первое AI-агентство, которое объединяет передовые технологии с глубоким
          пониманием операционных проблем бизнеса
        </p>

        <div className="flex flex-col w-[555px] items-start gap-5 p-[60px] absolute left-[976px] top-[508px] bg-[#060c2499] rounded-[20px] border-2 border-solid border-x-4jpsrj shadow-[var(--)] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
          <div className="self-stretch mt-[-2.00px] font-medium text-x-4jpsrj text-2xl leading-[28.8px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
            Повысьте эффективность работы
          </div>

          <p className="relative self-stretch [font-family:'Geologica',Helvetica] font-light text-white text-base tracking-[0] leading-[19.2px]">
            Наши автоматизации экономят ваше время и усилия. Мы не ломаем
            существующие процессы, <br />а дополняем их AI.
          </p>
        </div>

        <div className="cta-btn-wrapper absolute top-[18px] left-[1201px] cursor-pointer">
          <button
            type="button"
            className="cta-btn-inner glow-button glow-button--green flex w-[290px] h-20 items-center justify-center gap-2.5 px-10 py-2.5 absolute top-5 left-5 bg-LZ-cyid rounded-[600px] shadow-[0px_2px_20px_#08d07066,inset_0px_8px_12px_#ffffff4c]"
          >
            <span className="w-fit font-semibold text-white text-base text-center leading-[17.6px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
              Записаться
              <br />
              на консультацию
            </span>
          </button>

          <img
            className="cta-static-border absolute top-0 left-0 w-[330px] h-[117px] pointer-events-none transition-opacity duration-300"
            alt="Rectangle"
            src="https://c.animaapp.com/fHEJ88Tu/img/rectangle-12.svg"
          />
        </div>

        <div className="inline-flex items-center gap-[60px] absolute top-[68px] left-[693px]">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hero-nav-link relative w-fit mt-[-1.00px] [font-family:'Geologica',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-[18.2px] whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 pt-6 pb-4 relative z-20">
          <div className="relative">
            <div
              className="absolute -left-1 top-0 w-[2.8rem] h-[2.8rem] rounded-full opacity-60 bg-LZ-cyid"
              style={{ animation: "logo-glow-pulse 2.8s ease-in-out infinite", filter: "blur(20px)" }}
            />
            <img
              className="relative w-[8rem] sm:w-[10rem] h-auto"
              alt="Logo"
              src="https://c.animaapp.com/fHEJ88Tu/img/group-3@2x.png"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 min-[1200px]:gap-10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hero-nav-link [font-family:'Geologica',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-[18.2px] whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <button type="button" className="cta-btn-responsive glow-button glow-button--green relative bg-LZ-cyid rounded-full px-6 py-3 font-semibold text-white text-sm text-center [font-family:'Geologica',Helvetica] shadow-[0px_2px_20px_#08d07066,inset_0px_8px_12px_#ffffff4c] cursor-pointer">
              Записаться на&nbsp;консультацию
            </button>
          </div>
        </header>

        <div className="relative flex-1 flex flex-col">
          <div className="absolute top-0 right-0 w-[60vw] max-w-[456px] aspect-square rounded-full blur-[120px] sm:blur-[160px] opacity-15 bg-LZ-cyid pointer-events-none" />

          <div
            className="absolute top-0 right-[-10%] sm:right-[5%] w-[55vw] max-w-[400px] md:max-w-[450px] opacity-40 sm:opacity-50 pointer-events-none"
            style={{ animation: "egg-float 6s ease-in-out infinite" }}
          >
            <img
              className="w-full h-auto object-cover"
              alt="Egg"
              src="https://c.animaapp.com/fHEJ88Tu/img/egg-3.png"
            />
          </div>

          <main className="relative z-10 flex flex-col gap-6 sm:gap-8 px-5 sm:px-8 md:px-12 pt-8 sm:pt-12 md:pt-16 flex-1">
            <TypewriterHero />

            <p className="max-w-[20rem] font-light text-white text-xs sm:text-sm leading-[1.4] [font-family:'Geologica',Helvetica]">
              Первое AI-агентство, которое объединяет передовые технологии с глубоким
              пониманием операционных проблем бизнеса
            </p>

            <img
              className="w-full max-w-[22rem] sm:max-w-[28rem] h-auto mix-blend-screen mt-[-0.5rem]"
              alt="Decorative gradient"
              src="https://c.animaapp.com/fHEJ88Tu/img/group-1.png"
            />

            <div className="md:hidden mt-2">
              <button type="button" className="cta-btn-responsive glow-button glow-button--green relative bg-LZ-cyid rounded-full w-full max-w-[20rem] px-6 py-4 font-semibold text-white text-base text-center [font-family:'Geologica',Helvetica] shadow-[0px_2px_20px_#08d07066,inset_0px_8px_12px_#ffffff4c] cursor-pointer">
                Записаться на&nbsp;консультацию
              </button>
            </div>
          </main>

          <div className="relative z-10 mx-5 sm:mx-8 md:mx-12 mt-8 sm:mt-12 mb-6 sm:mb-10">
            <div className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 md:p-10 bg-[#060c2499] rounded-2xl border-2 border-solid border-x-4jpsrj backdrop-blur-[10px] max-w-[36rem]">
              <div className="font-medium text-x-4jpsrj text-lg sm:text-xl md:text-2xl leading-[1.2] [font-family:'Geologica',Helvetica]">
                Повысьте эффективность работы
              </div>
              <p className="[font-family:'Geologica',Helvetica] font-light text-white text-sm sm:text-base leading-[1.3]">
                Наши автоматизации экономят ваше время и усилия. Мы&nbsp;не ломаем
                существующие процессы, а&nbsp;дополняем их&nbsp;AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
