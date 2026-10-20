import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// In-memory cache for ultra-fast instant responses
const quickCache = new Map<string, { data: any; expiry: number }>();

function getCached(key: string) {
  const item = quickCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  return null;
}

function setCached(key: string, data: any, ttlMs: number = 30 * 60 * 1000) {
  quickCache.set(key, { data, expiry: Date.now() + ttlMs });
}

// Dynamic GoogleGenAI client resolver
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Prompt for Delhi Tour Guide: Engineered for speed, conciseness, and accuracy
const DELHI_GUIDE_SYSTEM_PROMPT = `You are "DelhiGuide AI", an expert personal tour concierge and licensed Delhi historian.
Respond rapidly, directly, and concisely. Keep answers crisp and structured with bullet points. Avoid preamble or fluff.
Highlight ticket prices in bold ₹INR, nearest metro stations/gates, and practical guidance.
Key facts:
- Red Fort: 9:30 AM-4:30 PM (Closed Mon), ₹50 Indian / ₹600 Foreigner, Lal Quila/Chandni Chowk Metro.
- Qutub Minar: Sunrise-9:00 PM, ₹50 Indian / ₹600 Foreigner, Qutab Minar Metro (Yellow Line).
- Humayun's Tomb: Sunrise-Sunset, ₹50 Indian / ₹600 Foreigner, JLN Stadium Metro (Violet Line Gate 2).
- India Gate: Open 24/7, Free, Central Secretariat Metro.
- Lotus Temple: 8:30 AM-5:00 PM (Closed Mon), Free, Kalkaji Mandir Metro.
- Jama Masjid: Open sunrise-sunset, Free entry (beware of touts charging entry).
- Delhi Metro: 5:30 AM - 11:30 PM, Tourist Cards: ₹200 (1-day) / ₹500 (3-day). First car is reserved for women.
- Auto Fare: ₹30 first 1.5km + ₹11/km thereafter. Night tariff +25% (11 PM - 5 AM). Always negotiate or use meter.`;

// Fast Content Generator helper (tries flash-lite for lowest latency, falls back to flash)
async function generateFastContent(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      ...params,
    });
  } catch {
    return await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      ...params,
    });
  }
}

// Fast Content Streamer helper
async function generateFastContentStream(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContentStream({
      model: 'gemini-3.1-flash-lite',
      ...params,
    });
  } catch {
    return await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      ...params,
    });
  }
}

