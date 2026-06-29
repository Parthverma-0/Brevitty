// Client-safe tool metadata for Startup Junction 2026.
// NOTE: system prompts, model config, and the API key live ONLY server-side
// (api/_lib/prompts.js + api/generate.js). Nothing here ships secrets.
//
// `kind` drives the tag chip: 'advisory' => "instant answer",
// 'builder' => "generates a file".

export const TOOLS = [
  {
    id: 'problem-identifier',
    num: '01',
    name: 'Problem Identifier',
    tagline: 'Find a problem worth solving.',
    kind: 'advisory',
    chips: ['Who you want to help', 'A space you care about', 'Frustrations you’ve noticed', 'Your unfair insight'],
    tips: [
      'Start from people, not products.',
      'Describe a moment something broke for someone.',
      'Niche beats broad — narrow the audience hard.',
    ],
    example:
      'I’m a final-year design student in Jaipur. I keep noticing that small local boutiques struggle to photograph their products for Instagram — they can’t afford a studio and their phone shots look flat, so their online sales stay low.',
  },
  {
    id: 'idea-evaluator',
    num: '02',
    name: 'Idea Evaluator',
    tagline: 'Pressure-test your idea in minutes.',
    kind: 'advisory',
    chips: ['The idea in one line', 'Who it’s for', 'How it makes money', 'Why now'],
    tips: [
      'Be honest about the weakest part — that’s what we’ll stress.',
      'One clear sentence beats a paragraph of buzzwords.',
      'Say what already exists and why yours is different.',
    ],
    example:
      'An app that lets college students in India split and track shared expenses for trips and flats, then settle up via UPI. Free to use, we take a tiny fee on instant settlements. Why now: UPI is everywhere and Gen-Z hates awkward money chats.',
  },
  {
    id: 'idea-validator',
    num: '03',
    name: 'Idea Validator',
    tagline: 'Plan how to prove demand — fast and cheap.',
    kind: 'advisory',
    chips: ['Your core assumption', 'Who the user is', 'How you’d reach 10 of them', 'What “yes” looks like'],
    tips: [
      'Validate demand before you build anything.',
      'Talking to 10 real users beats a perfect plan.',
      'Decide your kill criteria up front.',
    ],
    example:
      'I believe busy parents would pay ₹299/month for healthy, ready-to-cook kids’ meal kits delivered weekly. I can reach parents through my mom’s WhatsApp groups and a couple of local schools.',
  },
  {
    id: 'competitor-analysis',
    num: '04',
    name: 'Competitor Analysis',
    tagline: 'See the field before you enter it.',
    kind: 'advisory',
    chips: ['What you’re building', 'Who it’s for', 'Alternatives people use today', 'Your hunch on the gap'],
    tips: [
      'Your real competitor is often “do nothing” or a spreadsheet.',
      'Look for the gap nobody serves well.',
      'Find the one angle you can own.',
    ],
    example:
      'A booking platform for amateur sports grounds (turf cricket, badminton courts) in tier-2 cities. Right now people book by calling the owner or messaging on Instagram. I think discovery and instant booking is the gap.',
  },
  {
    id: 'gtm-generator',
    num: '05',
    name: 'GTM Generator',
    tagline: 'A go-to-market plan you can actually run.',
    kind: 'builder',
    chips: ['Product + value prop', 'Target audience', 'Budget (even ₹0)', 'Channels you already have'],
    tips: [
      'Pick one beachhead audience to win first.',
      'Free channels you already have beat paid ones you don’t.',
      'Plan the first 30 days, not the first year.',
    ],
    example:
      'A Notion-based study planner for NEET aspirants, ₹499 one-time. Audience: Class 11–12 science students. Budget ₹2,000. I have an Instagram page with 1,800 followers and a small Telegram group.',
  },
  {
    id: 'mvp-blueprint',
    num: '06',
    name: 'MVP Blueprint',
    tagline: 'Scope the smallest thing worth building.',
    kind: 'builder',
    chips: ['The core value', 'The main user action', 'Tools/skills you have', 'Your deadline'],
    tips: [
      'Build the one feature that proves the value.',
      'No-code is a feature, not a cop-out.',
      'List what you’re NOT building yet.',
    ],
    example:
      'A platform matching college volunteers with NGOs near campus. Core value: a student finds and applies to a verified local opportunity in under 2 minutes. I know Figma and a bit of React; I want a working demo in 3 weeks.',
  },
  {
    id: 'deck-review',
    num: '07',
    name: 'Deck Review',
    tagline: 'Investor-grade feedback on your pitch.',
    kind: 'advisory',
    chips: ['Problem & solution', 'Market size', 'Traction so far', 'Team & the ask'],
    tips: [
      'Paste your real slide text — even rough notes.',
      'Lead with the problem, not the product.',
      'Traction, however small, changes everything.',
    ],
    example:
      'Problem: tier-2 students can’t find affordable IELTS coaching. Solution: an AI speaking-practice app. Market: 2M test-takers/yr in India. Traction: 400 waitlist signups, 30 paying beta users. Team: 2 founders, ex-edtech. Ask: ₹40L for 18 months.',
  },
  {
    id: 'deck-builder',
    num: '08',
    name: 'Deck Builder',
    tagline: 'Draft a full pitch deck, slide by slide.',
    kind: 'builder',
    chips: ['Problem & solution', 'Who pays & how much', 'Any traction', 'Team & the ask'],
    tips: [
      'Give me the raw facts — I’ll structure the slides.',
      'Honest small numbers beat invented big ones.',
      'Name what makes your team the right one.',
    ],
    example:
      'We’re building Re-Loop, a campus marketplace for reselling textbooks and hostel gear. Students currently lose money to random WhatsApp groups. We take a 5% fee. 1 campus live, ₹60k GMV in 2 months. Team: 3 final-year students. Raising ₹25L to expand to 10 campuses.',
  },
  {
    id: 'financial-model-builder',
    num: '09',
    name: 'Financial Model Builder',
    tagline: 'Numbers that make investors lean in.',
    kind: 'builder',
    chips: ['Pricing & model', 'Rough cost of one sale', 'Growth expectation', 'Fixed monthly costs'],
    tips: [
      'Estimates are fine — just state your assumptions.',
      'Unit economics matter more than big totals.',
      'Know the one number your model hinges on.',
    ],
    example:
      'SaaS for small gyms in India. ₹1,500/month per gym. It costs ~₹2,000 in ads to sign one. I think I can add 15 gyms/month. Fixed costs ~₹50,000/month (hosting + one part-time dev). I want a 12-month projection and break-even point.',
  },
]

export const TAG_LABEL = {
  advisory: 'instant answer',
  builder: 'generates a file',
}

export const getTool = (id) => TOOLS.find((t) => t.id === id)
