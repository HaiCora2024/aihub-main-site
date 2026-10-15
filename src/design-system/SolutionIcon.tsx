import type { ImgHTMLAttributes } from "react";

export const solutionIcons = [
  { name: "voice-assistant", label: "Голосовой ассистент" },
  { name: "chat-assistant", label: "Чат-ассистент" },
  { name: "email-orders", label: "Заказы из почты" },
  { name: "document-autofill", label: "Автозаполнение документов" },
  { name: "kpi-reporting", label: "Отчёты и показатели" },
  { name: "sentiment-monitor", label: "Тональность диалогов" },
  { name: "recommendations", label: "Рекомендации" },
  { name: "discovery-workshop", label: "AI-воркшоп" },
] as const;

export type SolutionIconName = (typeof solutionIcons)[number]["name"];
export const solutionIconSrc = (name: SolutionIconName) =>
  `${import.meta.env.BASE_URL}shop/icons/${name}.webp`;

/** Decorative by default. Supply alt only when adjacent text does not name the solution. */
export function SolutionIcon({
  name,
  alt = "",
  className = "",
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  name: SolutionIconName;
}) {
  return (
    <img
      width={640}
      height={640}
      loading="lazy"
      decoding="async"
      {...props}
      className={`aihub-solution-icon ${className}`}
      src={solutionIconSrc(name)}
      alt={alt}
    />
  );
}
