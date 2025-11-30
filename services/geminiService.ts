import { GoogleGenAI } from "@google/genai";
import { NewsItem, MarketResponse, Country, Category, Sentiment, TimeRange, Language, SearchMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (lang: Language) => {
  return lang === 'es' 
    ? `Eres un Consultor Financiero Senior y Estratega de Mercado de clase mundial. 
       Tu objetivo es proporcionar análisis profundos, matizados y procesables. 
       No solo reportes noticias; conecta puntos, considera datos históricos, volatilidad, contexto geopolítico y factores macroeconómicos locales.
       Tu tono es profesional, experto y directo.`
    : `You are a world-class Senior Financial Consultant and Market Strategist.
       Your goal is to provide deep, nuanced, and actionable analysis.
       Do not just report news; connect dots, consider historical data, volatility, geopolitical context, and local macroeconomic factors.
       Your tone is professional, expert, and direct.`;
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

export const fetchMarketAnalysis = async (
  country: Country, 
  category: Category, 
  timeRange: TimeRange, 
  lang: Language,
  mode: SearchMode,
  customQuery?: string
): Promise<MarketResponse> => {
  const countryName = getCountryName(country, lang);
  const { dateStr, strictInstruction } = getDateContext(timeRange, lang);
  const isEn = lang === 'en';
  
  let searchTask = "";
  let analysisInstruction = "";

  if (mode === 'custom' && customQuery && customQuery.trim() !== "") {
    // Custom Mode Prompt Construction
    searchTask = isEn 
      ? `The user has a specific investment/business goal: "${customQuery}".
         FIRST, infer the best search terms to find news that would positively or negatively affect this goal.
         THEN, search for the top 8 most important news stories related to those terms published ${dateStr}.`
      : `El usuario tiene un objetivo de inversión/negocio específico: "${customQuery}".
         PRIMERO, infiere los mejores términos de búsqueda para encontrar noticias que afectarían positiva o negativamente este objetivo.
         LUEGO, busca las 8 noticias más importantes relacionadas con esos términos publicadas ${dateStr}.`;
         
    analysisInstruction = isEn
      ? `Provide a "Strategic Executive Analysis" (approx 100-150 words).
         As an expert, you MUST include:
         1. Current market sentiment regarding the query.
         2. Relevant historical context (e.g., "Unlike the 2008 crash..." or "Following the historical trend of S&P...").
         3. Specific local/geopolitical factors (e.g., "The upcoming elections in [Country]...", "New regulations in [Region]...").
         4. Impact of external/internal factors (currency exchange, commodities, policies).
         Write this analysis as if you are advising a high-net-worth client.`
      : `Proporciona un "Análisis Ejecutivo Estratégico" (aprox 100-150 palabras).
         Como experto, DEBES incluir:
         1. Sentimiento actual del mercado respecto a la consulta.
         2. Contexto histórico relevante (ej: "A diferencia de la caída de 2008..." o "Siguiendo la tendencia histórica del S&P...").
         3. Factores locales/geopolíticos específicos (ej: "Las próximas elecciones en [País]...", "Nuevas regulaciones en [Región]...").
         4. Impacto de factores externos/internos (tipo de cambio, commodities, políticas).
         Escribe este análisis como si estuvieras asesorando a un cliente de alto patrimonio.`;
  } else {
    // Standard Mode Prompt Construction
    searchTask = isEn 
      ? `Search for the top 8 most important news stories about "${category}" in ${countryName} published ${dateStr}.`
      : `Busca las 8 noticias más importantes sobre "${category}" en ${countryName} publicadas ${dateStr}.`;
      
    analysisInstruction = isEn
        ? `Provide a general "Market Outlook" (approx 80 words) summarizing the key trends observed in these news items for the selected region and topic.`
        : `Proporciona una "Perspectiva de Mercado" general (aprox 80 palabras) resumiendo las tendencias clave observadas en estas noticias para la región y tema seleccionados.`;
  }
  
  const prompt = isEn 
    ? `
      ${searchTask}
      It is CRUCIAL that the news are ${strictInstruction}. Discard any old news or news outside this range.
      
      ${analysisInstruction}
      
      Finally, structure the response as a single valid JSON object with two keys:
      1. "analysis": The expert text generated above.
      2. "items": An array of news objects.
      
      Each news object must have:
      - "id": a unique string.
      - "title": news title (in English).
      - "source": name of the source.
      - "summary": concise summary in English (max 15 words) focusing on impact.
      - "sentiment": "positive" (opportunity/growth), "negative" (risk/drop), or "neutral".
      - "risk_score": integer number from 1 (very low risk) to 10 (crisis/high risk).
      - "url": link to the source if available in the context.

      Return ONLY the raw JSON Object.
    `
    : `
      ${searchTask}
      Es CRUCIAL que las noticias sean ${strictInstruction}. Descarta cualquier noticia antigua o fuera de este rango.
      
      ${analysisInstruction}
      
      Finalmente, estructura la respuesta como un único objeto JSON válido con dos claves:
      1. "analysis": El texto del análisis experto generado arriba.
      2. "items": Un array de objetos de noticias.
      
      Cada objeto de noticia debe tener:
      - "id": un string único.
      - "title": título de la noticia (en Español).
      - "source": nombre de la fuente.
      - "summary": resumen conciso en español (máx 15 palabras) enfocado en el impacto.
      - "sentiment": "positive" (oportunidad/crecimiento), "negative" (riesgo/caída), o "neutral".
      - "risk_score": número entero del 1 (muy bajo riesgo) al 10 (crisis/alto riesgo).
      - "url": enlace a la fuente si está disponible en el contexto.

      Retorna SOLAMENTE el objeto JSON crudo.
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
      const parsedData = JSON.parse(cleanJson);
      
      // Handle both old array format (fallback) and new object format
      let items: any[] = [];
      let analysisText = "";

      if (Array.isArray(parsedData)) {
          items = parsedData;
          analysisText = isEn ? "Analysis not available." : "Análisis no disponible.";
      } else {
          items = parsedData.items || [];
          analysisText = parsedData.analysis || "";
      }
      
      const mappedItems = items.map((item, index) => ({
        id: item.id || `news-${index}`,
        title: item.title || (isEn ? "Untitled News" : "Noticia sin título"),
        summary: item.summary || (isEn ? "No summary available." : "Sin resumen disponible."),
        source: item.source || (isEn ? "Unknown Source" : "Fuente desconocida"),
        sentiment: validateSentiment(item.sentiment),
        risk_score: typeof item.risk_score === 'number' ? item.risk_score : 5,
        url: item.url || extractUrlFromGrounding(response, index)
      }));

      return {
          analysis: analysisText,
          items: mappedItems
      };

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