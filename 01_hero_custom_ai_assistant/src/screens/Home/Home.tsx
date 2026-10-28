import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { SiteHeader } from "../../../../src/components/SiteHeader";
import { TypewriterText } from "../../../../src/components/TypewriterText";
import { useLanguage } from "../../../../src/i18n/LanguageContext";
import { scrollToSection } from "../../../../src/utils/scrollToSection";

export const Home = (): JSX.Element => {
  const { t, lang, toggleLang } = useLanguage();
  const lines = t.hero.lines.map((line) => ({
    text: line.text,
    className: line.color,
  }));
  const handleContactScroll = () => scrollToSection("contact");

  return (
    <div className="w-full relative overflow-visible" data-model-id="316:6178">
      <SiteHeader lang={lang} onLanguageChange={toggleLang} page="landing" />
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

            <h1
              key={lang}
              className="top-[169px] left-[391px] w-[850px] font-bold text-transparent text-[86px] leading-[103.2px] absolute [font-family:'Geologica',Helvetica] tracking-[0]"
            >
              <TypewriterText lines={lines} />
            </h1>

            <p className="top-[613px] left-[508px] w-[299px] font-light text-white text-sm leading-[16.8px] absolute [font-family:'Geologica',Helvetica] tracking-[0]">
              {t.hero.tagline}
            </p>

            <div className="flex flex-col w-[555px] items-start gap-5 p-[60px] absolute left-[976px] top-[508px] bg-[#060c2499] rounded-[20px] border-2 border-solid border-x-4jpsrj shadow-[var(--)] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
              <div className="self-stretch mt-[-2.00px] font-medium text-x-4jpsrj text-2xl leading-[28.8px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
                {t.hero.cardTitle}
              </div>

              <p className="relative self-stretch [font-family:'Geologica',Helvetica] font-light text-white text-base tracking-[0] leading-[19.2px]">
                {t.hero.cardText}
              </p>
            </div>
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden flex flex-col min-h-[calc(100svh-88px)] md:min-h-[calc(100svh-104px)]">
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
            <h1 className="font-bold text-[2rem] sm:text-[3rem] md:text-[4rem] leading-[1.2] [font-family:'Geologica',Helvetica] tracking-[0]">
              <TypewriterText key={lang} lines={lines} />
            </h1>

            <p className="max-w-[20rem] font-light text-white text-xs sm:text-sm leading-[1.4] [font-family:'Geologica',Helvetica]">
              {t.hero.tagline}
            </p>

            <img
              className="w-full max-w-[22rem] sm:max-w-[28rem] h-auto mix-blend-screen mt-[-0.5rem]"
              alt="Decorative gradient"
              src="https://c.animaapp.com/fHEJ88Tu/img/group-1.png"
            />

            <div className="mt-2">
              <button
                type="button"
                onClick={handleContactScroll}
                className="cta-btn-responsive glow-button glow-button--green relative bg-LZ-cyid rounded-full w-full max-w-[20rem] px-6 py-4 font-semibold text-white text-base text-center [font-family:'Geologica',Helvetica] shadow-[0px_2px_20px_#08d07066,inset_0px_8px_12px_#ffffff4c] cursor-pointer"
              >
                {t.hero.ctaLine1}&nbsp;{t.hero.ctaLine2}
              </button>
            </div>
          </main>

          <div className="relative z-10 mx-5 sm:mx-8 md:mx-12 mt-8 sm:mt-12 mb-6 sm:mb-10">
            <div className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 md:p-10 bg-[#060c2499] rounded-2xl border-2 border-solid border-x-4jpsrj backdrop-blur-[10px] max-w-[36rem]">
              <div className="font-medium text-x-4jpsrj text-lg sm:text-xl md:text-2xl leading-[1.2] [font-family:'Geologica',Helvetica]">
                {t.hero.cardTitle}
              </div>
              <p className="[font-family:'Geologica',Helvetica] font-light text-white text-sm sm:text-base leading-[1.3]">
                {t.hero.cardText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
