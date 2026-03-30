import type { CSSProperties } from "react";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";
import { useLanguage } from "../../../../src/i18n/LanguageContext";

type DesktopStep = {
  number: string;
  numberLeft: string;
  dotLeft: string;
  lineLeft: string;
};

const desktopSteps: DesktopStep[] = [
  { number: "1", numberLeft: "left-[490px]", dotLeft: "left-[481px]", lineLeft: "left-[489px]" },
  { number: "2", numberLeft: "left-[715px]", dotLeft: "left-[716px]", lineLeft: "left-[724px]" },
  { number: "3", numberLeft: "left-[958px]", dotLeft: "left-[953px]", lineLeft: "left-[961px]" },
  { number: "4", numberLeft: "left-[1194px]", dotLeft: "left-[1188px]", lineLeft: "left-[1196px]" },
];

const getDelayStyle = (index: number, offset = 0): CSSProperties =>
  ({ "--timeline-delay": `${index * 0.18 + offset}s` }) as CSSProperties;

export const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();
  const getTimelineClassName = (
    baseClassName: string,
    animationClassName: string,
    pendingClassName: string,
  ) => `${baseClassName} ${isVisible ? animationClassName : pendingClassName}`;

  const steps = t.workProcess.steps;

  return (
    <div ref={ref} className="w-full relative overflow-visible" data-model-id="316:6667">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={505}
          contentLeft={380}
          contentWidth={1160}
          targetWidth={1140}
        >
          <div className="relative h-[505px] w-[1920px]">
          <p
            className={getTimelineClassName(
              "absolute top-[92px] left-[calc(50.00%_-_570px)] w-[1140px] font-bold text-transparent text-[64px] text-center leading-[76.8px] [font-family:'Geologica',Helvetica] tracking-[0]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
          >
            <span className="text-[#ffffff]">{t.workProcess.title1}</span>
            <span className="text-[#bf5bf3]">{t.workProcess.title2}</span>
          </p>

          <img
            className={getTimelineClassName(
              "absolute w-[1160px] h-[166px] top-5 left-[380px]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
            style={getDelayStyle(0, 0.08)}
            alt="Union"
            src="https://c.animaapp.com/lSZ9nsWk/img/union.svg"
          />

          <img
            className={getTimelineClassName(
              "absolute top-[318px] left-[488px] w-[945px] h-0.5",
              "timeline-line-grow",
              "timeline-line-grow-pending",
            )}
            style={getDelayStyle(0, 0.15)}
            alt="Vector"
            src="https://c.animaapp.com/lSZ9nsWk/img/vector-59.svg"
          />

          {desktopSteps.map((step, index) => (
            <img
              key={`line-${index}`}
              className={getTimelineClassName(
                `absolute top-80 ${step.lineLeft} w-0.5 h-[185px]`,
                "timeline-line-grow-vertical",
                "timeline-line-grow-vertical-pending",
              )}
              style={getDelayStyle(index, 0.22)}
              alt="Vector"
              src={`https://c.animaapp.com/lSZ9nsWk/img/vector-${60 + index}.svg`}
            />
          ))}

          {desktopSteps.map((step, index) => (
            <div
              key={`dot-${index}`}
              className={getTimelineClassName(
                `${step.dotLeft} absolute top-[311px] w-[18px] h-[18px] flex bg-ptd-d-av rounded-[9px] blur-[6px]`,
                "timeline-appear",
                "timeline-appear-pending",
              )}
              style={getDelayStyle(index, 0.25)}
            >
              <div className="mt-0.5 w-3.5 h-3.5 ml-0.5 rounded-[7px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,228,100,1)_0%,rgba(255,212,9,1)_100%)]" />
            </div>
          ))}

          {desktopSteps.map((step, index) => (
            <div
              key={`number-${index}`}
              className={getTimelineClassName(
                `${step.numberLeft} absolute top-[271px] bg-[linear-gradient(180deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] opacity-30 [font-family:'Manrope',Helvetica] font-extrabold text-transparent text-8xl text-center tracking-[0] leading-[115.2px] whitespace-nowrap`,
                "timeline-appear",
                "timeline-appear-pending",
              )}
              style={getDelayStyle(index, 0.3)}
            >
              {step.number}
            </div>
          ))}

          {/* Step 1 */}
          <div
            className={getTimelineClassName(
              "inline-flex flex-col items-start gap-[30px] absolute top-[359px] left-[482px]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
            style={getDelayStyle(0, 0.32)}
          >
            {steps[0].map((item, itemIndex) => (
              <div key={itemIndex} className={`flex items-${item.type === "yellow" ? "start" : "center"} gap-2.5 relative self-stretch w-full flex-[0_0_auto]`}>
                <div className="relative w-4 h-4">
                  {item.type === "yellow" ? (
                    <>
                      <div className="absolute top-px left-px w-3.5 h-3.5 bg-ptd-d-av rounded-[7px] blur-[6px]" />
                      <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,222,65,1)_0%,rgba(255,212,9,1)_100%)]" />
                    </>
                  ) : (
                    <>
                      <div className="absolute top-[calc(50.00%_-_5px)] left-[calc(50.00%_-_5px)] w-2.5 h-2.5 bg-j-fvz-ag rounded-[5px] blur-[6px]" />
                      <div className="absolute top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 rounded-[3px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
                    </>
                  )}
                </div>
                <div className={`flex flex-col w-[210px] items-start gap-5 pt-[3px] pb-0 px-0 relative ${item.type === "purple" ? "flex-1 grow" : ""}`}>
                  <div className={`relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] ${item.type === "yellow" ? "font-medium text-j-fvz-ag text-base leading-[19.2px]" : "font-normal text-white text-sm leading-[16.8px]"} tracking-[0]`}>
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step 2 */}
          <div
            className={getTimelineClassName(
              "inline-flex flex-col items-start gap-[30px] absolute top-[359px] left-[717px]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
            style={getDelayStyle(1, 0.32)}
          >
            {steps[1].map((item, itemIndex) => (
              <div key={itemIndex} className={`flex items-${item.type === "yellow" ? "start" : "center"} gap-2.5 relative self-stretch w-full flex-[0_0_auto]`}>
                <div className="relative w-4 h-4">
                  {item.type === "yellow" ? (
                    <>
                      <div className="absolute top-px left-px w-3.5 h-3.5 bg-ptd-d-av rounded-[7px] blur-[6px]" />
                      <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,222,65,1)_0%,rgba(255,212,9,1)_100%)]" />
                    </>
                  ) : (
                    <>
                      <div className="absolute top-[calc(50.00%_-_5px)] left-[calc(50.00%_-_5px)] w-2.5 h-2.5 bg-j-fvz-ag rounded-[5px] blur-[6px]" />
                      <div className="absolute top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 rounded-[3px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
                    </>
                  )}
                </div>
                <div className={`flex flex-col w-[210px] items-start gap-5 pt-[3px] pb-0 px-0 relative ${item.type === "purple" ? "flex-1 grow" : ""}`}>
                  <p className={`relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] ${item.type === "yellow" ? "font-medium text-j-fvz-ag text-base leading-[19.2px]" : "font-normal text-white text-sm leading-[16.8px]"} tracking-[0]`}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Step 3 */}
          <div
            className={getTimelineClassName(
              "flex flex-col w-[222px] items-start gap-[30px] absolute top-[359px] left-[954px]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
            style={getDelayStyle(2, 0.32)}
          >
            {steps[2].map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative w-4 h-4">
                  <div className="absolute top-px left-px w-3.5 h-3.5 bg-ptd-d-av rounded-[7px] blur-[6px]" />
                  <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,222,65,1)_0%,rgba(255,212,9,1)_100%)]" />
                </div>
                <div className="w-[210px] pt-[3px] pb-0 px-0 mr-[-14.00px] flex flex-col items-start gap-5 relative">
                  <div className="relative self-stretch mt-[-1.00px] font-medium text-j-fvz-ag text-base leading-[19.2px] [font-family:'Geologica',Helvetica] tracking-[0]">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Step 4 */}
          <div
            className={getTimelineClassName(
              "flex flex-col w-[222px] items-start gap-[30px] absolute top-[359px] left-[1189px]",
              "timeline-appear",
              "timeline-appear-pending",
            )}
            style={getDelayStyle(3, 0.32)}
          >
            {steps[3].map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative w-4 h-4">
                  <div className="absolute top-px left-px w-3.5 h-3.5 bg-ptd-d-av rounded-[7px] blur-[6px]" />
                  <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,222,65,1)_0%,rgba(255,212,9,1)_100%)]" />
                </div>
                <div className="w-[210px] pt-[3px] pb-0 px-0 mr-[-14.00px] flex flex-col items-start gap-5 relative">
                  <div className="font-medium text-j-fvz-ag text-base leading-[19.2px] relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] tracking-[0]">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden max-w-[430px] mx-auto px-5 pt-12 pb-10">
        <p
          className={getTimelineClassName(
            "font-bold text-transparent text-[32px] leading-[38.4px] [font-family:'Geologica',Helvetica] tracking-[0]",
            "timeline-appear",
            "timeline-appear-pending",
          )}
        >
          <span className="text-white">{t.workProcess.title1}</span>
          <span className="text-[#bf5bf3]">{t.workProcess.title2}</span>
        </p>

        <div className="relative mt-10 pl-8">
          <div
            className={getTimelineClassName(
              "absolute left-[7px] top-3 bottom-3 w-0.5 bg-white/20",
              "timeline-line-grow-vertical",
              "timeline-line-grow-vertical-pending",
            )}
          />

          {steps.map((stepItems, index) => (
            <div
              key={index}
              className={getTimelineClassName(
                "relative pb-8",
                "timeline-appear",
                "timeline-appear-pending",
              )}
              style={getDelayStyle(index, 0.1)}
            >
              <div className="absolute left-[-31px] top-[10px] w-[18px] h-[18px] flex bg-ptd-d-av rounded-[9px] blur-[6px]">
                <div className="mt-0.5 w-3.5 h-3.5 ml-0.5 rounded-[7px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,228,100,1)_0%,rgba(255,212,9,1)_100%)]" />
              </div>

              <div className="opacity-30 [font-family:'Manrope',Helvetica] font-extrabold text-transparent text-[44px] leading-[52px] bg-[linear-gradient(180deg,rgba(255,212,9,1)_0%,rgba(255,212,9,0)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]">
                {index + 1}
              </div>

              <div className="mt-2 space-y-3">
                {stepItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2.5">
                    <div className="relative w-4 h-4 mt-0.5">
                      {item.type === "yellow" ? (
                        <>
                          <div className="absolute top-px left-px w-3.5 h-3.5 bg-ptd-d-av rounded-[7px] blur-[6px]" />
                          <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,222,65,1)_0%,rgba(255,212,9,1)_100%)]" />
                        </>
                      ) : (
                        <>
                          <div className="absolute top-[calc(50.00%_-_5px)] left-[calc(50.00%_-_5px)] w-2.5 h-2.5 bg-j-fvz-ag rounded-[5px] blur-[6px]" />
                          <div className="absolute top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 rounded-[3px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
                        </>
                      )}
                    </div>
                    <p
                      className={`${item.type === "yellow" ? "font-medium text-j-fvz-ag text-[15px] leading-[18px]" : "font-normal text-white text-sm leading-[16.8px]"} [font-family:'Geologica',Helvetica] tracking-[0]`}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
