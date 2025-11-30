# MarketPulse | AI Market Intelligence

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20Flash%202.5-orange)

**MarketPulse** es una plataforma de inteligencia de mercado en tiempo real. Utiliza Inteligencia Artificial Generativa (Google Gemini) y **Google Search Grounding** para buscar, analizar y clasificar noticias financieras y tecnológicas al instante, detectando oportunidades de inversión y riesgos operativos sin depender de bases de datos estáticas.

---

## Características Principales

-   **Análisis en Tiempo Real (Live Grounding):** No utiliza bases de datos de noticias antiguas. Conecta directamente con el índice de búsqueda de Google a través de Gemini para obtener la información más reciente (hasta los últimos minutos).
-   **Clasificación Inteligente:** Separa automáticamente las noticias en dos columnas claras:
    -   **Oportunidades:** Noticias con sentimiento positivo o neutral.
    -   **Riesgos:** Noticias con sentimiento negativo o alertas de crisis.
-   **Risk Scoring:** Asigna un puntaje de riesgo (1-10) a cada titular basándose en la gravedad del evento.
-   **Filtros Avanzados:**
    -   **Región:** Global, México, Estados Unidos, España, Argentina, Chile.
    -   **Sector:** Negocios, Tecnología, Finanzas, Cripto, Startups, Política, Economía.
    -   **Temporalidad:** Últimas 24h, 3 días, Semana actual, Mes actual.
-   **Diseño Minimalista:** Interfaz limpia optimizada para lectura rápida y toma de decisiones.

---

## Stack

-   **Frontend:** React 19, Tailwind CSS.
-   **Lenguaje:** TypeScript.
-   **Iconografía:** Lucide React.
-   **Inteligencia Artificial:** Google Gemini API (`gemini-2.5-flash`).
-   **Motor de Búsqueda:** Google Search Grounding (integrado en el SDK de Gemini).

---

## Prerrequisitos

Necesitas una API Key de Google Gemini (AI Studio).
**Nota:** Este proyecto utiliza la funcionalidad de "Search Grounding", por lo que no requiere una API Key de servicios de noticias externos.

## Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/marketpulse.git
    cd marketpulse
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y añade tu API Key de Gemini:

    ```env
    API_KEY=tu_api_key_de_google_gemini_aqui
    ```

    *Si usas Vercel, añade esta variable en Settings > Environment Variables.*

4.  **Ejecutar en Desarrollo**
    ```bash
    npm run dev
    ```

---

## Arquitectura de la Solución

El sistema sigue un flujo optimizado para velocidad y precisión:

1.  **User Input:** El usuario selecciona filtros (Ej: "Criptomonedas" en "Argentina" de las "Últimas 24 horas").
2.  **Prompt Engineering Dinámico:** El sistema construye un prompt complejo que incluye:
    -   Instrucciones de rol (Analista Financiero).
    -   Restricciones temporales estrictas calculadas dinámicamente.
    -   Solicitud de salida en formato JSON puro.
3.  **Single-Shot AI Call:** Se realiza **una única llamada** a la API de Gemini.
    -   La IA utiliza la herramienta `googleSearch` para buscar información actual en la web.
    -   Lee, resume, analiza el sentimiento y calcula el riesgo en memoria.
4.  **Parsing & Render:** El frontend recibe el JSON estructurado, valida los datos y renderiza las tarjetas de noticias.

---

## Licencia

Este proyecto está bajo la Licencia MIT.

