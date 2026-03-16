import React, { type CSSProperties } from "react";

import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";

const getRevealStyle = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}s` }) as CSSProperties;

const getRevealClassName = (isVisible: boolean, baseClassName: string) =>
  `${baseClassName} reveal-sequence-item${isVisible ? " reveal-sequence-item--visible" : ""}`;

const GreenDot = () => (
  <div className="inline-flex items-center justify-center gap-2.5 flex-shrink-0">
    <div className="relative w-2 h-2">
      <div className="absolute top-0 left-0 w-2 h-2 bg-a-l-tq-4p rounded blur-[3px] opacity-60" />
      <div className="absolute top-px left-px w-1.5 h-1.5 rounded-[3px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(100,255,181,1)_0%,rgba(8,208,112,1)_100%)]" />
    </div>
  </div>
);

const IntegrationItem = ({
  label,
  className = "",
  style,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
}) => (
  <div className={`inline-flex items-center gap-[3px] flex-shrink-0 ${className}`.trim()} style={style}>
    <GreenDot />
    <div className="font-geologica font-light text-white text-xs sm:text-sm leading-tight whitespace-nowrap">
      {label}
    </div>
  </div>
);

const CategoryBadge = ({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    className={`inline-flex items-center justify-center gap-2.5 px-3 sm:px-[15px] py-2 sm:py-2.5 bg-[#060c2499] rounded-xl backdrop-blur-[10px] relative before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(135deg,rgba(8,208,112,1)_0%,rgba(8,208,112,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none ${className}`.trim()}
    style={style}
  >
    {children}
  </div>
);

const CategoryBadgeText = ({
  label,
  className,
  style,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
}) => (
  <CategoryBadge className={className} style={style}>
    <div className="font-geologica font-semibold text-a-l-tq-4p text-xs sm:text-sm leading-tight whitespace-nowrap">
      {label}
    </div>
  </CategoryBadge>
);

const IntegrationColumn = ({
  items,
  isVisible,
  startDelay,
}: {
  items: string[];
  isVisible: boolean;
  startDelay: number;
}) => (
  <div className="flex flex-col items-start gap-2.5 sm:gap-[15px] flex-shrink-0">
    {items.map((item, index) => (
      <IntegrationItem
        key={item}
        label={item}
        className={getRevealClassName(isVisible, "")}
        style={getRevealStyle(startDelay + index * 0.05)}
      />
    ))}
  </div>
);

const IntegrationCard = ({
  label,
  columns,
  badgeContent,
  isVisible,
  revealDelay,
}: {
  label?: string;
  columns: string[][];
  badgeContent?: React.ReactNode;
  isVisible: boolean;
  revealDelay: number;
}) => (
  <div className="relative pt-4 sm:pt-5 group">
    <div className="absolute top-0 left-0 z-10">
      {badgeContent ? (
        <CategoryBadge
          className={getRevealClassName(isVisible, "")}
          style={getRevealStyle(revealDelay)}
        >
          {badgeContent}
        </CategoryBadge>
      ) : (
        <CategoryBadgeText
          label={label!}
          className={getRevealClassName(isVisible, "")}
          style={getRevealStyle(revealDelay)}
        />
      )}
    </div>
    <div
      className={getRevealClassName(
        isVisible,
        "flex flex-wrap items-start gap-4 sm:gap-[45px] px-4 sm:px-[30px] py-4 sm:py-5 mt-1 rounded-[20px] card-gradient transition-all duration-300",
      )}
      style={getRevealStyle(revealDelay + 0.08)}
    >
      {columns.map((col, i) => (
        <IntegrationColumn
          key={i}
          items={col}
          isVisible={isVisible}
          startDelay={revealDelay + 0.18 + i * 0.05}
        />
      ))}
    </div>
  </div>
);

const crmCol1 = ["Intercom", "Odoo", "Pipedrive", "Monday.com"];
const crmCol2 = ["AMOCRM", "HubSpot", "Asana"];

const cloudCol1 = ["Amazon EventBridge", "Unstructured.IO", "FAL", "Zoom"];
const cloudCol2 = ["Dropbox", "DocuSign", "Workday", "Shopify"];
const cloudCol3 = ["RingCentral", "Box", "TheTradeDesk", "OpenWeatherAPI"];

const devCol1 = ["Twilio", "Atlassian"];
const devCol2 = ["Slack", "Unity"];
const devCol3 = ["Datadog", "Langchain"];

const dataCol1 = ["Splunk", "Snowflake"];
const dataCol2 = ["MongoDB", "Databricks"];
const dataCol3 = ["Elastic"];

const llmCol1 = ["OpenAI", "Meta"];
const llmCol2 = ["Anthropic", "CorpGPT"];

const infraCol1 = ["AWS", "Nvidia"];
const infraCol2 = ["Azure", "Google Cloud"];
const infraCol3 = ["Vercel", "Netlify"];

