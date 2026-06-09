import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type Category = "telco" | "office" | "saas" | "cloud" | "hardware";
export type SubKey = "mobilfunk" | "festnetz" | "daten";
export type UploadStatus = "idle" | "processing" | "pending" | "analyzed";
export type MobilfunkStage = "cockpit" | "wizard" | "mandate";
export type TimeMode = "monthly" | "yearly";

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
  | "corestart"
  | "dashboard"
  | "mobilfunk"
  | "officeupload"
  | "locked"
  | "ai"
  | "deadlines"
  | "optimizations"
  | "spend"
  | "risk";

/** Status for each Core Start tile. */
export type CoreStartStatus = "analyzed" | "pending" | "comingsoon";
export type CoreStartStatuses = Record<Category, CoreStartStatus>;
const DEFAULT_CORESTART_STATUSES: CoreStartStatuses = {
  telco: "pending",
  office: "comingsoon",
  saas: "comingsoon",
  cloud: "comingsoon",
  hardware: "comingsoon",
};

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
export type NoUsageItem = {
  label: string;
  area: string;
  count: number;
  unit: string;
  yearlyCost: number;
  action: string;
};
export type TariffItem = {
  label: string;
  area: string;
  yearlyCost: number;
  lever: string;
};
export type Optimizations = {
  noUsage: NoUsageItem[];
  tariffMismatches: TariffItem[];
};

