import type { CSSProperties } from "react";

import { DesktopScaleFrame } from "../../../../src/components/DesktopScaleFrame";
import { useRevealOnView } from "../../../../src/hooks/useRevealOnView";

const serviceItems = [
  {
    title: "Виртуальные сотрудники",
    text:
      "Сократите расходы на поддержку клиентов в 3 раза. Голосовые и текстовые AI-ассистенты встраиваются в ваши каналы связи, работают 24/7 и помогают закрывать рутинные запросы без перегруза команды.",
  },
  {
    title: "Автоматизация бизнес-процессов",
    text:
      "Освободите сотрудников от рутины и ускорьте работу в 5-10 раз: обработка данных, создание контента, заполнение документов, ведение отчетности и другие повторяемые операции.",
  },
  {
    title: "AI аналитика",
    text:
      "Получайте структурированные отчеты, распознавание данных, прогнозы и кастомную аналитику. Мы можем анализировать текст, цифры, голос и видео для принятия более точных решений.",
  },
  {
    title: "Рекомендательные системы",
    text:
      "Увеличьте средний чек на 20-30% через персонализацию, умные рекомендации, подборки товаров и выявление скрытых закономерностей в поведении пользователей.",
  },
];

const getRevealStyle = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}s` }) as CSSProperties;

export const Home = (): JSX.Element => {
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>();
  const getRevealClassName = (baseClassName: string) =>
    `${baseClassName} reveal-sequence-item${isVisible ? " reveal-sequence-item--visible" : ""}`;
  const getAnimatedClassName = (baseClassName: string, animationClassName: string) =>
    `${baseClassName}${isVisible ? ` ${animationClassName}` : " opacity-0"}`;

  return (
    <div ref={ref} className="w-full relative overflow-visible" data-model-id="316:6212">
      <div className="hidden min-[1200px]:block">
        <DesktopScaleFrame
          baseWidth={1920}
          baseHeight={800}
          contentLeft={389}
          contentWidth={1141}
          targetWidth={1140}
        >
          <div className="relative h-[800px] w-[1920px]">
        <div
          className={getRevealClassName("animate-egg-float absolute top-[31px] left-[94px] w-[529px] h-[709px] flex opacity-40 bg-[url(https://c.animaapp.com/M0Twn3KI/img/egg-2.png)] bg-cover bg-[50%_50%]")}
          style={getRevealStyle(0.08)}
        >
          <img
            className="w-[529.44px] h-[709px] object-cover"
            alt="Egg"
            src="https://c.animaapp.com/M0Twn3KI/img/egg-3.png"
          />
        </div>

        <img
          className={getRevealClassName("absolute w-[782px] h-[153px] top-[334px] left-[389px]")}
          style={getRevealStyle(0.14)}
          alt="Union"
          src="https://c.animaapp.com/M0Twn3KI/img/union.svg"
        />

        <div
          className={getRevealClassName("w-[458px] top-[30px] left-[389px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.2)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.28)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.36)}
          >
            Виртуальные сотрудники
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.48)}
          >
            Сократите расходы на поддержку клиентов в 3 раза. Голосовые <br />и
            текстовые AI-ассистенты встраиваются в ваши каналы связи (web, TG,
            PMS), работают 24/7, мгновенно отвечают и решают проблемы, снижают
            стресс клиентов, находят с ними общий язык, отвечают на простые и
            сложные вопросы,предлагают скидки, облегчают задачи: запись на прием,
            обработка заказов, сбор обратной связи.
          </p>
        </div>

        <div
          className={getRevealClassName("w-[458px] top-[536px] left-[487px] rounded-[var(--collection-1-30)] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.36)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.44)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.52)}
          >
            Автоматизация бизнес-процессов
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.64)}
          >
            Освободите сотрудников от рутины и ускорьте работу в 5-10 раз. Вместо
            ручной обработки и структурирования данных <br />
            вы получаете автоматическое создание описаний товаров, статей, постов
            в соцсетях, обработку заказов, заполнение документов, ведение
            отчетности.
          </p>
        </div>

        <div
          className={getRevealClassName("w-[570px] top-[164px] left-[974px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.52)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.6)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch [font-family:'Geologica',Helvetica] font-medium text-x-2l-jg-IF text-lg tracking-[0] leading-[21.6px]", "animate-reveal-title")}
            style={getRevealStyle(0.68)}
          >
            AI аналитика
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.8)}
          >
            Вы загружаете свои данные и с помощью AI-инструментов получаете:
            структурированные отчеты, real-time обновления новостей/котировок,{" "}
            <br />
            кастомные отчеты, распознавание данных, прогнозы. Мы можем
            анализировать как текст и цифры, так и голос и даже видео, создавая
            удобные документы <br />
            для принятия верных решений.
          </p>
        </div>

        <div
          className={getRevealClassName("w-[361px] top-[545px] left-[1169px] flex flex-col items-start justify-center gap-5 absolute")}
          style={getRevealStyle(0.68)}
        >
          <div
            className={getAnimatedClassName("relative w-3.5 h-3.5 bg-x-2l-jg-IF rounded-[7px] blur-[5px]", "animate-reveal-dot")}
            style={getRevealStyle(0.76)}
          >
            <div className="relative top-0.5 left-0.5 w-2.5 h-2.5 rounded-[5px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(220,154,255,1)_0%,rgba(191,91,243,1)_100%)]" />
          </div>
          <div
            className={getAnimatedClassName("relative self-stretch font-medium text-x-2l-jg-IF text-lg leading-[21.6px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-title")}
            style={getRevealStyle(0.84)}
          >
            Рекомендательные системы
          </div>
          <p
            className={getAnimatedClassName("relative self-stretch font-light text-white text-sm leading-[16.8px] [font-family:'Geologica',Helvetica] tracking-[0]", "animate-reveal-text")}
            style={getRevealStyle(0.96)}
          >
            Увеличьте средний чек на 20-30%&nbsp;&nbsp;
            <br />
            без дополнительных расходов на рекламу <br />и взрастите вовлеченность
            клиентов через умные алгоритмы персонализации, подборки товаров,
            выявление поведенческих паттернов пользователей и поиск скрытых
            закономерностей.
          </p>
        </div>

        <p
          className={getRevealClassName("absolute top-[333px] left-[584px] w-[555px] font-bold text-transparent text-[64px] leading-[76.8px] [font-family:'Geologica',Helvetica] tracking-[0]")}
          style={getRevealStyle(0.18)}
        >
          <span className="text-[#bf5bf3]">НАШИ </span>
          <span className="text-[#ffffff]">НАПРАВЛЕНИЯ</span>
        </p>

        <img
          className={getRevealClassName("top-[73px] left-[974px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.3)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-53.svg"
        />
        <img
          className={getRevealClassName("left-[1169px] bottom-0 absolute w-px h-[498px]")}
          style={getRevealStyle(0.46)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-56.svg"
        />
        <img
          className={getRevealClassName("top-[13px] left-[388px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.14)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-54.svg"
        />
        <img
          className={getRevealClassName("top-[273px] left-[485px] absolute w-px h-[498px]")}
          style={getRevealStyle(0.38)}
          alt="Vector"
          src="https://c.animaapp.com/M0Twn3KI/img/vector-55.svg"
        />
          </div>
        </DesktopScaleFrame>
      </div>

      <div className="min-[1200px]:hidden relative px-5 sm:px-8 md:px-12 py-12 sm:py-16">
        <div className="absolute left-[-8%] top-0 w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] bg-x-2l-jg-IF rounded-full blur-[170px] opacity-10 pointer-events-none" />
        <div className="absolute left-[-12%] top-10 w-[42vw] max-w-[18rem] opacity-30 pointer-events-none">
          <img
            className="w-full h-auto object-cover"
            alt="Egg"
            src="https://c.animaapp.com/M0Twn3KI/img/egg-3.png"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p
              className={getRevealClassName("font-bold text-3xl leading-tight sm:text-5xl md:text-6xl [font-family:'Geologica',Helvetica]")}
              style={getRevealStyle(0.06)}
            >
              <span className="text-[#bf5bf3]">НАШИ </span>
              <span className="text-white">НАПРАВЛЕНИЯ</span>
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {serviceItems.map((item, index) => (
              <article
                key={item.title}
                className={getRevealClassName(`relative rounded-[28px] bg-[#060c2499] p-5 sm:p-6 backdrop-blur-[10px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:[background:linear-gradient(112deg,rgba(191,91,243,1)_0%,rgba(191,91,243,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] ${
                  index === 0 ? "md:col-span-2" : ""
                }`)}
                style={getRevealStyle(0.18 + index * 0.18)}
              >
                <div className="relative z-10">
                  <div
                    className={getAnimatedClassName("h-3.5 w-3.5 rounded-[7px] bg-x-2l-jg-IF blur-[1px]", "animate-reveal-dot")}
                    style={getRevealStyle(0.26 + index * 0.18)}
                  />
                  <div
                    className={getAnimatedClassName("mt-5 font-medium text-[#bf5bf3] text-xl leading-tight [font-family:'Geologica',Helvetica]", "animate-reveal-title")}
                    style={getRevealStyle(0.34 + index * 0.18)}
                  >
                    {item.title}
                  </div>
                  <p
                    className={getAnimatedClassName("mt-3 font-light text-white text-sm sm:text-base leading-relaxed [font-family:'Geologica',Helvetica]", "animate-reveal-text")}
                    style={getRevealStyle(0.46 + index * 0.18)}
                  >
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
