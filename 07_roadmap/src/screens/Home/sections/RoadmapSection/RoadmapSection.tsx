import type { CSSProperties } from "react";

type RoadmapSectionProps = {
  className?: string;
  style?: CSSProperties;
};

export const RoadmapSection = ({
  className = "",
  style,
}: RoadmapSectionProps): JSX.Element => {
  return (
    <p
      className={`absolute top-[82px] left-[calc(50.00%_-_312px)] w-[653px] [font-family:'Geologica',Helvetica] font-bold text-transparent text-[64px] text-center tracking-[0] leading-[76.8px] ${className}`.trim()}
      style={style}
    >
      <span className="text-[#08d070]">ДОРОЖНАЯ </span>
      <span className="text-[#ffffff]">КАРТА</span>
      <span className="text-[#08d070]"> AIHUB.</span>
      <span className="text-[#ffffff]">WORKS</span>
    </p>
  );
};
