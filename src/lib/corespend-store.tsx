import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type Category = "telco" | "office" | "saas" | "cloud" | "hardware";
export type SubKey = "mobilfunk" | "festnetz" | "daten";
export type UploadStatus = "idle" | "processing" | "pending" | "analyzed";
export type MobilfunkStage = "cockpit" | "wizard" | "mandate";

export type NegotiationStrategy = {
  approach: "renegotiate" | "tender" | null;
  termMonths: 12 | 24 | 36 | null;
  payment: { net60: boolean; net90: boolean; consolidated: boolean };
  clauses: { flexStaff: boolean; techExit: boolean };
  fleet: { esimMdm: boolean; multiSim: boolean; network: "any" | "telekom" | "vodafone" | "o2" };
};

const DEFAULT_STRATEGY: NegotiationStrategy = {
  approach: null,
  termMonths: null,
  payment: { net60: false, net90: false, consolidated: false },
  clauses: { flexStaff: false, techExit: false },
  fleet: { esimMdm: false, multiSim: false, network: "any" },
};

/** Top-level activeView. */
export type ActiveView = "dashboard" | "mobilfunk" | "locked" | "ai";

export type CategoryMeta = {
  key: Category;
  label: string;
  emoji: string;
  available: boolean;
  subs: { key: SubKey; label: string; emoji: string; available: boolean }[];
};

export const CATEGORIES_META: CategoryMeta[] = [
  {
    key: "telco",
    label: "Telekommunikation",
    emoji: "📞",
    available: true,
    subs: [
      { key: "mobilfunk", label: "Mobilfunk", emoji: "📱", available: true },
      { key: "festnetz", label: "Festnetz", emoji: "☎️", available: false },
      { key: "daten", label: "Datenleitungen", emoji: "🌐", available: false },
    ],
  },
  { key: "office", label: "Office-Suite", emoji: "💻", available: false, subs: [] },
  { key: "saas", label: "SaaS Plattformen", emoji: "☁️", available: false, subs: [] },
  { key: "cloud", label: "Cloud Infrastruktur", emoji: "🌐", available: false, subs: [] },
  { key: "hardware", label: "Hardware & Workplace", emoji: "🔌", available: false, subs: [] },
];

/** Default Mobilfunk metrics for State C (overridable in Admin). */
export type MobilfunkMetrics = {
  costMonthly: number;        // 18420
  usagePercent: number;       // 84
  runtimeMonths: number;      // 14
  savingsYearly: number;      // 24320
  arpuActual: number;         // 23.02
  arpuTarget: number;         // 14.50
};

const DEFAULT_MOBILFUNK: MobilfunkMetrics = {
  costMonthly: 18420,
  usagePercent: 84,
  runtimeMonths: 14,
  savingsYearly: 24320,
  arpuActual: 23.02,
  arpuTarget: 14.5,
};

export const PRICING = {
  BASE_PRICE: 2800,
  DISCOUNT_PER_AREA: 200,
  MIN_PRICE: 1300,
  TOTAL_AREAS: 5,
};

type Ctx = {
  mobilfunkStatus: UploadStatus;
  mobilfunkFile?: string;
  mobilfunkStage: MobilfunkStage;
  strategy: NegotiationStrategy;
  activeView: ActiveView;
  lockedHint: Category | null;
  metrics: MobilfunkMetrics;
  priceOverride: number | null;
  spendOverride: number | null;
  savingsOverride: number | null;
  effectiveSpendMonthly: number;
  effectiveSavingsYearly: number;
  currentPrice: number;
  totalDiscount: number;
  activatedAreas: number;
  setActiveView: (v: ActiveView) => void;
  goDashboard: () => void;
  goMobilfunk: () => void;
  goLocked: (c: Category) => void;
  startMobilfunkUpload: (fileName?: string) => void;
  demoUnlock: () => void;
  setMobilfunkStatus: (s: UploadStatus) => void;
  setMobilfunkStage: (s: MobilfunkStage) => void;
  updateStrategy: (s: Partial<NegotiationStrategy>) => void;
  resetStrategy: () => void;
  updateMetrics: (m: Partial<MobilfunkMetrics>) => void;
  setPriceOverride: (n: number | null) => void;
  setSpendOverride: (n: number | null) => void;
  setSavingsOverride: (n: number | null) => void;
  resetAll: () => void;
};


