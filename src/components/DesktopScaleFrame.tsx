import { type ReactNode } from "react";

type DesktopScaleFrameProps = {
  baseWidth: number;
  baseHeight: number;
  minWidth?: number;
  contentLeft?: number;
  contentWidth?: number;
  targetWidth?: number;
  children: ReactNode;
};

export function DesktopScaleFrame({
  baseWidth,
  baseHeight,
  minWidth = 1200,
  contentLeft = 0,
  contentWidth,
  targetWidth,
  children,
}: DesktopScaleFrameProps): JSX.Element {
  const frameWidth = contentWidth ?? baseWidth;
  const resolvedTargetWidth = targetWidth ?? minWidth;
  const scale = resolvedTargetWidth / frameWidth;

  return (
    <div
      className="relative mx-auto overflow-visible"
      style={{
        width: `${Math.round(frameWidth * scale)}px`,
        maxWidth: "100%",
        height: `${Math.round(baseHeight * scale)}px`,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `translateX(${-contentLeft}px) scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
