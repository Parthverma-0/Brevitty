// Client-safe tool metadata for Startup Junction 2026.
// Each tool maps to a real skill in Skills/*.skill (loaded server-side from
// api/_lib/skills/<id>.md via api/_lib/prompts.js).
//
// `kind` drives the tag chip: 'advisory' => "instant answer",
// 'builder' => "generates a deliverable".

export const TOOLS = [
  {
    id: 'idea-validator',
    skillId: 'idea-validation-new',
    num: '01',
    name: 'Idea Validator',
    tagline: 'Painkiller or vitamin? Find out before you build.',
    kind: 'advisory',
    chips: ['Your idea in one line', 'Target customer (be specific)', 'Their current workaround', 'Where you’d find 10 of them'],
    tips: [
      'Name one person in one situation — not “small businesses”.',
      'Describe past behaviour, not hypothetical frustration.',
      'Compliments aren’t validation — pre-orders and workarounds are.',
    ],
    example:
      'Idea: weekly healthy meal kits for busy parents in Jaipur. Customer: working parents with kids under 10 who currently order Swiggy 4–5 nights/week or skip dinner prep entirely. I can reach them through my mom’s school WhatsApp groups and two apartment society groups.',
  },
  {
    id: 'competitor-analysis',
    skillId: 'competitor-analysis-new',
    num: '02',
    name: 'Competitor Analysis',
    tagline: 'Your real rival is what customers do today.',
    kind: 'advisory',
    chips: ['What you’re building', 'Who it’s for', 'What they do today', 'Your hunch on the gap'],
    tips: [
      '“We have no competition” is almost always wrong — name the workaround.',
      'Spreadsheets, interns, and “do nothing” count as competitors.',
      'One defensible wedge beats a list of vague differentiators.',
    ],
    example:
      'A booking platform for amateur sports grounds (turf cricket, badminton) in tier-2 cities. Customers: weekend players and college teams. Today they book by calling the owner or DMing on Instagram — discovery and instant confirmation is the gap.',
  },
  {
    id: 'gtm-generator',
    skillId: 'gtm-generator-new',
    num: '03',
    name: 'GTM Generator',
    tagline: 'The fastest path to your first 10 customers.',
    kind: 'advisory',
    chips: ['Product + value prop', 'Target customer (ICP)', 'Stage you’re at', 'Revenue model'],
    tips: [
      'Manually find 10 people who already need this — don’t automate first.',
      'Name specific communities, not “social media”.',
      'Charge something (even ₹1) — free users give fake feedback.',
    ],
    example:
      'Notion-based NEET study planner, ₹499 one-time. ICP: Class 11–12 science students preparing for NEET who currently use random PDFs and YouTube. Stage: no product yet, 400 Instagram followers. Revenue: one-time purchase.',
  },
  {
    id: 'mvp-blueprint',
    skillId: 'idea-implementation-new',
    num: '04',
    name: 'MVP Blueprint',
    tagline: 'Build the smallest thing that tests your riskiest assumption.',
    kind: 'advisory',
    chips: ['Your idea + core assumption', 'Technical ability', 'Budget (even ₹0)', '2-week deadline'],
    tips: [
      'Cut until only the assumption-testing core remains.',
      'If a human can do it behind the scenes, fake it (Wizard of Oz).',
      'If it can’t ship in 14 days, cut scope — don’t extend the timeline.',
    ],
    example:
      'Campus volunteer–NGO matching platform. Core assumption: students will apply if they can find a verified opportunity in under 2 minutes. I know Figma and basic React. Budget ~₹5,000 for hosting. Need a testable MVP in 2 weeks.',
  },
  {
    id: 'deck-builder',
    skillId: 'deck-builder-new',
    num: '05',
    name: 'Deck Builder',
    tagline: 'A full investor pitch deck, slide by slide.',
    kind: 'builder',
    chips: ['Problem & solution', 'Market & business model', 'Traction (any size)', 'Team & the ask'],
    tips: [
      'Give raw facts — honest small numbers beat invented big ones.',
      'Lead with the problem and why now, not the product tour.',
      'Paste notes from your other toolkit results if you have them.',
    ],
    example:
      'Re-Loop — campus marketplace for reselling textbooks and hostel gear. Problem: students lose money on random WhatsApp groups. Solution: verified listings + in-app chat. Model: 5% fee. Traction: 1 campus, ₹60k GMV in 2 months. Team: 3 final-year students. Ask: ₹25L to expand to 10 campuses.',
  },
  {
    id: 'financial-model-builder',
    skillId: 'financial-model-new',
    num: '06',
    name: 'Financial Model Builder',
    tagline: 'Investor-grade projections you can defend live.',
    kind: 'builder',
    chips: ['Pricing & revenue model', 'Cost to acquire one customer', 'Growth rate (monthly)', 'Fixed monthly costs'],
    tips: [
      'Estimates are fine — label every assumption clearly.',
      'Unit economics matter more than a giant TAM slide.',
      'Name the one number the whole model hinges on.',
    ],
    example:
      'SaaS for small gyms in India — ₹1,500/month per gym. CAC ~₹2,000 via Meta ads. Target: 15 new gyms/month. Fixed costs ~₹50,000/month (hosting + part-time dev). Raising ₹40L. Want 12-month projections, break-even, and headline valuation numbers.',
  },
]

export const TAG_LABEL = {
  advisory: 'instant answer',
  builder: 'generates a deliverable',
}

export const SKILL_TOOL_IDS = TOOLS.filter((t) => t.skillId).map((t) => t.id)

export const BUILDER_TOOL_IDS = new Set(
  TOOLS.filter((t) => t.kind === 'builder').map((t) => t.id)
)

export const TOOL_IDS = TOOLS.map((t) => t.id)

export const getTool = (id) => TOOLS.find((t) => t.id === id)
