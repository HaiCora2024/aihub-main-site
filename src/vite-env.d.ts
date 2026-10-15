/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public numeric Ecwid store ID. Empty → shop runs in demo mode. */
  readonly VITE_ECWID_STORE_ID?: string;
  /** Optional: page hosting the Ecwid widget. Defaults to /checkout.html. */
  readonly VITE_ECWID_CHECKOUT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
