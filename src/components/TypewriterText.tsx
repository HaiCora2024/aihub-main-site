import { useEffect, useState } from "react";
import "./typewriter-text.css";

interface TypewriterLine {
  text: string;
  color?: string;
  className?: string;
}

export function TypewriterText({
  lines,
  speed = 55,
  startDelay = 400,
}: {
  lines: TypewriterLine[];
  speed?: number;
  startDelay?: number;
}) {
  const fullText = lines.map((line) => line.text).join("\n");
  const length = lines.reduce((total, line) => total + line.text.length, 0);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [progress, setProgress] = useState({
    text: fullText,
    count: 0,
    started: false,
  });

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    setProgress({ text: fullText, count: 0, started: false });
    let timer: ReturnType<typeof setInterval> | undefined;
    const delay = setTimeout(() => {
      setProgress({ text: fullText, count: 0, started: true });
      let count = 0;
      timer = setInterval(() => {
        count += 1;
        setProgress({ text: fullText, count, started: true });
        if (count >= length) clearInterval(timer);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(delay);
      clearInterval(timer);
    };
  }, [fullText, length, reduced, speed, startDelay]);

  const count = reduced
    ? length
    : progress.text === fullText
      ? progress.count
      : 0;
  let offset = 0;
  const segments = lines.map((line, index) => {
    const before = offset;
    offset += line.text.length;
    return {
      ...line,
      visible: line.text.slice(0, Math.max(0, count - before)),
      cursor: count <= offset && (index === 0 || count > before),
    };
  });

  return (
    <span className="site-typewriter" data-typing-done={count >= length}>
      <span className="site-typewriter__accessible">{fullText}</span>
      <span className="site-typewriter__size" aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i}>{line.text}</span>
        ))}
      </span>
      <span className="site-typewriter__ink" aria-hidden="true">
        {segments.map((line, i) => (
          <span
            key={i}
            className={line.className}
            style={{ color: line.color }}
          >
            {line.visible}
            {!reduced && progress.started && line.cursor && (
              <span className="site-typewriter__cursor" />
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
