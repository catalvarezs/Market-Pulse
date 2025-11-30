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

export interface FilterState {
  country: Country;
  category: Category;
}

export const COUNTRY_LABELS: Record<Country, string> = {
  [Country.INT]: 'Global (Int)',
  [Country.MX]: 'México (MX)',
  [Country.US]: 'United States (US)',
  [Country.ES]: 'España (ES)',
  [Country.AR]: 'Argentina (AR)',
  [Country.CL]: 'Chile (CL)'
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.BUSINESS]: 'Negocios',
  [Category.TECHNOLOGY]: 'Tecnología',
  [Category.GENERAL]: 'General',
  [Category.FINANCE]: 'Finanzas',
  [Category.ECONOMY]: 'Economía',
  [Category.POLITICS]: 'Política',
  [Category.CRYPTO]: 'Criptomonedas',
  [Category.STARTUPS]: 'Startups'
};