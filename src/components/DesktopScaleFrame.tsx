import { type ReactNode, useEffect, useState } from "react";

type DesktopScaleFrameProps = {
  baseWidth: number;
  baseHeight: number;
  minWidth?: number;
  children: ReactNode;
};

function getScale(baseWidth: number, minWidth: number) {
  if (typeof window === "undefined") {
    return 1;
  }

  const viewportWidth = document.documentElement.clientWidth;

  if (viewportWidth >= baseWidth) {
    return 1;
  }

  if (viewportWidth <= minWidth) {
    return minWidth / baseWidth;
  }

  return viewportWidth / baseWidth;
}

export function DesktopScaleFrame({
  baseWidth,
  baseHeight,
  minWidth = 1200,
  children,
}: DesktopScaleFrameProps): JSX.Element {
  const [scale, setScale] = useState(() => getScale(baseWidth, minWidth));

  useEffect(() => {
    const updateScale = () => {
      setScale(getScale(baseWidth, minWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth, minWidth]);

  return (
    <div
      className="relative mx-auto w-full overflow-visible"
      style={{ height: `${Math.round(baseHeight * scale)}px` }}
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
