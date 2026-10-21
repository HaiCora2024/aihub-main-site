import "./embed.css";
import { loadLauncher } from "./launcher";

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
  url.searchParams.set("avatar_path", "/media/20260411_173204.png");
  const language = new URLSearchParams(window.location.search).get("lang") ||
    document.documentElement.lang;
  url.searchParams.set("lang", language.toLowerCase().startsWith("ru") ? "ru" : "en");
  return url.toString();
}

function mountActivationButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "aihub-chat-activate aihub-chat-activate--skinned aihub-chat-activate--classic";
  button.dataset.launcherState = "loading";
  const fallback = document.createElement("img");
  fallback.src = `${import.meta.env.BASE_URL}brand/chat-launcher-classic.svg`;
  fallback.alt = "";
  fallback.className = "aihub-chat-activate__fallback";
  const status = document.createElement("span");
  status.className = "aihub-chat-activate__status";
  button.append(fallback, status);
  let unavailable = false;

  const updateLabel = () => {
    const language = new URLSearchParams(window.location.search).get("lang") ||
      document.documentElement.lang;
    const russian = language.toLowerCase().startsWith("ru");
    button.classList.toggle("aihub-chat-activate--unavailable", unavailable);
    button.setAttribute("aria-label", unavailable
      ? (russian ? "Чат недоступен. Повторить" : "Chat unavailable. Retry")
      : (russian ? "Чат с AIHUB" : "Chat with AIHUB"));
    status.textContent = unavailable
      ? (russian ? "Чат недоступен. Повторить" : "Chat unavailable. Retry")
      : "";
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

    const russian = button.getAttribute("aria-label") === "Чат с AIHUB";
    const loading = document.createElement("section");
    loading.className = "aihub-chat-loading";
    loading.setAttribute("role", "dialog");
    loading.setAttribute("aria-label", russian ? "Чат с AIHUB" : "Chat with AIHUB");
    const header = document.createElement("header");
    header.className = "aihub-chat-loading__header";
    const title = document.createElement("strong");
    title.textContent = russian ? "Чат с AIHUB" : "Chat with AIHUB";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "aihub-chat-loading__close";
    cancel.setAttribute("aria-label", russian ? "Закрыть чат" : "Close chat");
    cancel.textContent = "\u00d7";
    header.append(title, cancel);
    const progress = document.createElement("div");
    progress.className = "aihub-chat-loading__progress";
    progress.setAttribute("role", "status");
    const spinner = document.createElement("span");
    spinner.className = "aihub-chat-loading__spinner";
    spinner.setAttribute("aria-hidden", "true");
    const message = document.createElement("span");
    message.textContent = russian ? "Загружаем чат..." : "Loading chat...";
    progress.append(spinner, message);
    loading.append(header, progress);

    let ready = false;
    let closed = false;
    const closeChat = (failed = false) => {
      if (closed) return;
      closed = true;
      clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      frame.remove();
      loading.remove();
      button.disabled = false;
      unavailable = failed;
      document.body.appendChild(button);
      window.addEventListener("resize", updateLabel);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
      updateLabel();
      button.focus();
    };
    const onMessage = (event: MessageEvent) => {
      if (closed || event.origin !== CHAT_ORIGIN || event.source !== frame.contentWindow) return;
      if (event.data?.type === "aihub-chat-ready" && !ready) {
        ready = true;
        clearTimeout(timeout);
        loading.remove();
        frame.hidden = false;
        frame.focus();
      } else if (event.data?.type === "bgSize" && typeof event.data.showChat === "boolean") {
        if (!event.data.showChat && ready) {
          closeChat();
        }
      }
    };
    window.addEventListener("message", onMessage);
    const timeout = window.setTimeout(() => {
      if (!ready) closeChat(true);
    }, 10000);
    cancel.addEventListener("click", () => closeChat());
    loading.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeChat();
    });
    observer.disconnect();
    window.removeEventListener("resize", updateLabel);
    button.remove();
    document.body.append(frame, loading);
    cancel.focus();
  });
  document.body.appendChild(button);
  const updateMotion = () => button.toggleAttribute("data-launcher-paused", document.hidden);
  document.addEventListener("visibilitychange", updateMotion);
  updateMotion();
  void loadLauncher(CHAT_ORIGIN).then((launcher) => {
    button.dataset.launcherState = launcher ? "ready" : "fallback";
    if (!launcher) return;
    fallback.replaceWith(launcher.art);
    button.classList.toggle("aihub-chat-activate--classic", launcher.skin === "classic");
    button.dataset.launcherSkin = launcher.skin;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountActivationButton, { once: true });
} else {
  mountActivationButton();
}
