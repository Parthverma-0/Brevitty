// Server-side AI route — runs as a Vercel Serverless Function (Node runtime).
// The Gemini API key is read from process.env.GEMINI_API_KEY and NEVER leaves
// the server. The client calls THIS endpoint (/api/generate), never Google.
//
// ⚠️ SECURITY NOTE: The toolkit's login gate is a non-secure demo only. In
// production this route must sit behind real authentication. The in-memory
// rate limit below is best-effort cost protection (serverless instances are
// ephemeral, so counters reset on cold starts) — replace with a durable store
// (e.g. Upstash/Redis) before any real launch.

import { TOOL_PROMPTS } from './_lib/prompts.js'

const MODEL = 'gemini-2.5-flash'
const MAX_INPUT_CHARS = 4000
const MAX_OUTPUT_TOKENS = 1500
const TEMPERATURE = 0.7

// --- light per-IP rate limit: 6 requests / 60s, in-memory ---
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 6
const hits = new Map() // ip -> number[] (timestamps)

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  // opportunistic cleanup so the map doesn't grow unbounded
  if (hits.size > 5000) hits.clear()
  return false
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (rateLimited(clientIp(req))) {
    return res
      .status(429)
      .json({ error: 'Too many requests. Give it a minute and try again.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Add it to your environment.',
    })
  }

  // Body may arrive parsed (Vercel) or as a raw string — handle both.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' })
    }
  }
  const { toolId, input } = body || {}

  const systemPrompt = TOOL_PROMPTS[toolId]
  if (!systemPrompt) {
    return res.status(400).json({ error: 'Unknown tool.' })
  }

  const text = typeof input === 'string' ? input.trim() : ''
  if (!text) {
    return res.status(400).json({ error: 'Please describe your idea first.' })
  }
  if (text.length > MAX_INPUT_CHARS) {
    return res
      .status(400)
      .json({ error: `Keep it under ${MAX_INPUT_CHARS} characters.` })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
    const gemRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: TEMPERATURE,
        },
      }),
    })

    if (!gemRes.ok) {
      const detail = await gemRes.text().catch(() => '')
      console.error('Gemini error', gemRes.status, detail)
      return res
        .status(502)
        .json({ error: 'The AI service had a problem. Please try again.' })
    }

    const data = await gemRes.json()
    const markdown =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('')
        .trim() || ''

    if (!markdown) {
      return res
        .status(502)
        .json({ error: 'The AI returned an empty response. Try rephrasing.' })
    }

    return res.status(200).json({ markdown })
  } catch (err) {
    console.error('generate handler error', err)
    return res.status(500).json({ error: 'Something went wrong generating that.' })
  }
}
