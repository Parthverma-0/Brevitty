import { registerCollection, getCollection } from './store.js'

// Incubated startups. `mark` is the logo monogram; `color` tints the logo chip.
// `logo` (optional) is an image path that replaces the monogram when present.
// `bg` (optional) is a card background image — shown grayscale, colored on hover.
const DEFAULT_STARTUPS = [
  {
    name: 'GLADFUL',
    logo: '/GRADFUL.jpeg',
    bg: '/Gladful-Protein-on-Shark-Tank-India.jpg',
    color: '#6366f1',
    sector: 'Foodtech',
    description: 'Kid-friendly protein powered meals with added vitamins, calcium or fibre!',
    stage: 'Featured',
    funding: 'Shark Tank Season 3',
  },
  {
    name: 'FOMO',
    logo: '/fomo_brews_logo.jpeg',
    bg: '/fomo_sharktank.webp',
    color: '#16a34a',
    sector: 'Foodtech',
    description: 'Vibe Check, One Sip at a Time!',
    stage: 'Featured',
    funding: 'Shark Tank Season 3',
  },
  {
    name: 'NUSHKA',
    logo: '/nuskha_kitchen_logo.jpeg',
    bg: '/nushka_sharktank.jpg',
    color: '#f97316',
    sector: 'Foodtech',
    description: 'Nurturing Motherhood',
    stage: 'Featured',
    funding: 'Shark Tank Season 1',
  },
  {
    name: 'BUZZY BUGS',
    logo: '/BuzyBugs-logo-textside-300x98-1.png',
    bg: '/buzzybugs_bg.png',
    color: '#0ea5e9',
    sector: 'Consumer',
    description: 'Interactive Art & Craft Experiences for Every Occasion',
    stage: 'Revenue',
    funding: '$500,000+ in two years',
  },
  {
    name: 'Nyus',
    logo: '/nyus.jpg',
    bg: '/nyus_bg.png',
    color: '#db2777',
    sector: 'Media',
    description: 'Provides daily news in the form of memes.',
    stage: 'Funded',
    funding: '25 Lakhs',
  },
  {
    name: 'MITIHUB',
    logo: '/mitihub_logo.jpeg',
    color: '#9333ea',
    sector: 'Marketplace',
    description: 'Design-to-checkout for D2C artisan brands.',
    stage: 'Seed',
    funding: '$1.4M',
  },
  {
    name: 'GLAD BE',
    logo: '/Gladbe_logo.png',
    color: '#ca8a04',
    sector: 'Fintech',
    description: 'Embedded credit for kirana retailers.',
    stage: 'Pre-seed',
    funding: '$600K',
  },
  {
    name: 'V-Grow',
    logo: '/vgrow_logo.png',
    color: '#e11d48',
    sector: 'Cleantech',
    description: 'Rooftop solar financing, fully digital.',
    stage: 'Revenue',
    funding: '',
  },
  {
    name: 'OpenDrill',
    logo: '/logo.png',
    color: '#e11d48',
    sector: 'Edtech',
    description: 'Solve real OpenSource problems',
    stage: 'Pre-seed',
    funding: '',
  },
]

// Active list = admin override (localStorage) or the defaults above.
export const STARTUPS = registerCollection('startups', DEFAULT_STARTUPS)

// Fresh read for pages so admin edits show on navigation.
export const getStartups = () => getCollection('startups')
