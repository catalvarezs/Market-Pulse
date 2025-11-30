export type Language = 'es' | 'en';

export enum Sentiment {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral'
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: Sentiment;
  risk_score: number;
  source: string;
  url?: string;
  published_at?: string;
}

export interface MarketResponse {
  analysis: string;
  items: NewsItem[];
}

export enum Country {
  INT = 'int',
  MX = 'mx',
  US = 'us',
  ES = 'es',
  AR = 'ar',
  CL = 'cl'
}

export enum Category {
  BUSINESS = 'business',
  TECHNOLOGY = 'technology',
  GENERAL = 'general',
  FINANCE = 'finance',
  ECONOMY = 'economy',
  POLITICS = 'politics',
  CRYPTO = 'crypto',
  STARTUPS = 'startups'
}

export enum TimeRange {
  LAST_24H = 'last_24h',
  LAST_3D = 'last_3d',
  LAST_7D = 'last_7d',
  LAST_30D = 'last_30d'
}

export type SearchMode = 'standard' | 'custom';

export interface FilterState {
  country: Country;
  category: Category;
  timeRange: TimeRange;
  mode: SearchMode;
  customQuery: string;
}

// Translations
export const UI_TEXT: Record<Language, any> = {
  es: {
    region: "Región",
    topic: "Tema",
    period: "Periodo",
    analyzeButton: "Analizar",
    analyzing: "Analizando...",
    opportunities: "Oportunidades / Neutral",
    risks: "Riesgos / Negativo",
    noOpportunities: "No se detectaron oportunidades claras.",
    noRisks: "No se detectaron riesgos críticos.",
    waitingTitle: "Esperando análisis",
    waitingDesc: "Selecciona una región, tema y periodo para generar inteligencia de mercado en tiempo real.",
    error: "No se pudieron obtener los datos del mercado. Por favor intenta de nuevo.",
    readSource: "Leer fuente original",
    tabStandard: "Explorar Mercado",
    tabCustom: "Objetivo Específico",
    customPlaceholder: "Ej: Quiero invertir en litio en Chile...",
    customLabel: "Describe tu objetivo de inversión o interés",
    expertSection: "Análisis Estratégico & Contexto",
    expertDisclaimer: "Generado por IA basado en datos actuales e históricos."
  },
  en: {
    region: "Region",
    topic: "Topic",
    period: "Time Range",
    analyzeButton: "Analyze Market",
    analyzing: "Analyzing...",
    opportunities: "Opportunities / Neutral",
    risks: "Risks / Negative",
    noOpportunities: "No clear opportunities detected.",
    noRisks: "No critical risks detected.",
    waitingTitle: "Awaiting Analysis",
    waitingDesc: "Select a region, topic, and time range to generate real-time market intelligence.",
    error: "Could not fetch market data. Please try again.",
    readSource: "Read original source",
    tabStandard: "Market Explorer",
    tabCustom: "Specific Goal",
    customPlaceholder: "Ex: I want to invest in Lithium in Chile...",
    customLabel: "Describe your investment goal or interest",
    expertSection: "Strategic Analysis & Context",
    expertDisclaimer: "AI-generated based on current and historical data."
  }
};

export const COUNTRY_LABELS: Record<Language, Record<Country, string>> = {
  es: {
    [Country.INT]: 'Global (Int)',
    [Country.MX]: 'México (MX)',
    [Country.US]: 'Estados Unidos (US)',
    [Country.ES]: 'España (ES)',
    [Country.AR]: 'Argentina (AR)',
    [Country.CL]: 'Chile (CL)'
  },
  en: {
    [Country.INT]: 'Global (Int)',
    [Country.MX]: 'Mexico (MX)',
    [Country.US]: 'United States (US)',
    [Country.ES]: 'Spain (ES)',
    [Country.AR]: 'Argentina (AR)',
    [Country.CL]: 'Chile (CL)'
  }
};

export const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  es: {
    [Category.BUSINESS]: 'Negocios',
    [Category.TECHNOLOGY]: 'Tecnología',
    [Category.GENERAL]: 'General',
    [Category.FINANCE]: 'Finanzas',
    [Category.ECONOMY]: 'Economía',
    [Category.POLITICS]: 'Política',
    [Category.CRYPTO]: 'Criptomonedas',
    [Category.STARTUPS]: 'Startups'
  },
  en: {
    [Category.BUSINESS]: 'Business',
    [Category.TECHNOLOGY]: 'Technology',
    [Category.GENERAL]: 'General',
    [Category.FINANCE]: 'Finance',
    [Category.ECONOMY]: 'Economy',
    [Category.POLITICS]: 'Politics',
    [Category.CRYPTO]: 'Crypto',
    [Category.STARTUPS]: 'Startups'
  }
};

export const TIME_RANGE_LABELS: Record<Language, Record<TimeRange, string>> = {
  es: {
    [TimeRange.LAST_24H]: 'Últimas 24 Horas',
    [TimeRange.LAST_3D]: 'Últimos 3 Días',
    [TimeRange.LAST_7D]: 'Esta Semana',
    [TimeRange.LAST_30D]: 'Este Mes'
  },
  en: {
    [TimeRange.LAST_24H]: 'Last 24 Hours',
    [TimeRange.LAST_3D]: 'Last 3 Days',
    [TimeRange.LAST_7D]: 'This Week',
    [TimeRange.LAST_30D]: 'This Month'
  }
};