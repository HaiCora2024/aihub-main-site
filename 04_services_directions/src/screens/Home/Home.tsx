import type { CSSProperties } from "react";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";
import { useLanguage } from "../../../../src/i18n/LanguageContext";

const getRevealStyle = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}s` }) as CSSProperties;

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();
  const getRevealClassName = (baseClassName: string) =>
    `${baseClassName} reveal-sequence-item${isVisible ? " reveal-sequence-item--visible" : ""}`;
  const getAnimatedClassName = (baseClassName: string, animationClassName: string) =>
    `${baseClassName}${isVisible ? ` ${animationClassName}` : " opacity-0"}`;

  const items = t.services.items;

  return (
    <div ref={ref} className="w-full relative overflow-visible" data-model-id="316:6212">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={800}
          contentLeft={389}
          contentWidth={1141}
          targetWidth={1140}
        >
          <div className="relative h-[800px] w-[1920px]">
        <div
          className={getRevealClassName("animate-egg-float absolute top-[31px] left-[94px] w-[529px] h-[709px] flex opacity-40 bg-[url(https://c.animaapp.com/M0Twn3KI/img/egg-2.png)] bg-cover bg-[50%_50%]")}
          style={getRevealStyle(0.08)}
        >
          <img
            className="w-[529.44px] h-[709px] object-cover"
            alt="Egg"
            src="https://c.animaapp.com/M0Twn3KI/img/egg-3.png"
          />
        </div>

        <img
          className={getRevealClassName("absolute w-[782px] h-[153px] top-[334px] left-[389px]")}
          style={getRevealStyle(0.14)}
          alt="Union"
          src="https://c.animaapp.com/M0Twn3KI/img/union.svg"
        />

        <div
          className={getRevealClassName("w-[458px] top-[30px] left-[389px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.2)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.28)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.36)}
          >
            {items[0].title}
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.48)}
          >
            {items[0].textLong}
          </p>
        </div>

        <div
          className={getRevealClassName("w-[458px] top-[536px] left-[487px] rounded-[var(--collection-1-30)] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.36)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.44)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.52)}
          >
            {items[1].title}
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.64)}
          >
            {items[1].textLong}
          </p>
        </div>

        <div
          className={getRevealClassName("w-[570px] top-[164px] left-[974px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.52)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.6)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch [font-family:'Geologica',Helvetica] font-medium text-x-2l-jg-IF text-lg tracking-[0] leading-[21.6px]", "animate-reveal-title")}
            style={getRevealStyle(0.68)}
          >
            {items[2].title}
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.8)}
          >
            {items[2].textLong}
          </p>
        </div>

        <div
          className={getRevealClassName("w-[361px] top-[545px] left-[1169px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.68)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.76)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.84)}
          >
            {items[3].title}
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.96)}
          >
            {items[3].textLong}
          </p>
        </div>

        <p
          className={getRevealClassName("absolute top-[333px] left-[584px] w-[555px] font-bold text-transparent text-[64px] leading-[76.8px] [font-family:'Geologica',Helvetica] tracking-[0]")}
          style={getRevealStyle(0.18)}
        >
          <span className="text-[#bf5bf3]">{t.services.part1}</span>
          <span className="text-[#ffffff]">{t.services.part2}</span>
        </p>

        <img
          className={getRevealClassName("top-[73px] left-[974px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.3)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-53.svg"
        />
        <img
          className={getRevealClassName("left-[1169px] bottom-0 absolute w-px h-[498px]")}
          style={getRevealStyle(0.46)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-56.svg"
        />
        <img
          className={getRevealClassName("top-[13px] left-[388px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.14)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-54.svg"
        />
        <img
          className={getRevealClassName("top-[273px] left-[485px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.38)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-55.svg"
        />
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden relative px-5 sm:px-8 md:px-12 py-12 sm:py-16">
        <div className="absolute left-[-8%] top-0 w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] bg-x-2l-jg-IF rounded-full blur-[170px] opacity-10 pointer-events-none" />
        <div className="absolute left-[-12%] top-10 w-[42vw] max-w-[18rem] opacity-30 pointer-events-none">
          <img
            className="w-full h-auto object-cover"
            alt="Egg"
            src="https://c.animaapp.com/M0Twn3KI/img/egg-3.png"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p
              className={getRevealClassName("font-bold text-3xl leading-tight sm:text-5xl md:text-6xl [font-family:'Geologica',Helvetica]")}
              style={getRevealStyle(0.06)}
            >
              <span className="text-[#bf5bf3]">{t.services.part1}</span>
              <span className="text-white">{t.services.part2}</span>
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
              <article
                key={item.title}
                className={getRevealClassName(`relative rounded-[28px] bg-[#060c2499] p-5 sm:p-6 backdrop-blur-[10px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:[background:linear-gradient(112deg,rgba(191,91,243,1)_0%,rgba(191,91,243,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] ${
                  index === 0 ? "md:col-span-2" : ""
                }`)}
                style={getRevealStyle(0.18 + index * 0.18)}
              >
                <div className="relative z-10">
                  <div
                    className={getAnimatedClassName("h-3.5 w-3.5 rounded-[7px] bg-x-2l-jg-IF blur-[1px]", "animate-reveal-dot")}
                    style={getRevealStyle(0.26 + index * 0.18)}
                  />
                  <div
                    className={getAnimatedClassName("mt-5 font-medium text-[#bf5bf3] text-xl leading-tight [font-family:'Geologica',Helvetica]", "animate-reveal-title")}
                    style={getRevealStyle(0.34 + index * 0.18)}
                  >
                    {item.title}
                  </div>
                  <p
                    className={getAnimatedClassName("mt-3 font-light text-white text-sm sm:text-base leading-relaxed [font-family:'Geologica',Helvetica]", "animate-reveal-text")}
                    style={getRevealStyle(0.46 + index * 0.18)}
                  >
                    {item.textShort}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
