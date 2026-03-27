import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { LegalPage } from "./LegalPage";

const TERMS = {
  title: "Terms of Service",
  effectiveDate: "March 27, 2026",
  intro:
    "These Terms of Service govern your use of the AIHUB Works website and any services we provide. By accessing our site or engaging with our team, you agree to these terms. Please read them carefully.",
  sections: [
    {
      heading: "Services",
      body: [
        "AIHUB Works provides AI consulting, implementation, and automation services for businesses. The scope, deliverables, and terms of any specific engagement are defined in a separate agreement or statement of work signed by both parties.",
        "We reserve the right to modify, suspend, or discontinue any aspect of our services at any time with reasonable notice.",
      ],
    },
    {
      heading: "Use of the Website",
      body: [
        "You may use our website for lawful purposes only. You agree not to use it in any way that may damage, disable, or impair the site, or interfere with other users' access.",
        "All content on this website — including text, graphics, logos, and code — is the intellectual property of AIHUB Works or its licensors and is protected by applicable copyright laws.",
      ],
    },
    {
      heading: "Intellectual Property",
      body: [
        "Custom deliverables created specifically for a client become the client's property upon full payment, as agreed in the relevant contract. Generic frameworks, tools, and methodologies developed by AIHUB Works remain our intellectual property.",
        "You may not reproduce, distribute, or create derivative works from our website content without prior written consent.",
      ],
    },
    {
      heading: "Confidentiality",
      body: [
        "Both parties agree to keep confidential any non-public information shared during the course of an engagement. This obligation survives the termination of any service agreement.",
        "We do not disclose client names, project details, or business data to third parties without explicit written permission.",
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "AIHUB Works provides its services on an 'as is' basis. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from the use of our website or services.",
        "Our total liability for any claim related to our services shall not exceed the amount paid by you for the specific service giving rise to the claim.",
      ],
    },
    {
      heading: "Governing Law",
      body: [
        "These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms or our services shall be resolved through good-faith negotiation before pursuing formal proceedings.",
      ],
    },
    {
      heading: "Changes to These Terms",
      body: [
        "We may revise these Terms of Service at any time. The updated version will be posted on this page with a new effective date. Your continued use of the website following changes constitutes your acceptance of the revised terms.",
      ],
    },
  ],
};

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <LegalPage {...TERMS} />
  </StrictMode>
);
