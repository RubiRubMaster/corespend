import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type Category = "telco" | "office" | "saas" | "cloud" | "hardware";
export type UploadStatus = "idle" | "processing" | "pending" | "analyzed";

export type CategoryState = {
  status: UploadStatus;
  fileName?: string;
  /** per-subcategory status, keyed by subcategory `key` */
  subStatus: Record<string, UploadStatus>;
};

export type ActiveView = "dashboard" | "start" | "kategorie" | "upload" | "ai" | "settings";

export type SubCategory = {
  key: string;
  label: string;
  emoji: string;
  available?: boolean; // default true
  kpi?: { label: string; value: string }[];
};

export type CategoryMeta = {
  label: string;
  emoji: string;
  /** lucide icon name (resolved in components) */
  iconName: "Smartphone" | "Cloud" | "CloudCog" | "Cpu" | "Globe";
  short: string;
  subs: SubCategory[];
  /** mock aggregated KPIs for dashboard cards */
  costPerYear: number;
  costSub: string;
  savingsPerYear: number | null;
};

const BASE_PRICE = 2800;
const MIN_PRICE = 1300;
const CATEGORY_COUNT = 5;
const DISCOUNT_PER_CATEGORY = Math.round((BASE_PRICE - MIN_PRICE) / CATEGORY_COUNT); // 300

export const CATEGORIES: Category[] = ["telco", "office", "saas", "cloud", "hardware"];

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  telco: {
    label: "Telekommunikation",
    short: "Telco",
    emoji: "📞",
    iconName: "Smartphone",
    costPerYear: 221040,
    costSub: "18.420 € / Monat · 412 Anschlüsse",
    savingsPerYear: 24320,
    subs: [
      { key: "mobilfunk", label: "Mobilfunk", emoji: "📱", kpi: [
        { label: "ARPU", value: "23,02 € / Monat" },
        { label: "Ø Datenvolumen", value: "14,2 GB / User" },
      ]},
      { key: "festnetz", label: "Festnetz", emoji: "☎️", kpi: [
        { label: "Standorte", value: "18 Anschlüsse" },
        { label: "Ø Kosten", value: "84 € / Standort" },
      ]},
      { key: "daten", label: "Daten", emoji: "🌐", kpi: [
        { label: "Bandbreite", value: "12 × 1 Gbit/s" },
        { label: "Ø Kosten", value: "1.140 € / Standort" },
      ]},
    ],
  },
  office: {
    label: "Office Suites",
    short: "Office",
    emoji: "💻",
    iconName: "Cloud",
    costPerYear: 294000,
    costSub: "24.500 € / Monat · 800 Lizenzen",
    savingsPerYear: 76440,
    subs: [
      { key: "office365", label: "Office 365", emoji: "🟦", kpi: [
        { label: "Ø Kosten / Lizenz", value: "30,62 € / Monat" },
        { label: "Inaktive Lizenzen", value: "12 % (96)" },
      ]},
      { key: "more", label: "Weitere folgen", emoji: "…", available: false },
    ],
  },
  saas: {
    label: "SaaS",
    short: "SaaS",
    emoji: "☁️",
    iconName: "CloudCog",
    costPerYear: 148500,
    costSub: "pro Jahr · 34 Plattformen",
    savingsPerYear: null,
    subs: [
      { key: "plattformen", label: "Plattformen & Lizenzen", emoji: "🧩", kpi: [
        { label: "Aktive Tools", value: "34 Plattformen" },
        { label: "Shadow-IT", value: "4 unbekannte Abos" },
      ]},
    ],
  },
  cloud: {
    label: "Cloud",
    short: "Cloud",
    emoji: "🌐",
    iconName: "Globe",
    costPerYear: 186200,
    costSub: "pro Jahr · Multi-Cloud Setup",
    savingsPerYear: null,
    subs: [
      { key: "aws", label: "AWS", emoji: "🟧", kpi: [
        { label: "Monatslast", value: "8.420 €" },
        { label: "Reserved", value: "62 % gedeckt" },
      ]},
      { key: "azure", label: "Azure", emoji: "🟦", kpi: [
        { label: "Monatslast", value: "5.940 €" },
        { label: "Reserved", value: "41 %" },
      ]},
      { key: "gcp", label: "GCP", emoji: "🟥", kpi: [
        { label: "Monatslast", value: "1.150 €" },
        { label: "Reserved", value: "—" },
      ]},
      { key: "more", label: "Weitere folgen", emoji: "…", available: false },
    ],
  },
  hardware: {
    label: "Hardware",
    short: "Hardware",
    emoji: "🔌",
    iconName: "Cpu",
    costPerYear: 78560,
    costSub: "pro Jahr · Leasing & Kauf",
    savingsPerYear: null,
    subs: [
      { key: "smartphones", label: "Smartphones & Tablets", emoji: "📱", kpi: [
        { label: "Aktive Geräte", value: "412 Assets" },
        { label: "Ø Restlaufzeit", value: "11 Monate" },
      ]},
      { key: "workplace", label: "Workplace · Notebooks, PCs, Peripherie", emoji: "💻", kpi: [
        { label: "Aktive Geräte", value: "684 Assets" },
        { label: "Hersteller-Mix", value: "Lenovo · Apple · HP" },
      ]},
      { key: "more", label: "Weitere folgen", emoji: "…", available: false },
    ],
  },
};

