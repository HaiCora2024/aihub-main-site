type LauncherSkin = "classic" | "aihub";

// Assets and the two allowed ids are deployment-owned, never arbitrary API URLs.
export async function loadLauncher(origin: string): Promise<{ skin: LauncherSkin; art: HTMLSpanElement } | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${origin}/api/knowledge/widget_launcher`, {
      credentials: "omit", cache: "no-store", signal: controller.signal,
    });
    if (!response.ok) return null;
    const settings = await response.json();
    if (controller.signal.aborted) return null;
    const skin: LauncherSkin = settings?.launcher_skin === "aihub" ? "aihub" : "classic";
    const base = `${origin}/widget-launcher/v1/`;
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${base}launcher.css`;
        link.onload = () => resolve();
        link.onerror = () => { link.remove(); reject(new Error("Launcher stylesheet unavailable")); };
        controller.signal.addEventListener("abort", () => { link.remove(); reject(new Error("Launcher timeout")); }, {once: true});
        document.head.appendChild(link);
      }),
      new Promise<void>((resolve, reject) => {
        const asset = new Image();
        asset.onload = () => resolve();
        asset.onerror = () => reject(new Error("Launcher image unavailable"));
        controller.signal.addEventListener("abort", () => reject(new Error("Launcher timeout")), {once: true});
        asset.src = `${base}${skin === "aihub" ? "egg-sprite.png" : "classic.svg"}`;
      }),
    ]);
    if (controller.signal.aborted) return null;
    const art = document.createElement("span");
    art.className = "crm-launcher-art";
    art.dataset.launcherSkin = skin;
    art.setAttribute("aria-hidden", "true");
    return {skin, art};
  } catch {
    controller.abort();
    return null; // Keep the neutral local launcher functional during an outage.
  } finally {
    clearTimeout(timeout);
  }
}
