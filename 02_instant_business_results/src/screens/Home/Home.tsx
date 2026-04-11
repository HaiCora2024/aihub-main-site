import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useLanguage } from "../../../../src/i18n/LanguageContext";
import { scrollToSection } from "../../../../src/utils/scrollToSection";

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const resultCards = t.results.cards;
  const handleContactScroll = () => scrollToSection("contact");

  return (
    <div className="w-full relative overflow-visible" data-model-id="316:6743">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={800}
          contentLeft={389}
          contentWidth={1141}
          targetWidth={1140}
        >
          <div className="relative h-[800px] w-[1920px]">
        <div className="absolute top-[121px] left-[811px] w-[456px] h-[456px] bg-jo2i-fe rounded-[228px] blur-[200px] opacity-20" />

        <div className="animate-float absolute top-[31px] left-[1267px] w-[529px] h-[709px] flex opacity-40 bg-[url(https://c.animaapp.com/98I8TU6Y/img/egg-2.png)] bg-cover bg-[50%_50%]">
          <img
            className="w-[529.44px] h-[709px] object-cover"
            alt="Egg"
            src="https://c.animaapp.com/98I8TU6Y/img/egg-3.png"
          />
        </div>

        <div className="flex flex-col w-[555px] items-start gap-9 absolute top-[calc(50.00%_-_200px)] right-[361px]">
          <div className="w-[555px] mt-[-1.00px] font-bold text-jo2i-fe text-[64px] leading-[76.8px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
            {t.results.title1}
          </div>

          <div className="w-[521px] font-bold text-white text-[64px] leading-[76.8px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
            {t.results.title2}
          </div>
        </div>

        <div className="cta-frame absolute top-[650px] left-[1199px]">
          <button
            type="button"
            onClick={handleContactScroll}
            className="glow-button glow-button--yellow absolute left-5 right-5 top-5 flex h-20 items-center justify-center gap-2.5 rounded-[600px] bg-jo2i-fe px-10 py-2.5 shadow-[0px_2px_20px_#ffd40966,inset_0px_8px_12px_#ffffff4c]"
          >
            <span className="w-fit font-semibold text-black-100 text-base text-center leading-[17.6px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
              {t.results.ctaLine1}
              <br />
              {t.results.ctaLine2}
            </span>
          </button>

          <img
            className="absolute top-0 left-0 h-full w-full pointer-events-none"
            alt="Rectangle"
            src="https://c.animaapp.com/98I8TU6Y/img/rectangle-12.svg"
          />
        </div>

        {resultCards.map((card, index) => (
          <div
            key={card.title}
            className={`card-yellow ${index % 2 === 0 ? "card-yellow-ltr" : "card-yellow-rtl"} absolute left-[389px] w-[555px] h-[233px] rounded-[30px] overflow-hidden ${
              index === 0 ? "top-[30px]" : index === 1 ? "top-[284px]" : "top-[537px]"
            }`}
          >
            <img
              className="absolute left-[24px] top-1/2 -translate-y-1/2 w-[70px] h-[70px] object-contain"
              alt={card.title}
              src={`https://c.animaapp.com/98I8TU6Y/img/group-${13 + index}@2x.png`}
            />
            <div className="flex flex-col w-[321px] items-start gap-5 absolute top-1/2 -translate-y-1/2 left-[118px]">
              <div className="w-[321px] mt-[-1.00px] font-medium text-jo2i-fe text-[26px] leading-[31.2px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
                {card.title}
              </div>
              <p className="self-stretch font-light text-white text-xl leading-[24.0px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
                {card.text}
              </p>
            </div>
          </div>
        ))}

        <img
          className="absolute w-[516px] h-[134px] top-[293px] left-[974px]"
          alt="Union"
          src="https://c.animaapp.com/98I8TU6Y/img/union.svg"
        />
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden relative px-5 sm:px-8 md:px-12 py-12 sm:py-16">
        <div className="absolute top-[8%] right-[-5%] w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] bg-jo2i-fe rounded-full blur-[160px] opacity-15 pointer-events-none" />

        <div className="absolute top-8 right-[-12%] sm:right-0 w-[52vw] max-w-[22rem] opacity-35 pointer-events-none">
          <img
            className="w-full h-auto object-cover"
            alt="Egg"
            src="https://c.animaapp.com/98I8TU6Y/img/egg-3.png"
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
          <div className="max-w-3xl">
            <p className="font-bold text-3xl leading-tight sm:text-5xl md:text-6xl [font-family:'Geologica',Helvetica]">
              <span className="text-[#ffd409]">{t.results.title1}</span>
              <br />
              <span className="text-white">{t.results.title2}</span>
            </p>
          </div>

          <div className="relative h-[7.3rem] w-full max-w-[22.5rem]">
            <button
              type="button"
              onClick={handleContactScroll}
              className="glow-button glow-button--yellow absolute left-5 right-5 top-5 flex h-20 items-center justify-center gap-2.5 rounded-[600px] bg-jo2i-fe px-10 py-2.5 shadow-[0px_2px_20px_#ffd40966,inset_0px_8px_12px_#ffffff4c]"
            >
              <span className="font-semibold text-black-100 text-base text-center leading-[17.6px] [font-family:'Geologica',Helvetica] tracking-[0]">
                {t.results.ctaLine1}
                <br />
                {t.results.ctaLine2}
              </span>
            </button>
            <img
              className="pointer-events-none absolute left-0 top-0 h-full w-full"
              alt="Rectangle"
              src="https://c.animaapp.com/98I8TU6Y/img/rectangle-12.svg"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3">
            {resultCards.map((card, index) => (
              <article
                key={card.title}
                className={`relative overflow-hidden rounded-[28px] bg-[#060c2499] p-5 sm:p-6 backdrop-blur-[10px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] ${
                  index === 2 ? "md:col-span-2 min-[1200px]:col-span-1" : ""
                }`}
              >
                <img
                  className="h-10 w-10 object-contain"
                  alt={card.title}
                  src={`https://c.animaapp.com/98I8TU6Y/img/group-${13 + index}@2x.png`}
                />
                <div className="mt-5 font-medium text-[#ffd409] text-xl leading-tight [font-family:'Geologica',Helvetica]">
                  {card.title}
                </div>
                <p className="mt-3 font-light text-white text-sm sm:text-base leading-relaxed [font-family:'Geologica',Helvetica]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
