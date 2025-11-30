import { GoogleGenAI } from "@google/genai";
import { NewsItem, Country, Category, Sentiment, TimeRange, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (lang: Language) => {
  return lang === 'es' 
    ? `Eres un analista financiero senior de "MarketPulse". Tu trabajo es identificar riesgos y oportunidades en el mercado basándote en noticias recientes. Analiza con objetividad y brevedad en Español.`
    : `You are a senior financial analyst at "MarketPulse". Your job is to identify market risks and opportunities based on recent news. Analyze objectively and briefly in English.`;
};

const getCountryName = (code: Country, lang: Language): string => {
  const isEn = lang === 'en';
  switch (code) {
    case Country.MX: return isEn ? "Mexico" : "México";
    case Country.US: return isEn ? "United States" : "Estados Unidos";
    case Country.ES: return isEn ? "Spain" : "España";
    case Country.AR: return "Argentina";
    case Country.CL: return "Chile";
    case Country.INT: return isEn ? "the world (international focus)" : "el mundo (enfoque internacional)";
    default: return isEn ? "the world" : "el mundo";
  }
};

const getDateContext = (range: TimeRange, lang: Language) => {
  const today = new Date();
  const startDate = new Date(today);
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  
  const formatDate = (d: Date) => d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  if (lang === 'es') {
    switch (range) {
      case TimeRange.LAST_24H:
        startDate.setDate(today.getDate() - 1);
        return {
          dateStr: `entre ayer (${formatDate(startDate)}) y hoy (${formatDate(today)})`,
          strictInstruction: "EXCLUSIVAMENTE de las últimas 24 horas"
        };
      case TimeRange.LAST_3D:
        startDate.setDate(today.getDate() - 3);
        return {
          dateStr: `desde el ${formatDate(startDate)} hasta hoy`,
          strictInstruction: "EXCLUSIVAMENTE de los últimos 3 días"
        };
      case TimeRange.LAST_30D:
        startDate.setDate(today.getDate() - 30);
        return {
          dateStr: `durante el último mes (desde el ${formatDate(startDate)})`,
          strictInstruction: "del último mes"
        };
      case TimeRange.LAST_7D:
      default:
        startDate.setDate(today.getDate() - 7);
        return {
          dateStr: `entre el ${formatDate(startDate)} y el ${formatDate(today)}`,
          strictInstruction: "EXCLUSIVAMENTE de esta semana (últimos 7 días)"
        };
    }
  } else {
    // English logic
    switch (range) {
      case TimeRange.LAST_24H:
        startDate.setDate(today.getDate() - 1);
        return {
          dateStr: `between yesterday (${formatDate(startDate)}) and today (${formatDate(today)})`,
          strictInstruction: "EXCLUSIVATELY from the last 24 hours"
        };
      case TimeRange.LAST_3D:
        startDate.setDate(today.getDate() - 3);
        return {
          dateStr: `from ${formatDate(startDate)} until today`,
          strictInstruction: "EXCLUSIVELY from the last 3 days"
        };
      case TimeRange.LAST_30D:
        startDate.setDate(today.getDate() - 30);
        return {
          dateStr: `during the last month (since ${formatDate(startDate)})`,
          strictInstruction: "from the last month"
        };
      case TimeRange.LAST_7D:
      default:
        startDate.setDate(today.getDate() - 7);
        return {
          dateStr: `between ${formatDate(startDate)} and ${formatDate(today)}`,
          strictInstruction: "EXCLUSIVELY from this week (last 7 days)"
        };
    }
  }
};

export const fetchMarketAnalysis = async (country: Country, category: Category, timeRange: TimeRange, lang: Language): Promise<NewsItem[]> => {
  const countryName = getCountryName(country, lang);
  const { dateStr, strictInstruction } = getDateContext(timeRange, lang);
  const isEn = lang === 'en';
  
  // Dynamic prompt construction based on language
  const prompt = isEn 
    ? `
      Search for the top 8 most important news stories about "${category}" in ${countryName} published ${dateStr}.
      It is CRUCIAL that the news are ${strictInstruction}. Discard any old news or news outside this range.
      
      Analyze each news item and return ONLY a valid JSON Array. Do not use Markdown.
      Each object must have:
      - "id": a unique string.
      - "title": news title (in English).
      - "source": name of the source.
      - "summary": concise summary in English (max 15 words).
      - "sentiment": "positive" (opportunity/growth), "negative" (risk/drop), or "neutral".
      - "risk_score": integer number from 1 (very low risk) to 10 (crisis/high risk).
      - "url": link to the source if available in the context.

      Return ONLY the raw JSON Array.
    `
    : `
      Busca las 8 noticias más importantes sobre "${category}" en ${countryName} publicadas ${dateStr}.
      Es CRUCIAL que las noticias sean ${strictInstruction}. Descarta cualquier noticia antigua o fuera de este rango.
      
      Analiza cada noticia y genera un array JSON válido. No uses Markdown.
      Cada objeto debe tener:
      - "id": un string único.
      - "title": título de la noticia (en Español).
      - "source": nombre de la fuente.
      - "summary": resumen conciso en español (máx 15 palabras).
      - "sentiment": "positive" (oportunidad/crecimiento), "negative" (riesgo/caída), o "neutral".
      - "risk_score": número entero del 1 (muy bajo riesgo) al 10 (crisis/alto riesgo).
      - "url": enlace a la fuente si está disponible en el contexto.

      Retorna SOLAMENTE el JSON Array crudo.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.3,
      }
    });

    const textResponse = response.text;
    
    if (!textResponse) {
        throw new Error("No response from AI");
    }

    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const newsData: any[] = JSON.parse(cleanJson);
      
      return newsData.map((item, index) => ({
        id: item.id || `news-${index}`,
        title: item.title || (isEn ? "Untitled News" : "Noticia sin título"),
        summary: item.summary || (isEn ? "No summary available." : "Sin resumen disponible."),
        source: item.source || (isEn ? "Unknown Source" : "Fuente desconocida"),
        sentiment: validateSentiment(item.sentiment),
        risk_score: typeof item.risk_score === 'number' ? item.risk_score : 5,
        url: item.url || extractUrlFromGrounding(response, index)
      }));

    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", textResponse);
      throw new Error(isEn ? "Error processing market data." : "Error al procesar los datos del mercado.");
    }

  } catch (error) {
    console.error("MarketPulse API Error:", error);
    throw error;
  }
};

const validateSentiment = (val: string): Sentiment => {
  const v = val?.toLowerCase();
  if (v === 'positive' || v === 'negative') return v as Sentiment;
  return Sentiment.NEUTRAL;
};

const extractUrlFromGrounding = (response: any, index: number): string | undefined => {
    try {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > index) {
            return chunks[index].web?.uri;
        }
    } catch (e) {
        return undefined;
    }
    return undefined;
}