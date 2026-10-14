import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const server = http.createServer(app);

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// TTS Endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, speaker = 'Kore', style = 'Friendly, warm, enthusiastic Egyptian Arabic teacher for 5 year old kid' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server',
        fallback: true,
      });
      return;
    }

    // gemini-3.8-flash-tts provides high-fidelity speech synthesis
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: speaker }, // Kore, Puck, Zephyr, Fenrir
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (part: any) => part.inlineData && part.inlineData.data
    );

    if (audioPart && audioPart.inlineData?.data) {
      res.json({
        audioBase64: audioPart.inlineData.data,
        mimeType: audioPart.inlineData.mimeType || 'audio/wav',
        text: text,
      });
      return;
    }

    res.status(502).json({ error: 'No audio returned from Gemini TTS', fallback: true });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate speech',
      fallback: true,
    });
  }
});

// Search Grounding endpoint using gemini-3.8-flash with googleSearch tool
app.post('/api/prayer-grounding', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const prompt = `أنت معلم تربوي وديني للأطفال الصغار (5 سنوات) وأولياء أمورهم. أجب بأسلوب شيق، لطيف، وبسيط جداً باللهجة المصرية المحببة أو العربية المبسطة السهلة.
استخدم نتائج البحث لتأكيد المعلومات الصحيحة عن الصلاة، أركانها، سننها، أو نصائح غرس حب الصلاة في قلوب الأطفال.
السؤال هو: ${query}

قدّم الإجابة في فقرة لطيفة للأطفال أو نصيحة ذهبية للوالدين، مع ذكر معلومات موثوقة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract text & search grounding chunks
    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مصدر موثوق',
      url: chunk.web?.uri || '',
    })).filter((s: any) => s.url) || [];

    res.json({
      answer: text,
      sources: sources,
      webSearchQueries: groundingMetadata?.webSearchQueries || [],
    });
  } catch (error: any) {
    console.error('Error in /api/prayer-grounding:', error);
    res.status(500).json({ error: error?.message || 'Failed to search grounding' });
  }
});

// Interactive prayer assistant generation (quick tips/stories in colloquial Egyptian)
app.post('/api/prayer-story', async (req: Request, res: Response): Promise<void> => {
  try {
    const { stepId, character = 'أحمد' } = req.body;
    if (!ai) {
      res.status(503).json({ error: 'API key not configured' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `أنت راوي قصص أطفال مصري ودود. اكتب نصيحة سريعة ومشجعة جداً لطفل عمره 5 سنوات اسمه "${character}" عن خطوة الصلاة: "${stepId}".
استخدم اللهجة المصرية اللطيفة البسيطة (زي: يا بطل، شاطر أوي، بنحب ربنا، نور في قلبك)، في جملتين قصيرتين فقط مناسبة لطفل 5 سنين ليسمعها ويفرح.`,
    });

    res.json({ story: response.text || '' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Set up WebSocket server for Gemini Live API (gemini-3.8-live)
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live API WebSocket');

  if (!ai) {
    clientWs.send(
      JSON.stringify({
        error: 'GEMINI_API_KEY is not configured on the server.',
      })
    );
    clientWs.close();
    return;
  }

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck has a playful, friendly kid tone
          },
        },
        systemInstruction: `أنت "سمسم"، رفيق الصلاة الذكي والصديق الكرتوني المحبوب لطفل عمره 5 سنوات.
تتحدث باللهجة المصرية العامية البسيطة والودودة والمشجعة جداً للأطفال الصغار ("يا بطل"، "يا سكرة"، "يا شطور").
مهمتك:
1. تشجيع الطفل بحماس على الصلاة والوضوء.
2. الإجابة عن أي سؤال بسيط يسأله الطفل بصوت طفولي لطيف (مثلاً: ركوع إيه؟ ليه بنتوضى؟ كم ركعة الظهر؟).
3. اجعل كل إجاباتك قصيرة جداً (جملة أو جملتين)، واضحة ومبهجة، مناسبة لتركيز طفل عمره 5 سنوات.`,
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio =
            message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live session error:', err);
          clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
        },
        onclose: () => {
          console.log('Gemini Live session closed');
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Failed to parse client message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from Live API WebSocket');
      if (session && typeof session.close === 'function') {
        session.close();
      }
    });
  } catch (error: any) {
    console.error('Failed to connect to Gemini Live:', error);
    clientWs.send(
      JSON.stringify({
        error: 'Failed to establish Live session: ' + error.message,
      })
    );
    clientWs.close();
  }
});

// Setup Vite in development or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
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

  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Prayer Learning Video & App server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