type Ctx = {
  categories: Record<Category, CategoryState>;
  activeView: ActiveView;
  currentCategory: Category | null;
  currentSub: string | null;
  setActiveView: (v: ActiveView) => void;
  goToDashboard: () => void;
  goToStart: () => void;
  goToCategory: (c: Category) => void;
  goToUpload: (c: Category, sub: string) => void;
  startProcessing: (c: Category, sub: string, fileName?: string) => void;
  setStatus: (c: Category, s: UploadStatus) => void;
  priceOverride: number | null;
  setPriceOverride: (n: number | null) => void;
  currentPrice: number;
  unlockedPercent: number;
  totalDiscount: number;
  resetAll: () => void;
};

const CoreSpendContext = createContext<Ctx | null>(null);

const blankCategory = (): CategoryState => ({ status: "idle", subStatus: {} });

const initialCategories: Record<Category, CategoryState> = {
  telco: blankCategory(),
  office: blankCategory(),
  saas: blankCategory(),
  cloud: blankCategory(),
  hardware: blankCategory(),
};

export function CoreSpendProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSub, setCurrentSub] = useState<string | null>(null);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);

  const setStatus = useCallback((c: Category, s: UploadStatus) => {
    setCategories((prev) => ({ ...prev, [c]: { ...prev[c], status: s } }));
  }, []);

  const startProcessing = useCallback((c: Category, sub: string, fileName?: string) => {
    setCategories((prev) => ({
      ...prev,
      [c]: { ...prev[c], status: "processing", fileName, subStatus: { ...prev[c].subStatus, [sub]: "processing" } },
    }));
    setTimeout(() => {
      setCategories((prev) =>
        prev[c].status === "processing"
          ? {
              ...prev,
              [c]: { ...prev[c], status: "pending", subStatus: { ...prev[c].subStatus, [sub]: "pending" } },
            }
          : prev,
      );
    }, 14000);
  }, []);

  const goToDashboard = useCallback(() => {
    setActiveView("dashboard");
    setCurrentCategory(null);
    setCurrentSub(null);
  }, []);
  const goToStart = useCallback(() => {
    setActiveView("start");
    setCurrentCategory(null);
    setCurrentSub(null);
  }, []);
  const goToCategory = useCallback((c: Category) => {
    setCurrentCategory(c);
    setCurrentSub(null);
    setActiveView("kategorie");
  }, []);
  const goToUpload = useCallback((c: Category, sub: string) => {
    setCurrentCategory(c);
    setCurrentSub(sub);
    setActiveView("upload");
  }, []);

  const resetAll = useCallback(() => {
    setCategories(initialCategories);
    setPriceOverride(null);
  }, []);

  const { currentPrice, unlockedPercent, totalDiscount } = useMemo(() => {
    const unlockedCount = CATEGORIES.filter((k) => categories[k].status !== "idle").length;
    const discount = unlockedCount * DISCOUNT_PER_CATEGORY;
    const price = priceOverride ?? Math.max(BASE_PRICE - discount, MIN_PRICE);
    return {
      currentPrice: price,
      unlockedPercent: Math.round((unlockedCount / CATEGORY_COUNT) * 100),
      totalDiscount: discount,
    };
  }, [categories, priceOverride]);

  const value: Ctx = {
    categories,
    activeView,
    currentCategory,
    currentSub,
    setActiveView,
    goToDashboard,
    goToStart,
    goToCategory,
    goToUpload,
    startProcessing,
    setStatus,
    priceOverride,
    setPriceOverride,
    currentPrice,
    unlockedPercent,
    totalDiscount,
    resetAll,
  };

  return <CoreSpendContext.Provider value={value}>{children}</CoreSpendContext.Provider>;
}

export function useCoreSpend() {
  const ctx = useContext(CoreSpendContext);
  if (!ctx) throw new Error("useCoreSpend must be used within CoreSpendProvider");
  return ctx;
}

export const PRICING = { BASE_PRICE, DISCOUNT_PER_CATEGORY, MIN_PRICE, CATEGORY_COUNT };

export function formatEUR(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
