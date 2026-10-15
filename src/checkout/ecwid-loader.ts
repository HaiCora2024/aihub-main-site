/** Minimal typing of the Ecwid Storefront JS API used by the checkout page. */
export interface EcwidPage {
  type: string;
}
export interface EcwidApi {
  OnAPILoaded: { add: (callback: () => void) => void };
  OnPageLoaded: { add: (callback: (page: EcwidPage) => void) => void };
  openPage: (page: string) => void;
}
interface EcwidWidgetInit {
  widgetType: "ProductBrowser";
  id: string;
  arg: string[];
}

declare global {
  interface Window {
    Ecwid?: EcwidApi;
    ecwid_script_defer?: boolean;
    ecwid_dynamic_widgets?: boolean;
    _xnext_initialization_scripts?: EcwidWidgetInit[];
    ecwid_onBodyDone?: () => void;
  }
}

const LOAD_TIMEOUT_MS = 20000;
let loader: Promise<EcwidApi> | null = null;

/**
 * Loads the Ecwid storefront once and renders the ProductBrowser widget
 * into `containerId` (dynamic embedding, see docs.ecwid.com →
 * "Dynamic loading for storefront widget"). Safe to call repeatedly
 * (React StrictMode runs effects twice in development).
 */
export function loadEcwid(
  storeId: string,
  containerId: string,
  lang: string,
): Promise<EcwidApi> {
  if (loader) return loader;
  loader = new Promise<EcwidApi>((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error("Ecwid did not load in time")),
      LOAD_TIMEOUT_MS,
    );
    window.ecwid_script_defer = true;
    window.ecwid_dynamic_widgets = true;
    window._xnext_initialization_scripts = [
      { widgetType: "ProductBrowser", id: containerId, arg: [`id=${containerId}`] },
    ];
    const script = document.createElement("script");
    script.id = "ecwid-script";
    script.charset = "utf-8";
    script.async = true;
    script.src = `https://app.ecwid.com/script.js?${storeId}&data_platform=code&lang=${encodeURIComponent(lang)}`;
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Ecwid script failed to load"));
    };
    script.onload = () => {
      const api = window.Ecwid;
      if (!api) {
        window.clearTimeout(timer);
        reject(new Error("Ecwid API is missing"));
        return;
      }
      api.OnAPILoaded.add(() => {
        window.clearTimeout(timer);
        resolve(api);
      });
    };
    document.body.appendChild(script);
  });
  return loader;
}
