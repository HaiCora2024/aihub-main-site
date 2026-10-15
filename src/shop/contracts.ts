export type Language = "en" | "ru";
export interface RequestItem {
  id: number;
  qty: number;
}
export interface ShopCatalog {
  version: string;
  currency: "USD";
  products: {
    id: number;
    unitPriceMinor: number;
    unit: "setup" | "session";
    name: Record<Language, string>;
  }[];
  legal: {
    termsVersion: string;
    privacyVersion: string;
    effectiveDate: string;
  };
}
export interface Billing {
  type: "individual" | "business";
  country: string;
  address: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  companyName: string;
  registrationNumber: string;
  vatRegistered: boolean;
  vatId: string;
}
export interface Submission {
  customer: { name: string; email: string; phone: string };
  billing: Billing;
  items: RequestItem[];
  locale: Language;
  comment: string;
  website: string;
  catalogVersion: string;
  termsVersion: string;
  privacyVersion: string;
  termsAccepted: boolean;
}
export interface Receipt {
  id: string;
  createdAt: string;
  status: "received";
  mode: "request";
  currency: "USD";
  estimatedTotalMinor: number;
  vatStatus: "pending_review";
}
