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
export type ActiveView =
  | "cockpit"
  | "dashboard"
  | "mobilfunk"
  | "locked"
  | "ai"
  | "deadlines"
  | "optimizations"
  | "spend"
  | "risk";

/** Editable raw cockpit metrics (those not derived from detail data). */
export type CockpitMetrics = {
  spendYoyPercent: number;
  savingsPercent: number;
  deadlineWindowDays: number;
  impactRealized: number;
  roi: number;
};

const DEFAULT_COCKPIT: CockpitMetrics = {
  spendYoyPercent: 8.4,
  savingsPercent: 17.3,
  deadlineWindowDays: 180,
  impactRealized: 58400,
  roi: 7.3,
};

/** Derived cockpit view (what UIs consume). */
export type CockpitView = CockpitMetrics & {
  spendMonthly: number;
  savingsYearly: number;
  criticalDeadlines: number;
  riskExposure: number;
};

export type TickerTone = "success" | "warning" | "danger";
export type TickerItem = { tone: TickerTone; text: string; target?: ActiveView };

/** Deadline (contract) item shown on the Fristen detail page + Briefing. */
export type DeadlineItem = {
  vendor: string;          // "Vodafone"
  contractType: string;    // "Mobilfunk-Rahmenvertrag"
  endLabel: string;        // "Endet in 5 Monaten" / "30.11.2026"
  remainingMonths: number; // 5
};

const DEFAULT_DEADLINES: DeadlineItem[] = [
  { vendor: "Vodafone", contractType: "Mobilfunk-Rahmenvertrag", endLabel: "Endet in 5 Monaten", remainingMonths: 5 },
  { vendor: "Microsoft", contractType: "M365 E5 Enterprise", endLabel: "Endet in 9 Monaten", remainingMonths: 9 },
  { vendor: "AWS", contractType: "Reserved Instances Q1", endLabel: "Endet in 11 Monaten", remainingMonths: 11 },
];

/** Optimizations driving the savings KPI + danger briefing row. */
export type Optimizations = {
  inactiveSims: { count: number; yearlyCost: number };
  duplicateLicenses: { count: number; yearlyCost: number };
};

const DEFAULT_OPTIMIZATIONS: Optimizations = {
  inactiveSims: { count: 14, yearlyCost: 4200 },
  duplicateLicenses: { count: 27, yearlyCost: 20120 },
};

/** Spend breakdown by 5 IT core areas (Detail page „Validierte IT-Ausgaben"). */
export type SpendArea = "telco" | "office" | "saas" | "cloud" | "hardware";
export type SpendAreaItem = {
  key: SpendArea;
  label: string;
  emoji: string;
  monthly: number;
  yoyPercent: number;
};
const DEFAULT_SPEND_BREAKDOWN: SpendAreaItem[] = [
  { key: "telco", label: "Telekommunikation", emoji: "📞", monthly: 7820, yoyPercent: 8.4 },
  { key: "office", label: "Office Suites", emoji: "💻", monthly: 3450, yoyPercent: 4.1 },
  { key: "saas", label: "SaaS Plattformen", emoji: "☁️", monthly: 3200, yoyPercent: 12.5 },
  { key: "cloud", label: "Cloud Infrastruktur", emoji: "🌐", monthly: 2700, yoyPercent: 9.8 },
  { key: "hardware", label: "Hardware & Workplace", emoji: "🔌", monthly: 1250, yoyPercent: -2.3 },
];

