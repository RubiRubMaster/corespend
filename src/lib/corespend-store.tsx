import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type Category = "mobilfunk" | "m365" | "saas" | "hardware";
export type UploadStatus = "idle" | "processing" | "pending" | "analyzed";

export type CategoryState = {
  status: UploadStatus;
  fileName?: string;
};

export type ActiveView = Category | "overview" | "onboarding" | "settings";

const BASE_PRICE = 2800;
const DISCOUNT_PER_CATEGORY = 400;

export const CATEGORY_META: Record<Category, { label: string; icon: string; available: boolean; discount: number }> = {
  mobilfunk: { label: "Mobilfunk & Telco", icon: "Smartphone", available: true, discount: 400 },
  m365: { label: "Microsoft 365", icon: "Cloud", available: true, discount: 400 },
  saas: { label: "SaaS & Cloud", icon: "CloudCog", available: false, discount: 400 },
  hardware: { label: "Hardware & Assets", icon: "Cpu", available: false, discount: 400 },
};

type Ctx = {
  categories: Record<Category, CategoryState>;
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;
  startProcessing: (c: Category, fileName?: string) => void;
  setStatus: (c: Category, s: UploadStatus) => void;
  priceOverride: number | null;
  setPriceOverride: (n: number | null) => void;
  currentPrice: number;
  unlockedPercent: number;
  totalDiscount: number;
  resetAll: () => void;
};

const CoreSpendContext = createContext<Ctx | null>(null);

const initialCategories: Record<Category, CategoryState> = {
  mobilfunk: { status: "idle" },
  m365: { status: "idle" },
  saas: { status: "idle" },
  hardware: { status: "idle" },
};

export function CoreSpendProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeView, setActiveView] = useState<ActiveView>("onboarding");
  const [priceOverride, setPriceOverride] = useState<number | null>(null);

  const setStatus = useCallback((c: Category, s: UploadStatus) => {
    setCategories((prev) => ({ ...prev, [c]: { ...prev[c], status: s } }));
  }, []);

  const startProcessing = useCallback((c: Category, fileName?: string) => {
    setCategories((prev) => ({ ...prev, [c]: { status: "processing", fileName } }));
    // After processing animation, set to pending (price already discounted, expert review 24-48h)
    setTimeout(() => {
      setCategories((prev) =>
        prev[c].status === "processing" ? { ...prev, [c]: { ...prev[c], status: "pending" } } : prev,
      );
    }, 14000);
  }, []);

  const resetAll = useCallback(() => {
    setCategories(initialCategories);
    setPriceOverride(null);
  }, []);

  const { currentPrice, unlockedPercent, totalDiscount } = useMemo(() => {
    const unlockedCount = (Object.keys(categories) as Category[]).filter(
      (k) => categories[k].status !== "idle",
    ).length;
    const discount = unlockedCount * DISCOUNT_PER_CATEGORY;
    const price = priceOverride ?? Math.max(BASE_PRICE - discount, BASE_PRICE - 4 * DISCOUNT_PER_CATEGORY);
    return {
      currentPrice: price,
      unlockedPercent: Math.round((unlockedCount / 4) * 100),
      totalDiscount: discount,
    };
  }, [categories, priceOverride]);

  const value: Ctx = {
    categories,
    activeView,
    setActiveView,
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

export const PRICING = { BASE_PRICE, DISCOUNT_PER_CATEGORY };

export function formatEUR(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
