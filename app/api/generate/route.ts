import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '') {
    return new Response(
      'Missing GEMINI_API_KEY – make sure to add it to your .env file.',
      {
        status: 400,
      }
    );
  }

  // Rate limiting logic (unchanged)
  if (
    process.env.NODE_ENV != 'development' &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get('x-forwarded-for');
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, '1 d'),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `noteblock_ratelimit_${ip}`
    );

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  }

  let { prompt } = await req.json();

  // Create a new GenerativeModel instance
  const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Prepare the chat session
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "You are an AI writing assistant that continues existing text based on context from prior text. Give more weight/priority to the later characters than the beginning ones. Limit your response to no more than 200 characters, but make sure to construct complete sentences." }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'll act as an AI writing assistant, continuing text based on the given context, prioritizing recent content, and limiting responses to 200 characters while ensuring complete sentences." }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 200,
    },
  });

  // Use server-sent events for streaming
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send the prompt to the model and stream the response
  chat.sendMessageStream([{ text: prompt }])
    .then(async (result) => {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        await writer.write(new TextEncoder().encode(chunkText));
      }
    })
    .catch((error) => {
      console.error('Error in Gemini API call:', error);
    })
    .finally(() => {
      writer.close();
    });

  return new StreamingTextResponse(stream.readable);
}