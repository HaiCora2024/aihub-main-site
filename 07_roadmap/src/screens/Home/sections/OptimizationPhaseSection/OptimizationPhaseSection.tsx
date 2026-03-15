import type { CSSProperties } from "react";

type OptimizationPhaseSectionProps = {
  mobile?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const OptimizationPhaseSection = ({
  mobile,
  className = "",
  style,
}: OptimizationPhaseSectionProps): JSX.Element => {
  const bulletItems = [
    {
      id: 1,
      text: (
        <>
          No-code решения с Make и Zapier
          <br className="hidden min-[1200px]:inline" />
          {" "}для автоматизации задач
        </>
      ),
    },
    {
      id: 2,
      text: (
        <>
          Обработка и рерайт контента
          <br className="hidden min-[1200px]:inline" />
          {" "}на основе ChatGPT
        </>
      ),
    },
    {
      id: 3,
      text: <>Интеграция с Odoo для внутреннего управления и CRM</>,
    },
    {
      id: 4,
      text: <>Создание инфраструктуры</>,
    },
  ];

  if (mobile) {
    return (
      <div
        className={`roadmap-card flex flex-col w-full items-start gap-5 sm:gap-7 pt-7 sm:pt-9 pb-6 sm:pb-8 px-4 sm:px-5 rounded-2xl bg-[linear-gradient(180deg,rgba(8,208,112,0.15)_0%,rgba(8,208,112,0)_100%)] transition-all duration-300 hover:bg-[linear-gradient(180deg,rgba(8,208,112,0.3)_0%,rgba(8,208,112,0.05)_100%)] hover:shadow-[0_0_30px_rgba(8,208,112,0.15)] ${className}`.trim()}
        style={style}
      >
        <div className="flex flex-col items-start gap-2.5 w-full">
          <div className="[font-family:'Geologica',Helvetica] font-medium text-x-9qhb-f5 text-base sm:text-lg leading-snug">
            Запуск
          </div>
          <p className="[font-family:'Geologica',Helvetica] font-normal text-white text-xs sm:text-sm leading-relaxed">
            Мы стартовали в 01/11/2023 с автоматизации простых бизнес-процессов и интеграции промптов GPT в рабочий поток.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:gap-4 w-full">
          {bulletItems.map((item) => (
            <div key={item.id} className="flex items-start gap-1.5 w-full">
              <div className="inline-flex items-center justify-center gap-2.5 flex-shrink-0 mt-1">
                <div className="relative w-1.5 h-1.5">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-y-c9z-sz rounded-[3px] blur-[3px] opacity-60" />
                  <div className="absolute top-px left-px w-1 h-1 rounded-sm [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,224,77,1)_0%,rgba(255,212,9,1)_100%)]" />
                </div>
              </div>
              <p className="flex-1 [font-family:'Geologica',Helvetica] font-light text-white text-[11px] sm:text-xs leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-[204px] items-start gap-[29px] pt-[35px] pb-[30px] px-[15px] absolute top-[270px] left-[404px] rounded-[20px] bg-[linear-gradient(180deg,rgba(8,208,112,0.15)_0%,rgba(8,208,112,0)_100%)] ${className}`.trim()}
      style={style}
    >
      <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="self-stretch mt-[-1.00px] font-medium text-x-9qhb-f5 text-base leading-[19.2px] relative [font-family:'Geologica',Helvetica] tracking-[0]">
          Запуск
        </div>
        <p className="relative self-stretch [font-family:'Geologica',Helvetica] font-normal text-white text-xs tracking-[0] leading-[14.4px]">
          Мы стартовали в 01/11/2023 <br />с автоматизации простых
          бизнес-процессов <br />и интеграции промптов <br />
          GPT в рабочий поток.
        </p>
      </div>
      <div className="flex flex-col items-start gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
        {bulletItems.map((item) => (
          <div key={item.id} className="flex items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
              <div className="relative w-1.5 h-1.5">
                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-y-c9z-sz rounded-[3px] blur-[3px] opacity-60" />
                <div className="absolute top-px left-px w-1 h-1 rounded-sm [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,224,77,1)_0%,rgba(255,212,9,1)_100%)]" />
              </div>
            </div>
            <p className="relative flex-1 mt-[-1.00px] [font-family:'Geologica',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[12.0px]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