// API: Real-Time Token Streaming Chat for Ultra-Fast Replies
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  const { message, history = [], vibe = 'all' } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set SSE streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const ai = getAI();

  if (ai) {
    try {
      const contents = [
        ...history.slice(-4).map((h: { role: string; content: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [
            {
              text: `[Traveler Style: ${vibe}]\nUser Question: ${message}\nAnswer concisely and directly in 3-5 bullet points.`,
            },
          ],
        },
      ];

      const stream = await generateFastContentStream(ai, {
        contents: contents as any,
        config: {
          systemInstruction: DELHI_GUIDE_SYSTEM_PROMPT,
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    } catch (err) {
      console.warn('Stream error, falling back to instant chunked response:', err);
    }
  }

  // Fast intelligent fallback streaming
  const fallback = getFastFallbackAnswer(message);
  // Send words smoothly in quick bursts for instant UI response
  const words = fallback.split(' ');
  for (let i = 0; i < words.length; i += 4) {
    const chunkText = words.slice(i, i + 4).join(' ') + ' ';
    res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
});

// Helper for fast instant answers
function getFastFallbackAnswer(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('auto') || lower.includes('fare') || lower.includes('taxi') || lower.includes('cost')) {
    return `**Delhi Auto Fare & Transit Guide** 🛺\n\n- **Legal Meter Rate**: ₹30 first 1.5 km + ₹11/km thereafter. Night hours (11 PM - 5 AM) add 25%.\n- **Quick Distance Estimates**: Connaught Place to India Gate is ~3.5 km (fair price ₹55–₹70). New Delhi Station to CP is ~1.5 km (₹30–₹40).\n- **Bargaining Tip**: Always insist: *"Bhaiya, meter se chaloge?"* If they refuse, negotiate or book an Uber Auto.\n- **Metro Alternative**: The Metro is faster, air-conditioned, and costs only ₹10–₹60.`;
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('chole') || lower.includes('butter chicken') || lower.includes('nihari')) {
    return `**Delhi Food Recommendations** 🍲\n\n- **Chole Bhature**: Sita Ram Diwan Chand (Paharganj, ~₹100) & Chache Di Hatti (Kamla Nagar, ~₹80).\n- **Butter Chicken**: Gulati on Pandara Road (~₹650 half, open till midnight) near India Gate.\n- **Old Delhi Mughlai**: Karim’s & Al Jawahar opposite Jama Masjid Gate 1 (Mutton Nihari ~₹340).\n- **Fair Price Rule**: Street dishes range from ₹50–₹120. AC restaurants range from ₹300–₹800.`;
  }
  if (lower.includes('red fort') || lower.includes('lal qila') || lower.includes('jama masjid')) {
    return `**Old Delhi Monument Guide** 🏛️\n\n- **Red Fort**: 9:30 AM–4:30 PM (Closed Mondays). Entry: ₹50 Indian / ₹600 Foreigner. Metro: Lal Quila (Violet Line Gate 4).\n- **Jama Masjid**: 10-minute walk from Red Fort. Mosque entry is 100% FREE. Never pay entry to touts.\n- **Travel Tip**: Book Red Fort tickets online at the official ASI portal to skip the ticket lines.`;
  }
  if (lower.includes('qutub') || lower.includes('minar')) {
    return `**Qutub Minar Complex** 🏛️\n\n- **Timings**: Sunrise to 9:00 PM (open all 7 days, illuminated after dark).\n- **Tickets**: ₹50 Indian / ₹600 Foreigner. Book online at ASI portal.\n- **Nearest Metro**: Qutab Minar station on the Yellow Line (Gate 2), then 3-min e-rickshaw (₹20 shared / ₹40 private).\n- **Must-See**: 1,600-year-old rust-resistant Iron Pillar of Delhi.`;
  }
  return `**Delhi Travel Guide** 🌟\n\n- **Monuments**: Book ASI tickets online (Red Fort, Qutub Minar, Humayun’s Tomb) for ₹50 Indian / ₹600 Foreigner to skip counter lines.\n- **Metro**: Operates 5:30 AM to 11:30 PM across all lines. 1-Day unlimited Tourist Pass is ₹200 at any station.\n- **Bargaining**: At Janpath and Sarojini Nagar, start counter-offers at 50% of the vendor's initial quote.`;
}

// API: Standard Chat (Optimized for Sub-Second Response)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], vibe = 'all' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cacheKey = `chat:${vibe}:${message.trim().toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ reply: cached });
    }

    const ai = getAI();

    if (ai) {
      try {
        const contents = [
          ...history.slice(-4).map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          {
            role: 'user',
            parts: [
              {
                text: `[Traveler Style: ${vibe}]\nUser Question: ${message}\nAnswer concisely and directly in 3-5 bullet points.`,
              },
            ],
          },
        ];

        const response = await generateFastContent(ai, {
          contents: contents as any,
          config: {
            systemInstruction: DELHI_GUIDE_SYSTEM_PROMPT,
            temperature: 0.3,
            maxOutputTokens: 450,
          },
        });

        if (response.text) {
          setCached(cacheKey, response.text);
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        console.warn('Gemini fast call fallback:', geminiError);
      }
    }

    const reply = getFastFallbackAnswer(message);
    setCached(cacheKey, reply);
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.json({
      reply: 'Welcome to Delhi! The Delhi Metro operates from 5:30 AM to 11:30 PM. How can I assist your visit today?',
    });
  }
});