const DEFAULT_OPTIMIZATIONS: Optimizations = {
  noUsage: [
    {
      label: "Inaktive SIM-Karten (0 KB Datenverbrauch seit 6 Mon.)",
      area: "Telekommunikation",
      count: 14,
      unit: "SIMs",
      yearlyCost: 4200,
      action: "Sofortige Deaktivierung / Abschaltung",
    },
  ],
  tariffMismatches: [
    {
      label: "Auslands-Roaming ohne passende Tarif-Option (USA/CH)",
      area: "Telekommunikation",
      yearlyCost: 11720,
      lever: "Umstellung auf zentriertes Business-Roaming-Paket",
    },
    {
      label: "Überdimensionierte Datenpässe (Ungenutzte Flatrates)",
      area: "Telekommunikation",
      yearlyCost: 8400,
      lever: "Downgrade auf volumenbasierte Pools",
    },
  ],
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
  coreStartStatuses: CoreStartStatuses;
  updateCoreStartStatus: (c: Category, s: CoreStartStatus) => void;
  updateCockpitMetrics: (m: Partial<CockpitMetrics>) => void;
  updateDeadline: (index: number, patch: Partial<DeadlineItem>) => void;
  updateNoUsage: (index: number, patch: Partial<NoUsageItem>) => void;
  updateTariff: (index: number, patch: Partial<TariffItem>) => void;
  updateSpendArea: (index: number, patch: Partial<SpendAreaItem>) => void;
  updateRiskItem: (index: number, patch: Partial<RiskItem>) => void;
  setActiveView: (v: ActiveView) => void;
  goCockpit: () => void;
  goCoreStart: () => void;
  goDashboard: () => void;
  goMobilfunk: () => void;
  goOfficeUpload: () => void;
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
  timeMode: TimeMode;
  setTimeMode: (m: TimeMode) => void;
  consultantBriefing: string;
  setConsultantBriefing: (s: string) => void;
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
  const [coreStartStatuses, setCoreStartStatuses] = useState<CoreStartStatuses>(DEFAULT_CORESTART_STATUSES);
  const [timeMode, setTimeMode] = useState<TimeMode>("yearly");
  const [consultantBriefing, setConsultantBriefing] = useState<string>("");

  const updateCoreStartStatus = useCallback((c: Category, s: CoreStartStatus) => {
    setCoreStartStatuses((prev) => ({ ...prev, [c]: s }));
  }, []);

  const goCockpit = useCallback(() => { setActiveView("cockpit"); setLockedHint(null); }, []);
  const goCoreStart = useCallback(() => { setActiveView("corestart"); setLockedHint(null); }, []);
  const goDashboard = useCallback(() => { setActiveView("dashboard"); setLockedHint(null); }, []);
  const goMobilfunk = useCallback(() => { setActiveView("mobilfunk"); setLockedHint(null); }, []);
  const goOfficeUpload = useCallback(() => { setActiveView("officeupload"); setLockedHint(null); }, []);
  const goLocked = useCallback((c: Category) => { setLockedHint(c); setActiveView("locked"); }, []);
  const goDeadlines = useCallback(() => { setActiveView("deadlines"); setLockedHint(null); }, []);
  const goOptimizations = useCallback(() => { setActiveView("optimizations"); setLockedHint(null); }, []);
  const goSpend = useCallback(() => { setActiveView("spend"); setLockedHint(null); }, []);
  const goRisk = useCallback(() => { setActiveView("risk"); setLockedHint(null); }, []);

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

  const updateNoUsage = useCallback((index: number, patch: Partial<NoUsageItem>) => {
    setOptimizations((prev) => ({
      ...prev,
      noUsage: prev.noUsage.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  }, []);

  const updateTariff = useCallback((index: number, patch: Partial<TariffItem>) => {
    setOptimizations((prev) => ({
      ...prev,
      tariffMismatches: prev.tariffMismatches.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  }, []);

  const updateSpendArea = useCallback((index: number, patch: Partial<SpendAreaItem>) => {
    setSpendBreakdown((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }, []);

  const updateRiskItem = useCallback((index: number, patch: Partial<RiskItem>) => {
    setRiskItems((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
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
    setSpendBreakdown(DEFAULT_SPEND_BREAKDOWN);
    setRiskItems(DEFAULT_RISK_ITEMS);
    setPriceOverride(null);
    setSpendOverride(null);
    setSavingsOverride(null);
    setCoreStartStatuses(DEFAULT_CORESTART_STATUSES);
  }, []);

  const mobilfunkLive = mobilfunkStatus === "analyzed";

  // Derived savings (round UP per requirement)
  const derivedSavings = useMemo(() => {
    const a = optimizations.noUsage.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0);
    const b = optimizations.tariffMismatches.reduce((s, it) => s + (Number(it.yearlyCost) || 0), 0);
    return Math.ceil(a + b);
  }, [optimizations]);

  // Derived spendMonthly = Summe der 5 Kernbereiche
  const derivedSpendMonthly = useMemo(
    () => spendBreakdown.reduce((sum, a) => sum + (Number(a.monthly) || 0), 0),
    [spendBreakdown],
  );

  // Derived riskExposure = Summe aller Risiko-Volumen
  const derivedRiskExposure = useMemo(
    () => riskItems.reduce((sum, r) => sum + (Number(r.remainingVolume) || 0), 0),
    [riskItems],
  );

  // Derived critical-deadline count (any contract with months <= deadlineWindowDays/30)
  const derivedCriticalCount = useMemo(() => {
    const windowMonths = Math.max(1, Math.round(cockpitMetrics.deadlineWindowDays / 30));
    return deadlines.filter((d) => d.remainingMonths > 0 && d.remainingMonths <= windowMonths).length;
  }, [deadlines, cockpitMetrics.deadlineWindowDays]);

  const cockpit: CockpitView = useMemo(
    () => ({
      ...cockpitMetrics,
      spendMonthly: derivedSpendMonthly,
      riskExposure: derivedRiskExposure,
      savingsYearly: derivedSavings,
      criticalDeadlines: derivedCriticalCount,
    }),
    [cockpitMetrics, derivedSpendMonthly, derivedRiskExposure, derivedSavings, derivedCriticalCount],
  );

  // Derived ticker / briefing
  const tickerItems: TickerItem[] = useMemo(() => {
    const noUsageYearly = optimizations.noUsage[0]?.yearlyCost ?? 4200;
    const windowMonths = Math.max(1, Math.round(cockpitMetrics.deadlineWindowDays / 30));
    const upcoming = deadlines.filter((d) => d.remainingMonths > 0 && d.remainingMonths <= windowMonths);
    const top = upcoming[0] ?? deadlines[0];
    const months = top?.remainingMonths ?? 5;
    return [
      {
        tone: "danger",
        text: `Unnötige Kapitalbindung: ${formatEUR(noUsageYearly)} / Jahr durch inaktive und ungenutzte Mobilfunk-Assets identifiziert (Sofortmaßnahme empfohlen).`,
        target: "optimizations",
      },
      {
        tone: "warning",
        text: `Strategisches Zeitfenster: Kommerzielles Verhandlungsfenster für Telekommunikation geöffnet (Vertragslaufzeit endet in ${months} Monaten).`,
        target: "deadlines",
      },
      {
        tone: "success",
        text: `Sourcing-Hebel aktiv: Dein durchschnittlicher Preis pro User (ARPU) liegt 18% über dem DACH-Marktdurchschnitt. Einsparungspotenzial von ${formatEUR(derivedSavings)} freigeschaltet.`,
        target: "mobilfunk",
      },
      {
        tone: "success",
        text: "Daten-Validierung abgeschlossen: Bestehender Mobilfunk-Stack erfolgreich anonymisiert und gegen 1.200+ reale B2B-Vertragsabschlüsse gematcht.",
        target: "mobilfunk",
      },
    ];
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
    timeMode,
    setTimeMode,
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
    spendBreakdown,
    riskItems,
    tickerItems,
    coreStartStatuses,
    updateCoreStartStatus,
    updateCockpitMetrics,
    updateDeadline,
    updateNoUsage,
    updateTariff,
    updateSpendArea,
    updateRiskItem,
    setActiveView,
    goCockpit,
    goCoreStart,
    goDashboard,
    goMobilfunk,
    goOfficeUpload,
    goLocked,
    goDeadlines,
    goOptimizations,
    goSpend,
    goRisk,
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
    consultantBriefing,
    setConsultantBriefing,
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
