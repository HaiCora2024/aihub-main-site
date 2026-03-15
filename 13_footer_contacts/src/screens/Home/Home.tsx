export const Home = (): JSX.Element => {
  return (
    <div
      className="w-full min-h-[20vh] flex flex-col items-center gap-8 px-4 py-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-12 md:gap-16 min-[1200px]:justify-between min-[1200px]:px-[10%] min-[1200px]:py-16 min-[1200px]:px-[20%]"
      data-model-id="316:6850"
    >
      <img
        className="w-[60vw] max-w-[360px] h-auto"
        alt="Group"
        src="https://c.animaapp.com/GnNqmykx/img/group-3@2x.png"
      />

      <div className="flex flex-col items-start gap-5 w-full max-w-[400px]">
        <div className="[font-family:'Geologica',Helvetica] font-bold text-white text-2xl sm:text-3xl min-[1200px]:text-5xl tracking-[0] leading-tight">
          +4915774490172
        </div>

        <div className="[font-family:'Geologica',Helvetica] font-normal text-white text-sm sm:text-base min-[1200px]:text-lg tracking-[0] leading-relaxed">
          techcrew@aihub.works
        </div>

        <img
          className="w-[120px] sm:w-[140px] min-[1200px]:w-[150px] h-auto"
          alt="Frame"
          src="https://c.animaapp.com/GnNqmykx/img/frame-1948760081.svg"
        />
      </div>
    </div>
  );
};
