import { Smartphone, Cloud, CloudCog, Cpu, Globe, type LucideIcon } from "lucide-react";
import type { CategoryMeta } from "@/lib/corespend-store";

export function iconFor(name: CategoryMeta["iconName"]): LucideIcon {
  switch (name) {
    case "Smartphone": return Smartphone;
    case "Cloud": return Cloud;
    case "CloudCog": return CloudCog;
    case "Cpu": return Cpu;
    case "Globe": return Globe;
  }
}