/** Risk-Exposure rows (Detail page „Vertragsrisiko"). */
export type RiskStatus = "akut" | "verhandlung" | "sicher";
export type RiskItem = {
  vendor: string;
  area: string;
  remainingVolume: number;
  status: RiskStatus;
};
const DEFAULT_RISK_ITEMS: RiskItem[] = [
  { vendor: "Vodafone", area: "Mobilfunk", remainingVolume: 312000, status: "akut" },
  { vendor: "Microsoft", area: "Office / M365", remainingVolume: 198000, status: "verhandlung" },
  { vendor: "AWS", area: "Cloud Infrastruktur", remainingVolume: 145000, status: "sicher" },
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

export type MobilfunkMetrics = {
  costMonthly: number;
  usagePercent: number;
  runtimeMonths: number;
  savingsYearly: number;
  arpuActual: number;
  arpuTarget: number;
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
  cockpit: CockpitView;
  deadlines: DeadlineItem[];
  optimizations: Optimizations;
  spendBreakdown: SpendAreaItem[];
  riskItems: RiskItem[];
  tickerItems: TickerItem[];
  updateCockpitMetrics: (m: Partial<CockpitMetrics>) => void;
  updateDeadline: (index: number, patch: Partial<DeadlineItem>) => void;
  updateOptimizations: (patch: Partial<Optimizations>) => void;
  updateSpendArea: (index: number, patch: Partial<SpendAreaItem>) => void;
  updateRiskItem: (index: number, patch: Partial<RiskItem>) => void;
  setActiveView: (v: ActiveView) => void;
  goCockpit: () => void;
  goDashboard: () => void;
  goMobilfunk: () => void;
  goLocked: (c: Category) => void;
  goDeadlines: () => void;
  goOptimizations: () => void;
  goSpend: () => void;
  goRisk: () => void;
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
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(DEFAULT_DEADLINES);
  const [optimizations, setOptimizations] = useState<Optimizations>(DEFAULT_OPTIMIZATIONS);
  const [spendBreakdown, setSpendBreakdown] = useState<SpendAreaItem[]>(DEFAULT_SPEND_BREAKDOWN);
  const [riskItems, setRiskItems] = useState<RiskItem[]>(DEFAULT_RISK_ITEMS);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [spendOverride, setSpendOverride] = useState<number | null>(null);
  const [savingsOverride, setSavingsOverride] = useState<number | null>(null);
  const [mobilfunkStage, setMobilfunkStage] = useState<MobilfunkStage>("cockpit");
  const [strategy, setStrategy] = useState<NegotiationStrategy>(DEFAULT_STRATEGY);

  const goCockpit = useCallback(() => { setActiveView("cockpit"); setLockedHint(null); }, []);
  const goDashboard = useCallback(() => { setActiveView("dashboard"); setLockedHint(null); }, []);
  const goMobilfunk = useCallback(() => { setActiveView("mobilfunk"); setLockedHint(null); }, []);
  const goLocked = useCallback((c: Category) => { setLockedHint(c); setActiveView("locked"); }, []);
  const goDeadlines = useCallback(() => { setActiveView("deadlines"); setLockedHint(null); }, []);
  const goOptimizations = useCallback(() => { setActiveView("optimizations"); setLockedHint(null); }, []);

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

  const updateDeadline = useCallback((index: number, patch: Partial<DeadlineItem>) => {
    setDeadlines((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }, []);

  const updateOptimizations = useCallback((patch: Partial<Optimizations>) => {
    setOptimizations((prev) => ({
      inactiveSims: { ...prev.inactiveSims, ...(patch.inactiveSims ?? {}) },
      duplicateLicenses: { ...prev.duplicateLicenses, ...(patch.duplicateLicenses ?? {}) },
    }));
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
    setDeadlines(DEFAULT_DEADLINES);
    setOptimizations(DEFAULT_OPTIMIZATIONS);
    setPriceOverride(null);
    setSpendOverride(null);
    setSavingsOverride(null);
  }, []);

  const mobilfunkLive = mobilfunkStatus === "analyzed";

  // Derived savings (round UP per requirement)
  const derivedSavings = useMemo(
    () => Math.ceil(optimizations.inactiveSims.yearlyCost + optimizations.duplicateLicenses.yearlyCost),
    [optimizations],
  );

  // Derived critical-deadline count (any contract with months <= deadlineWindowDays/30)
  const derivedCriticalCount = useMemo(() => {
    const windowMonths = Math.max(1, Math.round(cockpitMetrics.deadlineWindowDays / 30));
    return deadlines.filter((d) => d.remainingMonths > 0 && d.remainingMonths <= windowMonths).length;
  }, [deadlines, cockpitMetrics.deadlineWindowDays]);

  const cockpit: CockpitView = useMemo(
    () => ({
      ...cockpitMetrics,
      savingsYearly: derivedSavings,
      criticalDeadlines: derivedCriticalCount,
    }),
    [cockpitMetrics, derivedSavings, derivedCriticalCount],
  );

  // Derived ticker / briefing
  const tickerItems: TickerItem[] = useMemo(() => {
    const items: TickerItem[] = [
      { tone: "success", text: "Mobilfunk erfolgreich analysiert", target: "mobilfunk" },
    ];
    const windowMonths = Math.max(1, Math.round(cockpitMetrics.deadlineWindowDays / 30));
    const upcoming = deadlines.filter((d) => d.remainingMonths > 0 && d.remainingMonths <= windowMonths);
    const top = (upcoming[0] ?? deadlines[0]);
    if (top) {
      items.push({
        tone: "warning",
        text: `${top.vendor} ${top.contractType} ${top.endLabel.toLowerCase().startsWith("endet") ? top.endLabel.toLowerCase() : "endet " + top.endLabel} (Verhandlungsfenster geöffnet)`,
        target: "deadlines",
      });
    }
    const sims = optimizations.inactiveSims;
    if (sims.count > 0) {
      items.push({
        tone: "danger",
        text: `${sims.count} ungenutzte SIM-Karten verursachen aktuell ${formatEUR(sims.yearlyCost)} unnötige Kosten`,
        target: "optimizations",
      });
    }
    items.push({
      tone: "success",
      text: `Gesamtes Sparpotenzial von ${formatEUR(derivedSavings)} sofort realisierbar`,
      target: "optimizations",
    });
    return items;
  }, [deadlines, optimizations, derivedSavings, cockpitMetrics.deadlineWindowDays]);

  const { activatedAreas, totalDiscount, currentPrice, effectiveSpendMonthly, effectiveSavingsYearly } = useMemo(() => {
    const areas = mobilfunkLive ? 1 : 0;
    const discount = areas * PRICING.DISCOUNT_PER_AREA;
    const price = priceOverride ?? Math.max(PRICING.BASE_PRICE - discount, PRICING.MIN_PRICE);
    const spend = spendOverride ?? (mobilfunkLive ? metrics.costMonthly : 0);
    const savings = savingsOverride ?? (mobilfunkLive ? derivedSavings : 0);
    return {
      activatedAreas: areas,
      totalDiscount: discount,
      currentPrice: price,
      effectiveSpendMonthly: spend,
      effectiveSavingsYearly: savings,
    };
  }, [mobilfunkLive, priceOverride, spendOverride, savingsOverride, metrics.costMonthly, derivedSavings]);

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
    cockpit,
    deadlines,
    optimizations,
    tickerItems,
    updateCockpitMetrics,
    updateDeadline,
    updateOptimizations,
    setActiveView,
    goCockpit,
    goDashboard,
    goMobilfunk,
    goLocked,
    goDeadlines,
    goOptimizations,
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
