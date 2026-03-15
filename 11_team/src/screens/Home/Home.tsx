import { useState } from "react";

interface TeamMember {
  id: number;
  borderGradient: string;
  glowColor: string;
  imageWrapperClass: string;
  imageOverlayStyle: Record<string, string>;
  imageOverlayClass: string;
  useImgTag: boolean;
  imgSrc: string | null;
  imgAlt: string | null;
  imgClass?: string;
  roleClass: string;
  role: string;
  name: string;
  description: string;
}

export const Home = (): JSX.Element => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      borderGradient:
        "linear-gradient(102deg,rgba(191,91,243,1) 0%,rgba(191,91,243,0) 100%)",
      glowColor: "191,91,243",
      imageWrapperClass:
        "w-[134px] shrink-0 self-center flex items-center justify-center rounded-[20px] overflow-hidden bg-[url(https://c.animaapp.com/pz5xnCNR/img/frame-1948760049@2x.png)] bg-cover bg-[50%_50%]",
      imageOverlayStyle: {
        background:
          "linear-gradient(102deg,rgba(191,91,243,1) 0%,rgba(191,91,243,0) 100%)",
      },
      imageOverlayClass: "opacity-40 h-[134px] w-[134px]",
      useImgTag: false,
      imgSrc: null,
      imgAlt: null,
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-r-snce-k text-xl tracking-[0] leading-[24.0px]",
      role: "Backend Development",
      name: "Ugur Cekmez",
      description:
        "MLOps Engineer at Silicon Valley | Research Engineer at Global Media Corporation | R&D Engineer at Siemens",
    },
    {
      id: 2,
      borderGradient:
        "linear-gradient(112deg,rgba(255,212,9,1) 0%,rgba(255,212,9,0) 100%)",
      glowColor: "255,212,9",
      imageWrapperClass:
        "h-[134px] w-[134px] shrink-0 self-center relative bg-[#ffffff] rounded-[20px] overflow-hidden",
      imageOverlayStyle: {
        background:
          "linear-gradient(112deg,rgba(255,212,9,1) 0%,rgba(255,212,9,0) 100%)",
      },
      imageOverlayClass:
        "opacity-60 absolute top-0 left-0 w-[134px] h-[134px]",
      useImgTag: true,
      imgSrc: "https://c.animaapp.com/pz5xnCNR/img/rectangle-5@2x.png",
      imgAlt: "Rectangle",
      imgClass: "absolute top-0 left-0 h-[134px] w-[134px]",
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-x-1k-2dej text-xl tracking-[0] leading-[24.0px]",
      role: "Machine Learning",
      name: "Artem Astapenko",
      description:
        "AI & ML Technologies Integrator | TensorFlow Expert | Scikit-learn, RAG, PyTorch, Langchain and LlamaIndex Specialist",
    },
    {
      id: 3,
      borderGradient:
        "linear-gradient(109deg,rgba(99,230,225,1) 0%,rgba(99,230,225,0.1) 100%)",
      glowColor: "99,230,225",
      imageWrapperClass:
        "h-[134px] w-[134px] shrink-0 self-center relative bg-[#ffffff] rounded-[20px] overflow-hidden",
      imageOverlayStyle: {
        background:
          "linear-gradient(109deg,rgba(99,230,225,1) 0%,rgba(99,230,225,0.1) 100%)",
      },
      imageOverlayClass:
        "opacity-40 absolute top-0 left-0 w-[134px] h-[134px]",
      useImgTag: true,
      imgSrc: "https://c.animaapp.com/pz5xnCNR/img/rectangle-5-1@2x.png",
      imgAlt: "Rectangle",
      imgClass: "absolute top-0 left-0 h-[134px] w-[134px]",
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-bkb-va5 text-xl tracking-[0] leading-[24.0px]",
      role: "AI integration",
      name: "Vladimir Krupiy",
      description:
        "LLM Specialist | Neural Training Systems Developer for Banks | Online Course Creator",
    },
    {
      id: 4,
      borderGradient:
        "linear-gradient(129deg,rgba(255,70,58,1) 0%,rgba(255,70,58,0) 78%)",
      glowColor: "255,70,58",
      imageWrapperClass:
        "h-[134px] w-[134px] shrink-0 self-center relative bg-[#ffffff] rounded-[20px] overflow-hidden",
      imageOverlayStyle: {
        background:
          "linear-gradient(129deg,rgba(255,70,58,1) 0%,rgba(255,70,58,0) 78%)",
      },
      imageOverlayClass:
        "opacity-60 absolute top-0 left-0 w-[134px] h-[134px]",
      useImgTag: true,
      imgSrc: "https://c.animaapp.com/pz5xnCNR/img/rectangle-5-2@2x.png",
      imgAlt: "Rectangle",
      imgClass: "absolute top-0 left-0 h-[134px] w-[134px]",
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-fp-664u text-lg sm:text-xl tracking-[0] leading-[1.2] break-words",
      role: "UX/UI Design",
      name: "Nikita Noskov",
      description:
        "Lead Designer of 15+ Team | Banking Apps Expert | AI Chat-Bots Developer",
    },
    {
      id: 5,
      borderGradient:
        "linear-gradient(100deg,rgba(254,138,4,1) 0%,rgba(254,138,4,0) 100%)",
      glowColor: "254,138,4",
      imageWrapperClass:
        "h-[134px] w-[134px] shrink-0 self-center relative bg-[#ffffff] rounded-[20px] overflow-hidden",
      imageOverlayStyle: {
        background:
          "linear-gradient(100deg,rgba(254,138,4,1) 0%,rgba(254,138,4,0) 100%)",
      },
      imageOverlayClass:
        "opacity-40 absolute top-0 left-0 w-[134px] h-[134px]",
      useImgTag: true,
      imgSrc: "https://c.animaapp.com/pz5xnCNR/img/rectangle-5-3@2x.png",
      imgAlt: "Rectangle",
      imgClass: "absolute top-0 left-0 h-[134px] w-[134px] object-cover",
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-x-9ukd-of text-xl tracking-[0] leading-[24.0px]",
      role: "Co-Founder AIHUB.WORKS",
      name: "Svetlana Galakhova",
      description:
        "AI Solutions Leader | 11 Case Studies Across Industries | B2B Automation Specialist | No-Code Platform Expert",
    },
    {
      id: 6,
      borderGradient:
        "linear-gradient(112deg,rgba(3,133,255,1) 0%,rgba(3,133,255,0) 100%)",
      glowColor: "3,133,255",
      imageWrapperClass:
        "h-[134px] w-[134px] shrink-0 self-center relative bg-[#ffffff] rounded-[20px] overflow-hidden",
      imageOverlayStyle: {
        background:
          "linear-gradient(112deg,rgba(3,133,255,1) 0%,rgba(3,133,255,0) 100%)",
      },
      imageOverlayClass:
        "opacity-60 absolute top-0 left-0 w-[134px] h-[134px]",
      useImgTag: true,
      imgSrc: "https://c.animaapp.com/pz5xnCNR/img/rectangle-5-4@2x.png",
      imgAlt: "Rectangle",
      imgClass: "absolute top-0 left-0 h-[134px] w-[134px]",
      roleClass:
        "relative self-stretch mt-[-1.00px] [font-family:'Geologica',Helvetica] font-medium text-tqp2-hy text-lg sm:text-xl tracking-[0] leading-[1.2] break-words",
      role: "Co-Founder AIHUB.WORKS",
      name: "Alexandr Kolyadko",
      description: "Business Development  | Growth hacking",
    },
  ];

  return (
    <div
      className="w-full relative overflow-visible"
      data-model-id="316:7175"
    >
      <div className="landing-shell landing-shell--wide pt-[30px] pb-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            className="h-auto w-full max-w-[902px]"
            alt="Union"
            src="https://c.animaapp.com/pz5xnCNR/img/union.svg"
          />
        </div>

        {/* Title */}
        <p className="mt-4 text-center [font-family:'Geologica',Helvetica] font-bold text-transparent text-3xl leading-tight sm:mt-6 sm:text-4xl md:mt-8 md:text-5xl md:leading-[76.8px] min-[1200px]:text-[64px]">
          <span className="text-[#ffffff]">НАША </span>
          <span className="text-[#08d070]">КОМАНДА</span>
        </p>

        {/* Team Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 md:mt-12 md:grid-cols-2 md:gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative flex gap-5 rounded-[30px] bg-[#060c2499] p-5 transition-all duration-500 ease-out cursor-pointer sm:gap-[30px] sm:p-6"
              style={{
                boxShadow:
                  hoveredId === member.id
                    ? `inset 0 0 40px 8px rgba(${member.glowColor}, 0.25), inset 0 0 80px 2px rgba(${member.glowColor}, 0.1)`
                    : `inset 0 0 20px 2px rgba(${member.glowColor}, 0.1), inset 0 0 40px 0px rgba(${member.glowColor}, 0.05)`,
              }}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="absolute inset-0 rounded-[30px] pointer-events-none z-[1]"
                style={{
                  padding: "1px",
                  background: member.borderGradient,
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              <div className={member.imageWrapperClass}>
                {member.useImgTag ? (
                  <>
                    <img
                      className={member.imgClass}
                      alt={member.imgAlt || ""}
                      src={member.imgSrc || ""}
                    />
                    <div
                      className={member.imageOverlayClass}
                      style={member.imageOverlayStyle || {}}
                    />
                  </>
                ) : (
                  <div
                    className={member.imageOverlayClass}
                    style={member.imageOverlayStyle || {}}
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[10px] sm:gap-[15px]">
                <div className={member.roleClass}>{member.role}</div>

                <div className="relative self-stretch [font-family:'Geologica',Helvetica] font-medium text-white text-base tracking-[0] leading-[19.2px]">
                  {member.name}
                </div>

                <p className="relative self-stretch [font-family:'Geologica',Helvetica] font-light text-white text-xs tracking-[0] leading-[16.8px] sm:text-sm">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