const CoreSpendContext = createContext<Ctx | null>(null);

export function CoreSpendProvider({ children }: { children: ReactNode }) {
  const [mobilfunkStatus, setMobilfunkStatus] = useState<UploadStatus>("idle");
  const [mobilfunkFile, setMobilfunkFile] = useState<string | undefined>();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [lockedHint, setLockedHint] = useState<Category | null>(null);
  const [metrics, setMetrics] = useState<MobilfunkMetrics>(DEFAULT_MOBILFUNK);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [spendOverride, setSpendOverride] = useState<number | null>(null);
  const [savingsOverride, setSavingsOverride] = useState<number | null>(null);

  const goDashboard = useCallback(() => { setActiveView("dashboard"); setLockedHint(null); }, []);
  const goMobilfunk = useCallback(() => { setActiveView("mobilfunk"); setLockedHint(null); }, []);
  const goLocked = useCallback((c: Category) => { setLockedHint(c); setActiveView("locked"); }, []);

  const startMobilfunkUpload = useCallback((fileName?: string) => {
    setMobilfunkFile(fileName);
    setMobilfunkStatus("processing");
  }, []);

  const demoUnlock = useCallback(() => setMobilfunkStatus("analyzed"), []);

  const updateMetrics = useCallback((m: Partial<MobilfunkMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...m }));
  }, []);

  const resetAll = useCallback(() => {
    setMobilfunkStatus("idle");
    setMobilfunkFile(undefined);
    setMetrics(DEFAULT_MOBILFUNK);
    setPriceOverride(null);
    setSpendOverride(null);
    setSavingsOverride(null);
  }, []);

  const mobilfunkLive = mobilfunkStatus === "analyzed";

  const { activatedAreas, totalDiscount, currentPrice, effectiveSpendMonthly, effectiveSavingsYearly } = useMemo(() => {
    const areas = mobilfunkLive ? 1 : 0;
    const discount = areas * PRICING.DISCOUNT_PER_AREA;
    const price = priceOverride ?? Math.max(PRICING.BASE_PRICE - discount, PRICING.MIN_PRICE);
    const spend = spendOverride ?? (mobilfunkLive ? metrics.costMonthly : 0);
    const savings = savingsOverride ?? (mobilfunkLive ? metrics.savingsYearly : 0);
    return {
      activatedAreas: areas,
      totalDiscount: discount,
      currentPrice: price,
      effectiveSpendMonthly: spend,
      effectiveSavingsYearly: savings,
    };
  }, [mobilfunkLive, priceOverride, spendOverride, savingsOverride, metrics.costMonthly, metrics.savingsYearly]);

  const value: Ctx = {
    mobilfunkStatus,
    mobilfunkFile,
    activeView,
    lockedHint,
    metrics,
    priceOverride,
    spendOverride,
    savingsOverride,
    effectiveSpendMonthly,
    effectiveSavingsYearly,
    currentPrice,
    totalDiscount,
    activatedAreas,
    setActiveView,
    goDashboard,
    goMobilfunk,
    goLocked,
    startMobilfunkUpload,
    demoUnlock,
    setMobilfunkStatus,
    updateMetrics,
    setPriceOverride,
    setSpendOverride,
    setSavingsOverride,
    resetAll,

  };

  return <CoreSpendContext.Provider value={value}>{children}</CoreSpendContext.Provider>;
}

export function useCoreSpend() {
  const ctx = useContext(CoreSpendContext);
  if (!ctx) throw new Error("useCoreSpend must be used within CoreSpendProvider");
  return ctx;
}

export function formatEUR(n: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0, ...opts }).format(n);
}