// API: Monument Specific Interactive Q&A (Fast & Cached)
app.post('/api/monument-qa', async (req: Request, res: Response) => {
  try {
    const { monumentName, question } = req.body;
    if (!monumentName || !question) {
      return res.status(400).json({ error: 'monumentName and question are required' });
    }

    const cacheKey = `monument:${monumentName}:${question.trim().toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ answer: cached });
    }

    const ai = getAI();

    if (ai) {
      try {
        const prompt = `Concise Delhi Guide Q&A for "${monumentName}":
Question: "${question}"
Answer directly in 2-3 short bullet points (History/Architecture, exact Ticket prices, nearest Metro line & gate, and top advice).`;

        const response = await generateFastContent(ai, {
          contents: prompt,
          config: {
            systemInstruction: DELHI_GUIDE_SYSTEM_PROMPT,
            temperature: 0.3,
            maxOutputTokens: 350,
          },
        });

        if (response.text) {
          setCached(cacheKey, response.text);
          return res.json({ answer: response.text });
        }
      } catch (err) {
        console.warn('Monument QA Gemini fast fallback:', err);
      }
    }

    const answer = `At **${monumentName}**, entry tickets are available online via the official ASI portal (₹50 Indian / ₹600 Foreigners) to bypass physical lines. The site is easily accessible via the nearest Delhi Metro station with e-rickshaws available outside the gate.`;
    setCached(cacheKey, answer);
    res.json({ answer });
  } catch (error: any) {
    console.error('Monument QA error:', error);
    res.json({
      answer: `At **${req.body.monumentName || 'this site'}**, tickets are available online via the ASI portal. Most monuments are open from 9:00 AM to 5:00 PM.`,
    });
  }
});

// API: Fair Price & Scam Shield Checker (Fast & Cached)
app.post('/api/fair-price-check', async (req: Request, res: Response) => {
  try {
    const { itemOrService, quotedPrice, locationOrMarket } = req.body;
    if (!itemOrService) {
      return res.status(400).json({ error: 'itemOrService is required' });
    }

    const cacheKey = `price:${itemOrService}:${quotedPrice || 'none'}:${locationOrMarket || 'any'}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const ai = getAI();

    if (ai) {
      try {
        const prompt = `Evaluate Delhi price:
Item: "${itemOrService}"
Quote: "${quotedPrice || 'Not specified'}"
Market: "${locationOrMarket || 'General Delhi'}"

Return strict valid JSON:
{
  "verdict": "FAIR" | "SLIGHTLY_HIGH" | "SCAM_RIPOFF",
  "fairPriceMin": number,
  "fairPriceMax": number,
  "currency": "INR",
  "explanation": "Concise 1-sentence market rate explanation",
  "bargainingPhraseHindi": "Natural Hindi in Roman English (Hinglish)",
  "bargainingPhraseEnglish": "English translation",
  "insiderTip": "1 practical tip"
}`;

        const response = await generateFastContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 250,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          setCached(cacheKey, parsed);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Fair price fast fallback:', err);
      }
    }

    const numericQuote = quotedPrice ? parseInt(String(quotedPrice).replace(/\D/g, '')) : 0;
    const isHigh = numericQuote > 350;

    const fallbackData = {
      verdict: isHigh ? 'SLIGHTLY_HIGH' : 'FAIR',
      fairPriceMin: 80,
      fairPriceMax: 220,
      currency: 'INR',
      explanation: `For ${itemOrService} around ${locationOrMarket || 'Delhi'}, standard fair prices range between ₹80 and ₹220.`,
      bargainingPhraseHindi: 'Bhaiya thoda theek-theek lagaiye, sahi rate batao.',
      bargainingPhraseEnglish: 'Brother, please quote a fair and reasonable rate.',
      insiderTip: 'Start your counter-offer at 50% of the vendor’s initial quote in street bazaars.',
    };

    setCached(cacheKey, fallbackData);
    res.json(fallbackData);
  } catch (error: any) {
    console.error('Fair price error:', error);
    res.json({
      verdict: 'FAIR',
      fairPriceMin: 100,
      fairPriceMax: 250,
      explanation: 'Typical market rates in Delhi are reasonable when negotiated politely.',
      bargainingPhraseHindi: 'Bhaiya thoda theek lagao.',
      bargainingPhraseEnglish: 'Brother, please offer a fair price.',
    });
  }
});

