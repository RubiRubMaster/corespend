export type NegotiationStatus = "analyse" | "strategie" | "verhandlung" | "geschlossen";

export type Negotiation = {
  area: string;
  vendor: string;
  endLabel: string;
  daysRemaining: number; // negative = bereits geschlossen / in der Vergangenheit
  status: NegotiationStatus;
};

export const NEGOTIATIONS: Negotiation[] = [
  { area: "SaaS / AI", vendor: "Salesforce · Sales Cloud", endLabel: "In 95 Tagen", daysRemaining: 95, status: "verhandlung" },
  { area: "Telekommunikation", vendor: "Vodafone · Mobilfunk-Rahmenvertrag", endLabel: "In 150 Tagen", daysRemaining: 150, status: "verhandlung" },
  { area: "Office Suites", vendor: "Microsoft · M365 E5 Enterprise", endLabel: "In 270 Tagen", daysRemaining: 270, status: "strategie" },
  { area: "Cloud", vendor: "AWS · Reserved Instances Q1", endLabel: "In 330 Tagen", daysRemaining: 330, status: "analyse" },
  { area: "SaaS / AI", vendor: "HubSpot · Marketing Hub Enterprise", endLabel: "In 210 Tagen", daysRemaining: 210, status: "strategie" },
  { area: "Cloud", vendor: "Microsoft · Azure Enterprise Agreement", endLabel: "In 400 Tagen", daysRemaining: 400, status: "analyse" },
  { area: "Office Suites", vendor: "Adobe · Creative Cloud for Teams", endLabel: "In 180 Tagen", daysRemaining: 180, status: "strategie" },
  { area: "Hardware", vendor: "Dell · Workplace Leasing", endLabel: "Vor 12 Tagen geschlossen", daysRemaining: -12, status: "geschlossen" },
  { area: "Telekommunikation", vendor: "Telekom · Festnetz & SIP-Trunk", endLabel: "Vor 45 Tagen geschlossen", daysRemaining: -45, status: "geschlossen" },
];

export const STATUS_META: Record<NegotiationStatus, { label: string; cls: string; dot: string }> = {
  analyse:     { label: "In Analyse",              cls: "border-slate-500/40 bg-slate-500/10 text-slate-300",   dot: "bg-slate-400" },
  strategie:   { label: "Strategie bereit",         cls: "border-primary/40 bg-primary/10 text-primary",         dot: "bg-primary" },
  verhandlung: { label: "In Verhandlung",           cls: "border-orange-500/40 bg-orange-500/10 text-orange-400", dot: "bg-orange-400" },
  geschlossen: { label: "Erfolgreich geschlossen",  cls: "border-success/40 bg-success/10 text-success",         dot: "bg-success" },
};
