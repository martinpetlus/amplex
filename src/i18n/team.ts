import type { Lang } from "./ui";

export type MemberId = "peter" | "adam" | "martin";

export interface Member {
  id: MemberId;
  name: string;
  initials: string;
  role: string;
  areas: string[];
  /** Path under /public (without base). Falls back to a placeholder when omitted. */
  photo?: string;
}

export const teamContent: Record<
  Lang,
  { title: string; intro: string; members: Member[] }
> = {
  sk: {
    title: "O nás",
    intro:
      "Sme malý tím, ktorý spája desaťročia praxe v priemyselnej automatizácii s modernou prácou s dátami a umelou inteligenciou.",
    members: [
      {
        id: "adam",
        name: "Adam Petluš",
        initials: "AP",
        role: "Dátové inžinierstvo a cloud",
        areas: [
          "Dátové pipeline (Azure, Databricks, SQL)",
          "Dashboardy a vizualizácia dát",
          "DevOps a CI/CD",
          "Cloudová infraštruktúra",
        ],
      },
      {
        id: "martin",
        name: "Martin Petluš",
        initials: "MP",
        role: "AI a softvérové riešenia",
        areas: [
          "AI chatboty a asistenti",
          "Integrácia AI a jazykových modelov",
          "Strojové učenie",
          "Webové aplikácie",
          "Softvér na mieru",
        ],
      },
      {
        id: "peter",
        name: "Peter Petluš",
        initials: "PP",
        role: "Priemyselná automatizácia a elektro",
        areas: [
          "Programovanie PLC (Siemens, Mitsubishi, Hitachi, Schneider)",
          "Diagnostika elektrických porúch a snímačov",
          "SCADA systémy (Promotic, WinCC)",
          "Opravy a údržba automatizovaných liniek",
        ],
      },
    ],
  },
  en: {
    title: "About us",
    intro:
      "We are a small team combining decades of hands-on industrial automation experience with modern data and AI work.",
    members: [
      {
        id: "adam",
        name: "Adam Petluš",
        initials: "AP",
        role: "Data engineering & cloud",
        areas: [
          "Data pipelines (Azure, Databricks, SQL)",
          "Dashboards and data visualization",
          "DevOps and CI/CD",
          "Cloud infrastructure",
        ],
      },
      {
        id: "martin",
        name: "Martin Petluš",
        initials: "MP",
        role: "AI & software solutions",
        areas: [
          "AI chatbots and assistants",
          "AI and language model integration",
          "Machine learning",
          "Web applications",
          "Custom software",
        ],
      },
      {
        id: "peter",
        name: "Peter Petluš",
        initials: "PP",
        role: "Industrial automation & electrical",
        areas: [
          "PLC programming (Siemens, Mitsubishi, Hitachi, Schneider)",
          "Electrical fault and sensor diagnostics",
          "SCADA systems (Promotic, WinCC)",
          "Repairs and maintenance of automation lines",
        ],
      },
    ],
  },
};
