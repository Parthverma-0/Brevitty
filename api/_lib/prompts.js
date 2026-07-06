// ⚠️ SERVER-SIDE ONLY. System prompts and model config must never be imported
// into client code. The route handler (api/generate.js) is the only consumer.
//
// Tool IDs and builder flags come from src/data/junctionTools.js (single source
// of truth). Prompt bodies load from api/_lib/skills/<id>.md (synced from Skills/).

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  BUILDER_TOOL_IDS,
  SKILL_TOOL_IDS,
  TOOL_IDS as JUNCTION_TOOL_IDS,
} from '../../src/data/junctionTools.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = path.join(__dirname, 'skills')

const SHARED_STYLE = `
Format every response in clean Markdown only — no preamble like "Sure" or "Here is".
Use ## and ### headings, short paragraphs, and "-" bullets. Use Markdown tables where
structured data helps. Be concrete and specific to the founder's input; never generic.
Write for an ambitious but early student founder: direct, honest, encouraging, jargon-free.
If the input is too thin to work with, say what single detail would unlock a better answer.
`

// Startup Junction runs a one-shot Markdown API — adapt file-generating skills.
const PORTAL_ADAPTERS = {
  'deck-builder': `
## Portal delivery mode (Startup Junction)
You are running inside Startup Junction's web toolkit. You cannot execute code or attach files.
Deliver the full pitch deck as clean Markdown: use ### headings per slide with tight slide copy
(bullets, not instructions). Follow the skill's structure, design rigor, and tone — output the
actual deck content an investor would see. Mark estimated numbers with "(est.)".
`,
  'financial-model-builder': `
## Portal delivery mode (Startup Junction)
You are running inside Startup Junction's web toolkit. You cannot execute code or attach files.
Deliver the financial model as clean Markdown: assumptions, monthly or quarterly projection
tables, unit economics, path to break-even, valuation headline numbers, and the one assumption
most worth pressure-testing. State assumptions clearly; mark estimates with "(est.)".
Follow the skill's rigor and tone — give numbers a founder can defend live, not a file attachment.
`,
}

function loadSkillPrompt(toolId) {
  const filePath = path.join(SKILLS_DIR, `${toolId}.md`)
  if (!fs.existsSync(filePath)) return null
  const body = fs.readFileSync(filePath, 'utf8').trim()
  const adapter = PORTAL_ADAPTERS[toolId] || ''
  return `${adapter}${body}\n${SHARED_STYLE}`.trim()
}

const TOOL_PROMPTS = {}

for (const toolId of JUNCTION_TOOL_IDS) {
  const skillPrompt = loadSkillPrompt(toolId)
  if (skillPrompt) TOOL_PROMPTS[toolId] = skillPrompt
}

export { TOOL_PROMPTS, BUILDER_TOOL_IDS, SKILL_TOOL_IDS }
export const TOOL_IDS = Object.keys(TOOL_PROMPTS)
