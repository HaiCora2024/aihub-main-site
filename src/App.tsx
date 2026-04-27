import { Home as HeroSection } from "../01_hero_custom_ai_assistant/src/screens/Home";
import { Home as ResultsSection } from "../02_instant_business_results/src/screens/Home";
import { Home as ClientsSection } from "../03_clients_logos/src/screens/Home";
import { Home as ServicesSection } from "../04_services_directions/src/screens/Home";
import { Home as CasesSection } from "../06_cases_animated/src/screens/Home";
import { Home as RoadmapSection } from "../07_roadmap/src/screens/Home";
import { Home as ContactSection } from "../08_contact_form/src/screens/Home";
import { Home as IntegrationsSection } from "../09_ai_process_integrations/src/screens/Home";
import { Home as WorkProcessSection } from "../10_work_process/src/screens/Home";
import { Home as TeamSection } from "../11_team/src/screens/Home";
import { Home as DemoSection } from "../12_demo_cta/src/screens/Home";
import { Home as FooterSection } from "../13_footer_contacts/src/screens/Home";

const sections = [
  { id: "hero", Component: HeroSection, label: "Hero — Custom AI Assistant" },
  { id: "results", Component: ResultsSection, label: "Instant Business Results" },
  { id: "clients", Component: ClientsSection, label: "Our Clients" },
  { id: "services", Component: ServicesSection, label: "Services" },
  { id: "cases", Component: CasesSection, label: "Cases" },
  { id: "roadmap", Component: RoadmapSection, label: "Roadmap" },
  { id: "contact", Component: ContactSection, label: "Contact" },
  { id: "integrations", Component: IntegrationsSection, label: "AI Process Integrations" },
  { id: "work-process", Component: WorkProcessSection, label: "Work Process" },
  { id: "team", Component: TeamSection, label: "Team" },
  { id: "demo", Component: DemoSection, label: "Book a Demo" },
  { id: "footer", Component: FooterSection, label: "Footer" },
];

export function App(): JSX.Element {
  return (
    <main aria-label="AIHub Works" className="relative overflow-x-hidden overflow-y-visible bg-[#060c24] text-white">
      {sections.map(({ id, Component, label }, index) => (
        <section
          key={id}
          id={id}
          aria-label={label}
          className={`relative overflow-visible scroll-mt-6 min-[1200px]:scroll-mt-8 ${
            index === 0 ? "" : "mt-6 sm:mt-8 min-[1200px]:mt-10"
          }`}
        >
          <Component />
        </section>
      ))}
    </main>
  );
}
