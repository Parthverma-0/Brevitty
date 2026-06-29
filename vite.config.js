import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev-only bridge: the Vite dev server (port 5173) does NOT run the Vercel
// serverless functions in /api. This plugin mounts api/generate.js as Connect
// middleware during `npm run dev`, adapting Vercel's (req,res) handler to
// Node's raw req/res so the toolkit works locally — identical behaviour to
// production, where Vercel runs the same file. Does nothing in the build.
function devApi() {
  return {
    name: 'dev-api-generate',
    apply: 'serve',
    configureServer(server) {
      // Load .env / .env.local into process.env so the handler can read
      // GEMINI_API_KEY (Vite doesn't expose non-VITE_ vars by default).
      const env = loadEnv(server.config.mode, process.cwd(), '')
      if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
      }

      server.middlewares.use('/api/generate', async (req, res) => {
        try {
          // collect the raw request body
          const chunks = []
          for await (const c of req) chunks.push(c)
          const raw = Buffer.concat(chunks).toString('utf8')
          req.body = raw ? JSON.parse(raw) : {}

          // adapt Node res -> the subset of the Vercel res API the handler uses
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(obj))
            return res
          }

          const { default: handler } = await import('./api/generate.js')
          await handler(req, res)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[dev-api] error', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error. See terminal.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
})
