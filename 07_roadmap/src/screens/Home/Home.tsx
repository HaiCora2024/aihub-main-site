import type { CSSProperties } from "react";

import { AdvancedAutomationSection } from "./sections/AdvancedAutomationSection";
import { CustomAISection } from "./sections/CustomAISection";
import { DevelopmentPhaseSection } from "./sections/DevelopmentPhaseSection";
import { LaunchPhaseSection } from "./sections/LaunchPhaseSection";
import { OptimizationPhaseSection } from "./sections/OptimizationPhaseSection";
import { RoadmapSection } from "./sections/RoadmapSection";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";
import { useLanguage } from "../../../../src/i18n/LanguageContext";

const cards = [
  { Component: OptimizationPhaseSection },
  { Component: CustomAISection },
  { Component: DevelopmentPhaseSection },
  { Component: LaunchPhaseSection },
  { Component: AdvancedAutomationSection },
];

const getRevealStyle = (index: number, offset = 0): CSSProperties =>
  ({ "--reveal-delay": `${offset + index * 0.12}s` }) as CSSProperties;

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();
  const revealClassName = (baseClassName: string) =>
    `${baseClassName} reveal-sequence-item${isVisible ? " reveal-sequence-item--visible" : ""}`;

  const desktopDates = t.roadmap.dates.map((date, i) => {
    const lefts = [389, 623, 857, 1091, 1325];
    return { top: 255, left: lefts[i], label: date };
  });

  return (
    <div ref={ref} className="w-full relative overflow-visible">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={749}
          contentLeft={389}
          contentWidth={1155}
          targetWidth={1140}
        >
          <div className="relative h-[749px] w-[1920px]">
            <OptimizationPhaseSection
              className={revealClassName("")}
              style={getRevealStyle(2, 0.08)}
            />
            <img
              className={revealClassName("absolute w-[955px] h-[200px] top-[11px] left-[496px]")}
              style={getRevealStyle(1, 0.04)}
              alt="Union"
              src="https://c.animaapp.com/ZnSA1rtX/img/union.svg"
            />
            <RoadmapSection
              className={revealClassName("")}
              style={getRevealStyle(0)}
            />
            <CustomAISection
              className={revealClassName("")}
              style={getRevealStyle(3, 0.08)}
            />
            <DevelopmentPhaseSection
              className={revealClassName("")}
              style={getRevealStyle(4, 0.08)}
            />
            <LaunchPhaseSection
              className={revealClassName("")}
              style={getRevealStyle(5, 0.08)}
            />
            <AdvancedAutomationSection
              className={revealClassName("")}
              style={getRevealStyle(6, 0.08)}
            />
            {desktopDates.map((item, index) => (
              <div
                key={index}
                className={revealClassName("inline-flex items-center justify-center gap-2.5 p-[15px] absolute bg-[#060c2499] rounded-xl border-[none] shadow-[var(--)] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none")}
                style={{ top: item.top, left: item.left, ...getRevealStyle(index + 2, 0.02) }}
              >
                <div className="w-fit mt-[-1.00px] font-medium text-y-c9z-sz text-[10px] leading-[12.0px] whitespace-nowrap relative [font-family:'Geologica',Helvetica] tracking-[0]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden flex min-h-screen flex-col items-center px-4 sm:px-6 md:px-10 py-8 sm:py-12 gap-6">
        <h1
          className={revealClassName("[font-family:'Geologica',Helvetica] font-bold text-center text-2xl sm:text-3xl md:text-4xl min-[1200px]:text-5xl leading-tight")}
          style={getRevealStyle(0)}
        >
          {t.roadmap.titleSpans.map((span, i) => (
            <span key={i} className={span.green ? "text-[#08d070]" : "text-[#ffffff]"}>{span.text}</span>
          ))}
        </h1>

        <img
          className={revealClassName("w-full max-w-[600px] h-auto opacity-60")}
          style={getRevealStyle(1, 0.04)}
          alt="Union"
          src="https://c.animaapp.com/ZnSA1rtX/img/union.svg"
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 min-[1200px]:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl">
          {cards.map(({ Component }, index) => (
            <div
              key={index}
              className={revealClassName("flex flex-col items-center gap-3")}
              style={getRevealStyle(index + 2, 0.08)}
            >
              <div className="inline-flex items-center justify-center gap-2.5 p-3 bg-[#060c2499] rounded-xl backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                <div className="font-medium text-y-c9z-sz text-xs sm:text-sm [font-family:'Geologica',Helvetica] whitespace-nowrap">
                  {t.roadmap.dates[index]}
                </div>
              </div>
              <Component mobile />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
