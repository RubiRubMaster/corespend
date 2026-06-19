import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo, type ReactNode } from "react";

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
  { key: "cloud", label: "Cloud Infrastruktur", emoji: "🌐", monthly: 14500, yoyPercent: 9.8 },
  { key: "saas", label: "SaaS / AI", emoji: "☁️", monthly: 9600, yoyPercent: 12.5 },
  { key: "telco", label: "Telekommunikation", emoji: "📞", monthly: 4800, yoyPercent: 8.4 },
  { key: "office", label: "Office Suites", emoji: "💻", monthly: 2240, yoyPercent: 4.1 },
  { key: "hardware", label: "Hardware & Workplace", emoji: "🔌", monthly: 960, yoyPercent: -2.3 },
];

/** Top 4 Renewals / Sourcing Pipeline (statisch, demo). */
export type RenewalStatus = "In Analyse" | "Strategie bereit" | "In Verhandlung" | "Erfolgreich optimiert";
export type RenewalItem = {
  category: string;
  vendor: string;
  due: string;
  dueDays: number;
  status: RenewalStatus;
  volume?: number;
};
export const DEFAULT_RENEWALS: RenewalItem[] = [
  { category: "Telekommunikation", vendor: "Deutsche Telekom", due: "In 30 Tagen", dueDays: 30, status: "In Verhandlung", volume: 312000 },
  { category: "SaaS / AI", vendor: "Salesforce", due: "In 90 Tagen", dueDays: 90, status: "Strategie bereit", volume: 184000 },
  { category: "Cloud", vendor: "AWS", due: "In 150 Tagen", dueDays: 150, status: "In Analyse", volume: 245000 },
  { category: "Office Suites", vendor: "Microsoft 365", due: "Abgeschlossen", dueDays: -1, status: "Erfolgreich optimiert", volume: 198000 },
];
export const ALL_RENEWALS: RenewalItem[] = [
  ...DEFAULT_RENEWALS,
  { category: "SaaS / AI", vendor: "HubSpot", due: "In 210 Tagen", dueDays: 210, status: "In Analyse", volume: 64000 },
  { category: "Cloud", vendor: "Microsoft Azure", due: "In 240 Tagen", dueDays: 240, status: "In Analyse", volume: 128000 },
  { category: "SaaS / AI", vendor: "Adobe Creative Cloud", due: "In 60 Tagen", dueDays: 60, status: "Strategie bereit", volume: 42000 },
  { category: "Hardware", vendor: "Dell Leasing", due: "In 320 Tagen", dueDays: 320, status: "In Analyse", volume: 78000 },
  { category: "Telekommunikation", vendor: "Vodafone Festnetz", due: "Abgeschlossen", dueDays: -1, status: "Erfolgreich optimiert", volume: 54000 },
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
  { key: "saas", label: "SaaS / AI", emoji: "☁️", available: false, subs: [] },
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
  BASE_PRICE: 3200,
  DISCOUNT_PER_AREA: 350,
  MIN_PRICE: 1450,
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
  basePriceOverride: number | null;
  discountPerAreaOverride: number | null;
  effectiveBasePrice: number;
  effectiveDiscountPerArea: number;
  setBasePriceOverride: (n: number | null) => void;
  setDiscountPerAreaOverride: (n: number | null) => void;
  timeMode: TimeMode;
  setTimeMode: (m: TimeMode) => void;
  consultantBriefing: string;
  setConsultantBriefing: (s: string) => void;
  tickerOverrides: (Partial<TickerItem> | null)[];
  updateTickerItem: (index: number, patch: Partial<TickerItem>) => void;
  resetTickerItem: (index: number) => void;
  resetAll: () => void;
};


const CoreSpendContext = createContext<Ctx | null>(null);

export type CoreSpendSnapshot = {
  mobilfunkStatus?: UploadStatus;
  mobilfunkFile?: string;
  activeView?: ActiveView;
  metrics?: MobilfunkMetrics;
  cockpitMetrics?: CockpitMetrics;
  deadlines?: DeadlineItem[];
  optimizations?: Optimizations;
  spendBreakdown?: SpendAreaItem[];
  riskItems?: RiskItem[];
  priceOverride?: number | null;
  spendOverride?: number | null;
  savingsOverride?: number | null;
  mobilfunkStage?: MobilfunkStage;
  strategy?: NegotiationStrategy;
  coreStartStatuses?: CoreStartStatuses;
  timeMode?: TimeMode;
  consultantBriefing?: string;
  tickerOverrides?: (Partial<TickerItem> | null)[];
  basePriceOverride?: number | null;
  discountPerAreaOverride?: number | null;
};

