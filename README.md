MarketPulse AI

Real-Time Market Intelligence powered by AI.

MarketPulse is a full-stack web application that monitors global financial and technological news, utilizes Artificial Intelligence to analyze market sentiment, and presents risks and opportunities in a minimalist interface.

Key Features

Real-Time News Aggregation: Direct connection with NewsAPI to fetch breaking news headlines.

AI Sentiment Analysis: Integration with Google Gemini (Flash Model) to analyze news batches in real-time.

Anti-Timeout Architecture: Batch Processing system designed to comply with Vercel Serverless 10-second execution limits.

Global Filters: Ability to filter news by specific markets (US, Mexico, Spain, Argentina) or an International view.

Minimalist UI: Clean interface inspired by the Cal.com aesthetic, focused on readability and quick decision-making.

Tech Stack

Frontend

Framework: Next.js 14 (App Router)

Styling: Tailwind CSS

Icons: Lucide React

Language: TypeScript / React

Backend (Serverless)

Runtime: Python 3.9+

Framework: Flask (adapted for Vercel Serverless Functions)

AI Engine: Google Generative AI (Gemini API)

Scraping/Data: NewsAPI, Requests

Installation and Local Execution

Follow these steps to run the project on your machine:

1. Prerequisites

Node.js 18+ installed.

Python 3.9+ installed.

Active accounts (Free tier) on:

Google AI Studio (for Gemini API Key).

NewsAPI (for News API Key).

2. Clone the repository

3. Configure Environment Variables

Create a .env file in the root of the project and add your keys:

# .env
NEWS_API_KEY="your_newsapi_key_here"
GEMINI_API_KEY="your_google_key_here"

4. Install Dependencies

Frontend (Terminal 1):

npm install


Backend (Terminal 2):
It is recommended to create a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

License

MIT