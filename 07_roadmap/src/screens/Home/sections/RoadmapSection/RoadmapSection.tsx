import type { CSSProperties } from "react";

import { useLanguage } from "../../../../../../src/i18n/LanguageContext";

type RoadmapSectionProps = {
  className?: string;
  style?: CSSProperties;
};

export const RoadmapSection = ({
  className = "",
  style,
}: RoadmapSectionProps): JSX.Element => {
  const { t } = useLanguage();

  return (
    <p
      className={`absolute top-[82px] left-[calc(50.00%_-_312px)] w-[653px] [font-family:'Geologica',Helvetica] font-bold text-transparent text-[64px] text-center tracking-[0] leading-[76.8px] ${className}`.trim()}
      style={style}
    >
      {t.roadmap.titleSpans.map((span, i) => (
        <span key={i} className={span.green ? "text-[#08d070]" : "text-[#ffffff]"}>{span.text}</span>
      ))}
    </p>
  );
};
