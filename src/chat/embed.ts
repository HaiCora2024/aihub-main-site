import "./embed.css";

const CHAT_ORIGIN = "https://aihubworks.com";
const VISITOR_KEY = "aihub-site-chat-visitor-v1";
const VISITOR_PATTERN = /^[a-f0-9]{32}$/;

function visitorId() {
  try {
    const stored = sessionStorage.getItem(VISITOR_KEY);
    if (stored && VISITOR_PATTERN.test(stored)) return stored;
  } catch {
    // Private browsing may disallow storage; a new ID still works for this page.
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const id = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  try {
    sessionStorage.setItem(VISITOR_KEY, id);
  } catch {
    // The conversation remains isolated for this page load.
  }
  return id;
}

function chatUrl() {
  const url = new URL("/chats/chat/", CHAT_ORIGIN);
  url.searchParams.set("site_visitor_id", visitorId());
  url.searchParams.set("open", "1");
  const language = new URLSearchParams(window.location.search).get("lang") ||
    document.documentElement.lang;
  url.searchParams.set("lang", language.toLowerCase().startsWith("ru") ? "ru" : "en");
  return url.toString();
}

function mountActivationButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "aihub-chat-activate";
  let unavailable = false;

  const updateLabel = () => {
    const language = new URLSearchParams(window.location.search).get("lang") ||
      document.documentElement.lang;
    const russian = language.toLowerCase().startsWith("ru");
    const compact = window.matchMedia("(max-width: 767px)").matches;
    button.classList.toggle("aihub-chat-activate--unavailable", unavailable);
    button.textContent = unavailable
      ? (russian ? "Чат недоступен. Повторить" : "Chat unavailable. Retry")
      : (compact ? (russian ? "Чат" : "Chat") : (russian ? "Чат с AIHUB" : "Chat with AIHUB"));
  };
  updateLabel();
  window.addEventListener("resize", updateLabel);

  const observer = new MutationObserver(updateLabel);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  button.addEventListener("click", () => {
    if (button.disabled) return;
    button.disabled = true;
    unavailable = false;
    updateLabel();

    let frame: HTMLIFrameElement;
    try {
      frame = document.createElement("iframe");
      frame.src = chatUrl();
    } catch {
      unavailable = true;
      button.disabled = false;
      updateLabel();
      return;
    }
    frame.className = "aihub-chat-frame aihub-chat-frame--expanded";
    frame.title = "AIHUB chat / Чат AIHUB";
    frame.hidden = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox",
    );

    let ready = false;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== CHAT_ORIGIN || event.source !== frame.contentWindow) return;
      if (event.data?.type === "aihub-chat-ready") {
        ready = true;
        clearTimeout(timeout);
        frame.hidden = false;
        observer.disconnect();
        window.removeEventListener("resize", updateLabel);
        button.remove();
      } else if (event.data?.type === "bgSize" && typeof event.data.showChat === "boolean") {
        if (!event.data.showChat && ready) {
          window.removeEventListener("message", onMessage);
          frame.remove();
          button.disabled = false;
          button.classList.remove("aihub-chat-activate--unavailable");
          document.body.appendChild(button);
          window.addEventListener("resize", updateLabel);
          observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["lang"],
          });
          updateLabel();
        }
      }
    };
    window.addEventListener("message", onMessage);
    const timeout = window.setTimeout(() => {
      if (ready) return;
      window.removeEventListener("message", onMessage);
      frame.remove();
      unavailable = true;
      button.disabled = false;
      updateLabel();
    }, 10000);

    document.body.appendChild(frame);
  });
  document.body.appendChild(button);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountActivationButton, { once: true });
} else {
  mountActivationButton();
}
