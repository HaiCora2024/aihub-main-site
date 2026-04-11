export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}
