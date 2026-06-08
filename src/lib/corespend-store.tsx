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
export type ActiveView = "cockpit" | "dashboard" | "mobilfunk" | "locked" | "ai";

export type CockpitMetrics = {
  spendMonthly: number;        // 18420
  spendYoyPercent: number;     // 8.4 (positive = up vs Vorjahr)
  savingsYearly: number;       // 24320
  savingsPercent: number;      // 17.3
  criticalDeadlines: number;   // 3
  deadlineWindowDays: number;  // 180
  riskExposure: number;        // 312000
  impactRealized: number;      // 58400
  roi: number;                 // 7.3
};

const DEFAULT_COCKPIT: CockpitMetrics = {
  spendMonthly: 18420,
  spendYoyPercent: 8.4,
  savingsYearly: 24320,
  savingsPercent: 17.3,
  criticalDeadlines: 3,
  deadlineWindowDays: 180,
  riskExposure: 312000,
  impactRealized: 58400,
  roi: 7.3,
};

export type TickerTone = "success" | "warning" | "danger";
export type TickerItem = { tone: TickerTone; text: string };

const DEFAULT_TICKER: TickerItem[] = [
  { tone: "success", text: "Mobilfunk erfolgreich analysiert" },
  { tone: "warning", text: "Vodafone-Rahmenvertrag endet in 5 Monaten (Verhandlungsfenster geöffnet)" },
  { tone: "danger", text: "14 ungenutzte SIM-Karten verursachen aktuell 4.200 € unnötige Kosten" },
  { tone: "success", text: "Gesamtes Sparpotenzial von 24.320 € sofort realisierbar" },
];

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
  cockpitMetrics: CockpitMetrics;
  tickerItems: TickerItem[];
  updateCockpitMetrics: (m: Partial<CockpitMetrics>) => void;
  updateTickerItem: (index: number, item: Partial<TickerItem>) => void;
  setActiveView: (v: ActiveView) => void;
  goCockpit: () => void;
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
  const [activeView, setActiveView] = useState<ActiveView>("cockpit");
  const [lockedHint, setLockedHint] = useState<Category | null>(null);
  const [metrics, setMetrics] = useState<MobilfunkMetrics>(DEFAULT_MOBILFUNK);
  const [cockpitMetrics, setCockpitMetrics] = useState<CockpitMetrics>(DEFAULT_COCKPIT);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(DEFAULT_TICKER);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [spendOverride, setSpendOverride] = useState<number | null>(null);
  const [savingsOverride, setSavingsOverride] = useState<number | null>(null);
  const [mobilfunkStage, setMobilfunkStage] = useState<MobilfunkStage>("cockpit");
  const [strategy, setStrategy] = useState<NegotiationStrategy>(DEFAULT_STRATEGY);

  const goCockpit = useCallback(() => { setActiveView("cockpit"); setLockedHint(null); }, []);
  const goDashboard = useCallback(() => { setActiveView("dashboard"); setLockedHint(null); }, []);
  const goMobilfunk = useCallback(() => { setActiveView("mobilfunk"); setLockedHint(null); }, []);
  const goLocked = useCallback((c: Category) => { setLockedHint(c); setActiveView("locked"); }, []);

  const startMobilfunkUpload = useCallback((fileName?: string) => {
    setMobilfunkFile(fileName);
    setMobilfunkStatus("processing");
  }, []);

  const demoUnlock = useCallback(() => {
    setMobilfunkStatus("analyzed");
    setMobilfunkStage("cockpit");
  }, []);

  const updateMetrics = useCallback((m: Partial<MobilfunkMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...m }));
  }, []);

  const updateCockpitMetrics = useCallback((m: Partial<CockpitMetrics>) => {
    setCockpitMetrics((prev) => ({ ...prev, ...m }));
  }, []);

  const updateTickerItem = useCallback((index: number, item: Partial<TickerItem>) => {
    setTickerItems((prev) => prev.map((t, i) => (i === index ? { ...t, ...item } : t)));
  }, []);

  const updateStrategy = useCallback((s: Partial<NegotiationStrategy>) => {
    setStrategy((prev) => ({ ...prev, ...s }));
  }, []);

  const resetStrategy = useCallback(() => setStrategy(DEFAULT_STRATEGY), []);

  const resetAll = useCallback(() => {
    setMobilfunkStatus("idle");
    setMobilfunkFile(undefined);
    setMobilfunkStage("cockpit");
    setStrategy(DEFAULT_STRATEGY);
    setMetrics(DEFAULT_MOBILFUNK);
    setCockpitMetrics(DEFAULT_COCKPIT);
    setTickerItems(DEFAULT_TICKER);
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
    mobilfunkStage,
    strategy,
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
    cockpitMetrics,
    tickerItems,
    updateCockpitMetrics,
    updateTickerItem,
    setActiveView,
    goCockpit,
    goDashboard,
    goMobilfunk,
    goLocked,
    startMobilfunkUpload,
    demoUnlock,
    setMobilfunkStatus,
    setMobilfunkStage,
    updateStrategy,
    resetStrategy,
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
