import { GoogleGenAI } from "@google/genai";
import { NewsItem, Country, Category, Sentiment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres un analista financiero senior de "MarketPulse". Tu trabajo es identificar riesgos y oportunidades en el mercado basándote en noticias recientes.
Analiza con objetividad y brevedad.
`;

const getCountryName = (code: Country): string => {
  switch (code) {
    case Country.MX: return "México";
    case Country.US: return "Estados Unidos";
    case Country.ES: return "España";
    case Country.AR: return "Argentina";
    case Country.INT: return "el mundo (enfoque internacional)";
    default: return "el mundo";
  }
};

export const fetchMarketAnalysis = async (country: Country, category: Category): Promise<NewsItem[]> => {
  const countryName = getCountryName(country);
  
  // Prompt engineered for batch processing and structured JSON output using Google Search Grounding
  const prompt = `
    Busca las 8 noticias más importantes y recientes sobre "${category}" en ${countryName} hoy.
    
    Analiza cada noticia y genera un array JSON válido. No uses Markdown.
    Cada objeto debe tener:
    - "id": un string único.
    - "title": título de la noticia.
    - "source": nombre de la fuente (ej. Bloomberg, El Financiero).
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
        tools: [{ googleSearch: {} }], // Using Grounding instead of NewsAPI to bypass CORS and get analysis in one shot
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for consistent JSON
      }
    });

    const textResponse = response.text;
    
    if (!textResponse) {
        throw new Error("No response from AI");
    }

    // Clean up potential markdown code blocks if the model adds them despite instructions
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const newsData: any[] = JSON.parse(cleanJson);
      
      // Validate and map to ensure type safety
      return newsData.map((item, index) => ({
        id: item.id || `news-${index}`,
        title: item.title || "Noticia sin título",
        summary: item.summary || "Sin resumen disponible.",
        source: item.source || "Fuente desconocida",
        sentiment: validateSentiment(item.sentiment),
        risk_score: typeof item.risk_score === 'number' ? item.risk_score : 5,
        url: item.url || extractUrlFromGrounding(response, index) // Fallback to try and get URL from grounding chunks if JSON is missing it
      }));

    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", textResponse);
      throw new Error("Error al procesar los datos del mercado.");
    }

  } catch (error) {
    console.error("MarketPulse API Error:", error);
    throw error;
  }
};

// Helper to sanitize sentiment
const validateSentiment = (val: string): Sentiment => {
  const v = val?.toLowerCase();
  if (v === 'positive' || v === 'negative') return v as Sentiment;
  return Sentiment.NEUTRAL;
};

// Helper to try and extract URLs from grounding metadata if the model didn't put them in the JSON
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
