import { useEffect, useState } from "react";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageProps {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ title, effectiveDate, intro, sections }: LegalPageProps) {
  const base = import.meta.env.BASE_URL;
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen bg-[#060c24] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 h-14 flex items-center gap-4">
          <a
            href={base}
            className="flex items-center gap-2 [font-family:'Geologica',Helvetica] font-light text-white/60 hover:text-white text-sm transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to site
          </a>
          <span className="text-white/20">·</span>
          <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">AIHUB Works</span>
        </div>
      </nav>

      <main
        className="mx-auto max-w-[800px] px-4 sm:px-6 py-12 sm:py-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-4">
          Legal
        </p>
        <h1 className="[font-family:'Geologica',Helvetica] font-bold text-white mb-3" style={{ fontSize: "clamp(24px,5vw,42px)" }}>
          {title}
        </h1>
        <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm mb-10">
          Effective date: {effectiveDate}
        </p>

        <p className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-base leading-relaxed mb-10">
          {intro}
        </p>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-lg mb-4">
                {i + 1}. {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-sm sm:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:techcrew@aihub.works" className="text-white/60 hover:text-white transition-colors duration-200">
              techcrew@aihub.works
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