export function CoreSpendProvider({
  children,
  initialSnapshot,
  onPersist,
}: {
  children: ReactNode;
  initialSnapshot?: CoreSpendSnapshot;
  onPersist?: (snap: CoreSpendSnapshot) => void;
}) {
  const s = initialSnapshot ?? {};
  const [mobilfunkStatus, setMobilfunkStatus] = useState<UploadStatus>(s.mobilfunkStatus ?? "idle");
  const [mobilfunkFile, setMobilfunkFile] = useState<string | undefined>(s.mobilfunkFile);
  const [activeView, setActiveView] = useState<ActiveView>(s.activeView ?? "cockpit");
  const [lockedHint, setLockedHint] = useState<Category | null>(null);
  const [metrics, setMetrics] = useState<MobilfunkMetrics>(s.metrics ?? DEFAULT_MOBILFUNK);
  const [cockpitMetrics, setCockpitMetrics] = useState<CockpitMetrics>(s.cockpitMetrics ?? DEFAULT_COCKPIT);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(s.deadlines ?? DEFAULT_DEADLINES);
  const [optimizations, setOptimizations] = useState<Optimizations>(s.optimizations ?? DEFAULT_OPTIMIZATIONS);
  const [spendBreakdown, setSpendBreakdown] = useState<SpendAreaItem[]>(s.spendBreakdown ?? DEFAULT_SPEND_BREAKDOWN);
  const [riskItems, setRiskItems] = useState<RiskItem[]>(s.riskItems ?? DEFAULT_RISK_ITEMS);
  const [priceOverride, setPriceOverride] = useState<number | null>(s.priceOverride ?? null);
  const [spendOverride, setSpendOverride] = useState<number | null>(s.spendOverride ?? null);
  const [savingsOverride, setSavingsOverride] = useState<number | null>(s.savingsOverride ?? null);
  const [mobilfunkStage, setMobilfunkStage] = useState<MobilfunkStage>(s.mobilfunkStage ?? "cockpit");
  const [strategy, setStrategy] = useState<NegotiationStrategy>(s.strategy ?? DEFAULT_STRATEGY);
  const [coreStartStatuses, setCoreStartStatuses] = useState<CoreStartStatuses>(s.coreStartStatuses ?? DEFAULT_CORESTART_STATUSES);
  const [timeMode, setTimeMode] = useState<TimeMode>(s.timeMode ?? "yearly");
  const [consultantBriefing, setConsultantBriefing] = useState<string>(s.consultantBriefing ?? "");
  const [tickerOverrides, setTickerOverrides] = useState<(Partial<TickerItem> | null)[]>(s.tickerOverrides ?? [null, null, null, null]);
  const [basePriceOverride, setBasePriceOverride] = useState<number | null>(s.basePriceOverride ?? null);
  const [discountPerAreaOverride, setDiscountPerAreaOverride] = useState<number | null>(s.discountPerAreaOverride ?? null);

  // Debounced persistence — fires whenever any persistable state changes
  const persistRef = useRef(onPersist);
  persistRef.current = onPersist;
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (!persistRef.current) return;
    const snap: CoreSpendSnapshot = {
      mobilfunkStatus, mobilfunkFile, activeView, metrics, cockpitMetrics,
      deadlines, optimizations, spendBreakdown, riskItems,
      priceOverride, spendOverride, savingsOverride, mobilfunkStage,
      strategy, coreStartStatuses, timeMode, consultantBriefing, tickerOverrides,
      basePriceOverride, discountPerAreaOverride,
    };
    const t = setTimeout(() => { persistRef.current?.(snap); }, 800);
    return () => clearTimeout(t);
  }, [mobilfunkStatus, mobilfunkFile, activeView, metrics, cockpitMetrics,
      deadlines, optimizations, spendBreakdown, riskItems,
      priceOverride, spendOverride, savingsOverride, mobilfunkStage,
      strategy, coreStartStatuses, timeMode, consultantBriefing, tickerOverrides,
      basePriceOverride, discountPerAreaOverride]);

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

  const updateTickerItem = useCallback((index: number, patch: Partial<TickerItem>) => {
    setTickerOverrides((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] ?? {}), ...patch };
      return next;
    });
  }, []);
  const resetTickerItem = useCallback((index: number) => {
    setTickerOverrides((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

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
    setConsultantBriefing("");
    setTickerOverrides([null, null, null, null]);
    setBasePriceOverride(null);
    setDiscountPerAreaOverride(null);
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
    ].map((it, i) => ({ ...it, ...(tickerOverrides[i] ?? {}) })) as TickerItem[];
  }, [deadlines, optimizations, derivedSavings, cockpitMetrics.deadlineWindowDays, tickerOverrides]);

  const effectiveBasePrice = basePriceOverride ?? PRICING.BASE_PRICE;
  const effectiveDiscountPerArea = discountPerAreaOverride ?? PRICING.DISCOUNT_PER_AREA;

  const { activatedAreas, totalDiscount, currentPrice, effectiveSpendMonthly, effectiveSavingsYearly } = useMemo(() => {
    const areas = mobilfunkLive ? 1 : 0;
    const discount = areas * effectiveDiscountPerArea;
    const price = priceOverride ?? Math.max(effectiveBasePrice - discount, PRICING.MIN_PRICE);
    const spend = spendOverride ?? (mobilfunkLive ? metrics.costMonthly : 0);
    const savings = savingsOverride ?? (mobilfunkLive ? derivedSavings : 0);
    return {
      activatedAreas: areas,
      totalDiscount: discount,
      currentPrice: price,
      effectiveSpendMonthly: spend,
      effectiveSavingsYearly: savings,
    };
  }, [mobilfunkLive, priceOverride, spendOverride, savingsOverride, metrics.costMonthly, derivedSavings, effectiveBasePrice, effectiveDiscountPerArea]);

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
    basePriceOverride,
    discountPerAreaOverride,
    effectiveBasePrice,
    effectiveDiscountPerArea,
    setBasePriceOverride,
    setDiscountPerAreaOverride,
    consultantBriefing,
    setConsultantBriefing,
    tickerOverrides,
    updateTickerItem,
    resetTickerItem,
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
