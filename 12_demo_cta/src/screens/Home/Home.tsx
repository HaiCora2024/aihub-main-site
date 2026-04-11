import { useLanguage } from "../../../../src/i18n/LanguageContext";
import { scrollToSection } from "../../../../src/utils/scrollToSection";

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const handleContactScroll = () => scrollToSection("contact");

  return (
    <div
      className="w-full relative overflow-visible"
      data-model-id="316:6839"
    >
      {/* Glow blob */}
      <div className="absolute top-[5vh] right-[10vw] w-[30vw] max-w-[456px] aspect-square bg-d-rs-4a-2 rounded-full blur-[200px] opacity-20 pointer-events-none" />

      {/* Main content wrapper */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 px-4 py-10 sm:px-6 sm:py-12 min-[1200px]:flex-row min-[1200px]:items-start min-[1200px]:gap-16 min-[1200px]:px-8 min-[1200px]:py-14">
        {/* Text + CTA column */}
        <div className="order-2 flex max-w-2xl shrink-0 flex-col items-center text-center min-[1200px]:order-1 min-[1200px]:max-w-[55%] min-[1200px]:items-start min-[1200px]:text-left">
          <h1 className="font-bold text-transparent text-4xl sm:text-5xl md:text-6xl min-[1200px]:text-7xl min-[1200px]:text-[86px] leading-[1.2] [font-family:'Geologica',Helvetica] tracking-[0]">
            <span className="text-white">{t.demo.title1} </span>
            <span className="text-[#08d070]">{t.demo.title2}</span>
          </h1>

          <p className="mt-6 font-medium text-transparent text-xl sm:mt-8 sm:text-2xl md:text-3xl min-[1200px]:text-4xl min-[1200px]:mt-10 min-[1200px]:text-5xl leading-[1.2] [font-family:'Geologica',Helvetica] tracking-[0]">
            <span className="text-white">{t.demo.sub1} </span>
            <span className="text-[#08d070]">{t.demo.sub2}</span>
            <span className="text-white"> {t.demo.sub3}</span>
          </p>

          {/* CTA button */}
          <div className="relative mt-8 h-[117px] w-[290px] shrink-0 sm:mt-10 min-[1200px]:mt-14">
            <button
              className="glow-button glow-button--green flex w-[250px] sm:w-[290px] h-20 items-center justify-center gap-2.5 px-8 sm:px-10 py-2.5 absolute top-5 left-5 bg-d-rs-4a-2 rounded-[600px] shadow-[0px_2px_20px_#08d07066,inset_0px_8px_12px_#ffffff4c] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              type="button"
              onClick={handleContactScroll}
            >
              <span className="font-semibold text-white text-sm sm:text-base text-center leading-[17.6px] [font-family:'Geologica',Helvetica] tracking-[0]">
                {t.demo.ctaLine1}<br />{t.demo.ctaLine2}
              </span>
            </button>
            <img
              className="absolute top-0 left-0 w-[290px] sm:w-[330px] h-[117px] pointer-events-none"
              alt=""
              src="https://c.animaapp.com/e25EZ7md/img/rectangle-12.svg"
            />
          </div>
        </div>

        {/* Egg column */}
        <div className="relative order-1 flex w-[60vw] max-w-[497px] shrink-0 aspect-[497/665] items-center justify-center min-[1200px]:order-2">
          <div className="absolute inset-0 opacity-60 bg-[url(https://c.animaapp.com/e25EZ7md/img/egg-2.png)] bg-cover bg-center animate-egg-float" />
          <img
            className="relative w-full h-full object-cover animate-egg-float"
            alt="Egg"
            src="https://c.animaapp.com/e25EZ7md/img/egg-3.png"
          />
        </div>
      </div>
    </div>
  );
};
