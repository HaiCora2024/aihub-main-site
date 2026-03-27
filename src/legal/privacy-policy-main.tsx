import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { LegalPage } from "./LegalPage";

const PRIVACY_POLICY = {
  title: "Privacy Policy",
  effectiveDate: "March 27, 2026",
  intro:
    "AIHUB Works ('we', 'our', or 'us') is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you visit our website or engage with our services.",
  sections: [
    {
      heading: "Information We Collect",
      body: [
        "We may collect personal information you voluntarily provide, such as your name, email address, phone number, and company details when you fill out a contact form or request a consultation.",
        "We also collect non-personal usage data automatically, including browser type, pages visited, time on site, and referring URLs, to help us understand how visitors interact with our website.",
      ],
    },
    {
      heading: "How We Use Your Information",
      body: [
        "We use the information we collect to respond to your inquiries, deliver the services you request, and send relevant updates about our work.",
        "We do not sell, rent, or share your personal data with third parties for their marketing purposes. We may share data with trusted service providers who assist in operating our website or delivering services, under strict confidentiality obligations.",
      ],
    },
    {
      heading: "Cookies and Tracking",
      body: [
        "Our website may use cookies and similar technologies to improve your browsing experience, analyse site traffic, and personalise content. You can control cookie settings through your browser preferences.",
        "We do not use cookies to build individual advertising profiles or track you across third-party websites.",
      ],
    },
    {
      heading: "Data Storage and Security",
      body: [
        "Your data is stored on secure servers and protected using industry-standard technical and organisational measures. We retain personal data only as long as necessary for the purposes described in this policy.",
        "While we take reasonable precautions, no method of transmission over the internet is 100% secure. We cannot guarantee the absolute security of your data.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        "Depending on your location, you may have the right to access, correct, or delete personal information we hold about you. You may also have the right to object to or restrict certain types of processing.",
        "To exercise any of these rights, please contact us at techcrew@aihub.works. We will respond within a reasonable timeframe.",
      ],
    },
    {
      heading: "Third-Party Links",
      body: [
        "Our website may contain links to external sites. We are not responsible for the privacy practices or content of those sites and encourage you to review their respective privacy policies.",
      ],
    },
    {
      heading: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time. The effective date at the top of this page reflects the most recent revision. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.",
      ],
    },
  ],
};

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <LegalPage {...PRIVACY_POLICY} />
  </StrictMode>
);
