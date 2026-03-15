import type { CSSProperties } from "react";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";

const getRevealStyle = (index: number, offset = 0): CSSProperties =>
  ({ "--reveal-delay": `${offset + index * 0.12}s` }) as CSSProperties;

export const Home = (): JSX.Element => {
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();
  const revealClassName = (baseClassName: string) =>
    `${baseClassName} reveal-sequence-item${isVisible ? " reveal-sequence-item--visible" : ""}`;

  return (
    <div ref={ref} className="w-full relative overflow-visible" data-model-id="316:6256">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={540}
          contentLeft={389}
          contentWidth={1141}
          targetWidth={1140}
        >
          <div className="relative h-[540px] w-[1920px]">
            <img
              className={revealClassName("absolute top-[19px] left-[calc(50.00%_-_516px)] w-[503px] h-[120px]")}
              style={getRevealStyle(0)}
              alt="Clients"
              src="https://c.animaapp.com/dNarZ28i/img/clients.png"
            />

            <p
              className={revealClassName("absolute top-[84px] left-[389px] w-[653px] [font-family:'Geologica',Helvetica] font-bold text-transparent text-[32px] leading-[38.4px]")}
              style={getRevealStyle(1, 0.02)}
            >
              <span className="text-[#0385ff]">НАШИ </span>
              <span className="text-[#ffffff]">КЛИЕНТЫ</span>
            </p>

            <div
              className={revealClassName("absolute top-[159px] left-[390px] flex h-[171px] w-[262px] items-center justify-center overflow-hidden rounded-[30px] bg-[#060c2499] shadow-[inset_0_0_20px_rgba(191,91,243,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(191,91,243,0.35)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[30px] before:p-0.5 before:content-[''] before:[background:linear-gradient(102deg,rgba(191,91,243,1)_0%,rgba(191,91,243,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]")}
              style={getRevealStyle(2, 0.06)}
            >
              <img
                className="ml-px h-[45px] w-[135px] object-cover"
                alt="Img photoroom"
                src="https://c.animaapp.com/dNarZ28i/img/img-9860-photoroom@2x.png"
              />
            </div>

            <div
              className={revealClassName("absolute top-[159px] left-[682px] h-[171px] w-[165px] overflow-hidden rounded-[30px] shadow-[inset_0_0_20px_rgba(3,133,255,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(3,133,255,0.35)]")}
              style={getRevealStyle(3, 0.06)}
            >
              <img
                className="h-full w-full object-cover"
                alt="Frame"
                src="https://c.animaapp.com/dNarZ28i/img/frame-1948760012.svg"
              />
            </div>

            <div
              className={revealClassName("absolute top-[159px] left-[877px] flex h-[171px] w-[360px] items-center justify-center overflow-hidden rounded-[30px] bg-[#060c2499] shadow-[inset_0_0_20px_rgba(254,138,4,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(254,138,4,0.35)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[30px] before:p-0.5 before:content-[''] before:[background:linear-gradient(100deg,rgba(254,138,4,1)_0%,rgba(254,138,4,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]")}
              style={getRevealStyle(4, 0.06)}
            >
              <img
                className="mt-px h-[104px] w-[104px] object-cover"
                alt="Yarhotel photoroom"
                src="https://c.animaapp.com/dNarZ28i/img/yarhotel-photoroom@2x.png"
              />
            </div>

            <div
              className={revealClassName("absolute top-[159px] left-[1267px] h-[171px] w-[262px] overflow-hidden rounded-[30px] shadow-[inset_0_0_20px_rgba(255,40,40,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(255,40,40,0.35)]")}
              style={getRevealStyle(5, 0.06)}
            >
              <img
                className="h-full w-full object-cover"
                alt="Frame"
                src="https://c.animaapp.com/dNarZ28i/img/frame-1948760016.svg"
              />
            </div>

            <div
              className={revealClassName("absolute top-[351px] left-[390px] h-[159px] w-[652px] overflow-hidden rounded-[30px] shadow-[inset_0_0_20px_rgba(8,208,112,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(8,208,112,0.35)]")}
              style={getRevealStyle(6, 0.06)}
            >
              <img
                className="h-full w-full object-cover"
                alt="Frame"
                src="https://c.animaapp.com/dNarZ28i/img/frame-1948760013.svg"
              />
            </div>

            <div
              className={revealClassName("absolute top-[350px] left-[1072px] h-40 w-[458px] overflow-hidden rounded-[30px] shadow-[inset_0_0_20px_rgba(255,212,9,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(255,212,9,0.35)]")}
              style={getRevealStyle(7, 0.06)}
            >
              <img
                className="h-full w-full object-cover"
                alt="Frame"
                src="https://c.animaapp.com/dNarZ28i/img/frame-1948760038.svg"
              />
            </div>
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8 md:px-12">
        <img
          className={revealClassName("mx-auto mt-4 block h-auto w-[60%] max-w-[503px]")}
          style={getRevealStyle(0)}
          alt="Clients"
          src="https://c.animaapp.com/dNarZ28i/img/clients.png"
        />

        <p
          className={revealClassName("mt-4 px-4 text-center [font-family:'Geologica',Helvetica] font-bold text-transparent text-xl leading-snug sm:text-2xl")}
          style={getRevealStyle(1, 0.02)}
        >
          <span className="text-[#0385ff]">НАШИ </span>
          <span className="text-[#ffffff]">КЛИЕНТЫ</span>
        </p>

        <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-3 sm:gap-4 md:gap-5">
          <div
            className={revealClassName("relative flex aspect-[262/171] items-center justify-center overflow-hidden rounded-2xl bg-[#060c2499] shadow-[inset_0_0_20px_rgba(191,91,243,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(191,91,243,0.35)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-2xl before:p-0.5 before:content-[''] before:[background:linear-gradient(102deg,rgba(191,91,243,1)_0%,rgba(191,91,243,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]")}
            style={getRevealStyle(2, 0.06)}
          >
            <img
              className="h-[45%] w-auto object-cover"
              alt="Img photoroom"
              src="https://c.animaapp.com/dNarZ28i/img/img-9860-photoroom@2x.png"
            />
          </div>

          <div
            className={revealClassName("aspect-[165/171] overflow-hidden rounded-2xl shadow-[inset_0_0_20px_rgba(3,133,255,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(3,133,255,0.35)]")}
            style={getRevealStyle(3, 0.06)}
          >
            <img
              className="h-full w-full object-cover"
              alt="Frame"
              src="https://c.animaapp.com/dNarZ28i/img/frame-1948760012.svg"
            />
          </div>

          <div
            className={revealClassName("relative col-span-2 flex aspect-[360/171] items-center justify-center overflow-hidden rounded-2xl bg-[#060c2499] shadow-[inset_0_0_20px_rgba(254,138,4,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(254,138,4,0.35)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-2xl before:p-0.5 before:content-[''] before:[background:linear-gradient(100deg,rgba(254,138,4,1)_0%,rgba(254,138,4,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] sm:col-span-1")}
            style={getRevealStyle(4, 0.06)}
          >
            <img
              className="h-[60%] w-auto object-cover"
              alt="Yarhotel photoroom"
              src="https://c.animaapp.com/dNarZ28i/img/yarhotel-photoroom@2x.png"
            />
          </div>

          <div
            className={revealClassName("col-span-2 aspect-[262/171] overflow-hidden rounded-2xl shadow-[inset_0_0_20px_rgba(255,40,40,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(255,40,40,0.35)] sm:col-span-1")}
            style={getRevealStyle(5, 0.06)}
          >
            <img
              className="h-full w-full object-cover"
              alt="Frame"
              src="https://c.animaapp.com/dNarZ28i/img/frame-1948760016.svg"
            />
          </div>

          <div
            className={revealClassName("col-span-2 aspect-[652/159] overflow-hidden rounded-2xl shadow-[inset_0_0_20px_rgba(8,208,112,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(8,208,112,0.35)] sm:col-span-2")}
            style={getRevealStyle(6, 0.06)}
          >
            <img
              className="h-full w-full object-cover"
              alt="Frame"
              src="https://c.animaapp.com/dNarZ28i/img/frame-1948760013.svg"
            />
          </div>

          <div
            className={revealClassName("col-span-2 aspect-[458/160] overflow-hidden rounded-2xl shadow-[inset_0_0_20px_rgba(255,212,9,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_0_40px_rgba(255,212,9,0.35)] sm:col-span-1")}
            style={getRevealStyle(7, 0.06)}
          >
            <img
              className="h-full w-full object-cover"
              alt="Frame"
              src="https://c.animaapp.com/dNarZ28i/img/frame-1948760038.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