// API: Language Translation & Local Slang Engine (Fast & Cached)
app.post('/api/translate', async (req: Request, res: Response) => {
  const text = req.body?.text || '';
  try {
    const { targetTone = 'polite' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cacheKey = `trans:${targetTone}:${text.trim().toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const ai = getAI();

    if (ai) {
      try {
        const prompt = `Translate to Hindi for Delhi traveler:
Input: "${text}"
Tone: ${targetTone}

Strict JSON:
{
  "hindiDevanagari": "Hindi script",
  "hindiPhonetic": "Hinglish romanized pronunciation",
  "delhiSlangAlternative": "Colloquial Delhi phrase",
  "englishMeaning": "${text}",
  "culturalTip": "Brief 1-sentence tip"
}`;

        const response = await generateFastContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 250,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          setCached(cacheKey, parsed);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Translate fast fallback:', err);
      }
    }

    const fallbackTrans = {
      hindiDevanagari: 'यह कितने का है?',
      hindiPhonetic: 'Yeh kitne ka hai?',
      delhiSlangAlternative: 'Bhaiya theek theek lagao, sahi batao.',
      englishMeaning: text,
      culturalTip: 'Address shopkeepers as "Bhaiya" (brother) for a respectful and friendly tone.',
    };
    setCached(cacheKey, fallbackTrans);
    res.json(fallbackTrans);
  } catch (error: any) {
    console.error('Translation error:', error);
    res.json({
      hindiDevanagari: 'नमस्ते, धन्यवाद',
      hindiPhonetic: 'Namaste, Dhanyawad',
      englishMeaning: text,
      culturalTip: 'A warm smile and polite greeting go a long way in Delhi.',
    });
  }
});

// API: Personalized Tour Itinerary Generator (Fast & Concise)
app.post('/api/personalize-itinerary', async (req: Request, res: Response) => {
  try {
    const { days = 1, vibe = 'Heritage & Food', pace = 'Balanced', budget = 'Moderate' } = req.body;

    const cacheKey = `itin:${days}:${vibe}:${pace}:${budget}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const ai = getAI();

    if (ai) {
      try {
        const prompt = `Create a fast, optimized Delhi tourist itinerary:
Days: ${days} (generate max ${days} days)
Vibe: ${vibe}
Pace: ${pace}
Budget: ${budget}

Strict JSON:
{
  "title": "Short title",
  "summary": "1-2 sentence overview",
  "transitAdvice": "1 sentence metro advice",
  "foodHighlight": "Top food recommendation",
  "days": [
    {
      "day": 1,
      "title": "Day Theme",
      "stops": [
        {
          "time": "09:00 AM",
          "place": "Monument Name",
          "metro": "Station (Line)",
          "fairCost": "₹ Cost",
          "highlight": "Key highlight",
          "foodNear": "Nearby food"
        }
      ]
    }
  ]
}`;

        const response = await generateFastContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          setCached(cacheKey, parsed);
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Personalize itinerary fast fallback:', err);
      }
    }

    const fallbackItin = {
      title: `${days}-Day Curated Delhi Tour`,
      summary: `Tailored for ${vibe} at a ${pace} pace with seamless Delhi Metro connections.`,
      transitAdvice: 'Get a 1-day (₹200) or 3-day (₹500) unlimited Delhi Metro Tourist Card.',
      foodHighlight: 'Sita Ram Diwan Chand Chole Bhature (~₹100) and Karim’s Mutton Nihari (~₹340).',
      days: [
        {
          day: 1,
          title: 'Old Delhi Heritage & Mughal Splendors',
          stops: [
            {
              time: '09:00 AM',
              place: 'Red Fort (Lal Qila)',
              metro: 'Lal Quila (Violet Line Gate 4)',
              fairCost: '₹50 Indian / ₹600 Foreigner',
              highlight: 'Lahori Gate & Diwan-i-Khas marble pavilion',
              foodNear: 'Old Famous Jalebi Wala (~₹80)',
            },
            {
              time: '01:30 PM',
              place: 'Humayun’s Tomb',
              metro: 'JLN Stadium (Violet Line Gate 2)',
              fairCost: '₹50 entry ticket',
              highlight: 'Persian garden tomb precursor to the Taj Mahal',
              foodNear: 'Gulati Butter Chicken on Pandara Road (~₹650)',
            },
            {
              time: '06:00 PM',
              place: 'India Gate & Kartavya Path',
              metro: 'Central Secretariat (Yellow/Violet Line)',
              fairCost: 'Free Public Memorial',
              highlight: 'Evening illuminated fountains and ceremonial avenue',
              foodNear: 'Matka Kulfi along Kartavya Path (~₹60)',
            },
          ],
        },
      ],
    };

    setCached(cacheKey, fallbackItin);
    res.json(fallbackItin);
  } catch (error: any) {
    console.error('Personalize itinerary error:', error);
    res.json({
      title: 'Delhi Highlights Tour',
      summary: 'Explore key landmarks of Delhi with convenient Metro connections.',
      days: [],
    });
  }
});

// API: Weather Proxy (Open-Meteo for New Delhi)
app.get('/api/weather', async (_req: Request, res: Response) => {
  try {
    const cachedWeather = getCached('weather:delhi');
    if (cachedWeather) {
      return res.json(cachedWeather);
    }

    const weatherUrl =
      'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata';
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    setCached('weather:delhi', data, 15 * 60 * 1000); // 15 min cache
    res.json(data);
  } catch (error: any) {
    console.warn('Weather fetch fallback:', error);
    res.json({
      current: {
        temperature_2m: 29.5,
        apparent_temperature: 31.0,
        relative_humidity_2m: 48,
        wind_speed_10m: 11.2,
        weather_code: 1,
        is_day: 1,
      },
      daily: {
        time: ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'],
        weather_code: [1, 1, 2, 0, 1],
        temperature_2m_max: [31, 32, 30, 29, 31],
        temperature_2m_min: [20, 21, 19, 18, 20],
      },
    });
  }
});

// Vite middleware or static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DelhiGuide AI server running at http://localhost:${port}`);
  });
}

setupApp();