export const Home = (): JSX.Element => {
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();

  return (
    <div ref={ref} className="w-full relative overflow-visible">
      {/* Background decorative elements */}
      <div className="absolute top-5 left-1/2 -translate-x-1/4 w-[30vw] max-w-[456px] aspect-square bg-JMR-sn-8 rounded-full blur-[200px] opacity-20 pointer-events-none" />

      <div className="absolute top-[50px] left-1/2 ml-[200px] -translate-x-1/3 w-[28vw] max-w-[529px] opacity-40 pointer-events-none hidden min-[1200px]:block">
        <div className="w-full aspect-[529/709] bg-[url(https://c.animaapp.com/C2kc9y9O/img/egg-2.png)] bg-cover bg-center">
          <img
            className="w-full h-full object-cover"
            alt="Egg"
            src="https://c.animaapp.com/C2kc9y9O/img/egg-3.png"
          />
        </div>
      </div>

      <img
        className="absolute top-[267px] left-1/2 ml-[150px] w-[13vw] max-w-[252px] pointer-events-none hidden min-[1200px]:block"
        alt="Union"
        src="https://c.animaapp.com/C2kc9y9O/img/union.svg"
      />

      <img
        className="absolute w-[26vw] max-w-[498px] top-2.5 left-1/4 pointer-events-none hidden min-[1200px]:block"
        alt="Union"
        src="https://c.animaapp.com/C2kc9y9O/img/union-1.svg"
      />

      <img
        className="absolute top-4 left-[45%] w-[17vw] max-w-[324px] pointer-events-none hidden min-[1200px]:block"
        alt="Ellipse"
        src="https://c.animaapp.com/C2kc9y9O/img/ellipse-8841.svg"
      />

      <img
        className="absolute top-2.5 left-[38%] w-[22vw] max-w-[428px] pointer-events-none hidden min-[1200px]:block"
        alt="Ellipse"
        src="https://c.animaapp.com/C2kc9y9O/img/ellipse-8843.svg"
      />

      <img
        className="absolute top-0 left-[33%] w-[30vw] max-w-[578px] pointer-events-none hidden min-[1200px]:block"
        alt="Ellipse"
        src="https://c.animaapp.com/C2kc9y9O/img/ellipse-8844.svg"
      />

      <img
        className="absolute top-[526px] right-[10%] w-[15vw] max-w-[286px] pointer-events-none hidden min-[1200px]:block"
        alt="Ellipse"
        src="https://c.animaapp.com/C2kc9y9O/img/ellipse-8842.svg"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-5 min-[1200px]:px-3 py-8 sm:py-12 md:py-14">
        {/* Heading */}
        <h1
          className={getRevealClassName(
            isVisible,
            "font-geologica font-bold text-lg sm:text-xl md:text-2xl min-[1200px]:text-[32px] leading-snug min-[1200px]:leading-[38.4px] mb-8 sm:mb-10 md:mb-14 max-w-4xl",
          )}
          style={getRevealStyle(0.04)}
        >
          <span className="text-white">
            МЫ НЕ ЛОМАЕМ СУЩЕСТВУЮЩИЕ ПРОЦЕССЫ,{" "}
            <br className="hidden sm:block" />
          </span>
          <span className="text-[#ffd409]">А УСИЛИВАЕМ ИХ, БЛАГОДАРЯ AI</span>
          <span className="text-white">.</span>
        </h1>

        {/* Integration grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 min-[1200px]:gap-10">
          {/* Left column */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <IntegrationCard
              label="CRM"
              columns={[crmCol1, crmCol2]}
              isVisible={isVisible}
              revealDelay={0.16}
            />
            <IntegrationCard
              label="Cloud Apps"
              columns={[cloudCol1, cloudCol2, cloudCol3]}
              isVisible={isVisible}
              revealDelay={0.32}
            />
            <IntegrationCard
              label="Development"
              columns={[devCol1, devCol2, devCol3]}
              isVisible={isVisible}
              revealDelay={0.48}
            />
            <IntegrationCard
              label="Data"
              columns={[dataCol1, dataCol2, dataCol3]}
              isVisible={isVisible}
              revealDelay={0.64}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <IntegrationCard
              columns={[llmCol1, llmCol2]}
              isVisible={isVisible}
              revealDelay={0.24}
              badgeContent={
                <p className="font-geologica font-normal text-a-l-tq-4p text-xs sm:text-sm leading-tight whitespace-nowrap">
                  <span className="font-semibold">LLM </span>
                  <span className="text-[10px] leading-[12px]">
                    (Large Language Models)
                  </span>
                </p>
              }
            />
            <IntegrationCard
              label="Infrastructure"
              columns={[infraCol1, infraCol2, infraCol3]}
              isVisible={isVisible}
              revealDelay={0.4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
