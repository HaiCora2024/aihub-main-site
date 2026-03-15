import { AdvancedAutomationSection } from "./sections/AdvancedAutomationSection";
import { CustomAISection } from "./sections/CustomAISection";
import { DevelopmentPhaseSection } from "./sections/DevelopmentPhaseSection";
import { LaunchPhaseSection } from "./sections/LaunchPhaseSection";
import { OptimizationPhaseSection } from "./sections/OptimizationPhaseSection";
import { RoadmapSection } from "./sections/RoadmapSection";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";

const dateLabels = [
  "Ноябрь 2023",
  "Апрель 2024",
  "Июль 2024",
  "Сентябрь 2024",
  "Сентябрь 2024",
];

const cards = [
  { date: "Ноябрь 2023", Component: OptimizationPhaseSection },
  { date: "Апрель 2024", Component: CustomAISection },
  { date: "Июль 2024", Component: DevelopmentPhaseSection },
  { date: "Сентябрь 2024", Component: LaunchPhaseSection },
  { date: "Сентябрь 2024", Component: AdvancedAutomationSection },
];

export const Home = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen relative overflow-visible">
      {/* Desktop layout — preserved exactly as original */}
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame baseWidth={1920} baseHeight={749}>
          <div className="relative h-[749px] w-[1920px]">
        <OptimizationPhaseSection />
        <img
          className="absolute w-[955px] h-[200px] top-[11px] left-[496px]"
          alt="Union"
          src="https://c.animaapp.com/ZnSA1rtX/img/union.svg"
        />
        <RoadmapSection />
        <CustomAISection />
        <DevelopmentPhaseSection />
        <LaunchPhaseSection />
        <AdvancedAutomationSection />
        {[
          { top: 255, left: 389, label: "Ноябрь 2023" },
          { top: 255, left: 623, label: "Апрель 2024" },
          { top: 255, left: 857, label: "Июль 2024" },
          { top: 255, left: 1091, label: "Сентябрь 2024" },
          { top: 255, left: 1325, label: "Сентябрь 2024" },
        ].map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center justify-center gap-2.5 p-[15px] absolute bg-[#060c2499] rounded-xl border-[none] shadow-[var(--)] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none"
            style={{ top: item.top, left: item.left }}
          >
            <div className="w-fit mt-[-1.00px] font-medium text-y-c9z-sz text-[10px] leading-[12.0px] whitespace-nowrap relative [font-family:'Geologica',Helvetica] tracking-[0]">
              {item.label}
            </div>
          </div>
        ))}
          </div>
        </DesktopScaleFrame>
      </div>

      {/* Mobile / Tablet layout */}
      <div className="min-[1200px]:hidden flex flex-col items-center px-4 sm:px-6 md:px-10 py-8 sm:py-12 gap-6">
        {/* Title */}
        <h1 className="[font-family:'Geologica',Helvetica] font-bold text-center text-2xl sm:text-3xl md:text-4xl min-[1200px]:text-5xl leading-tight">
          <span className="text-[#08d070]">ДОРОЖНАЯ </span>
          <span className="text-white">КАРТА</span>
          <span className="text-[#08d070]"> AIHUB.</span>
          <span className="text-white">WORKS</span>
        </h1>

        {/* Decorative line */}
        <img
          className="w-full max-w-[600px] h-auto opacity-60"
          alt="Union"
          src="https://c.animaapp.com/ZnSA1rtX/img/union.svg"
        />

        {/* Cards grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 min-[1200px]:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl">
          {cards.map(({ date, Component }, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              {/* Date badge */}
              <div className="inline-flex items-center justify-center gap-2.5 p-3 bg-[#060c2499] rounded-xl backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(112deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
                <div className="font-medium text-y-c9z-sz text-xs sm:text-sm [font-family:'Geologica',Helvetica] whitespace-nowrap">
                  {date}
                </div>
              </div>
              {/* Card */}
              <Component mobile />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
