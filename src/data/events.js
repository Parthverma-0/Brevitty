import { registerCollection, getCollection } from './store.js'

// Real Jaipur startup / business events (verified June 2026). Each event links out to
// its official registration / event page via `registerUrl` — that's what the
// "Register Now" button opens. `seatsLeft` drives FOMO; capacity = registered + seatsLeft.
const DEFAULT_EVENTS = [
  {
    slug: 'startup-samvad-investor-confluence',
    name: 'VCs & Investors Confluence — Startup Samvad',
    type: 'Summit',
    dateLabel: 'July 3, 2026',
    time: '10:00 AM – 2:00 PM',
    startsAt: '2026-07-03T10:00:00+05:30',
    location: 'Rajasthan International Center, Jaipur',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    registerUrl:
      'https://allevents.in/jaipur/vcs-and-investors-confluence-startup-samvad-tickets/80001463556526',
    registered: 184,
    seatsLeft: 12,
    completed: false,
    short: 'Founders, VCs and angels from across India, under one roof for a day.',
    description:
      'Startup Samvad brings together leading founders, prominent venture capitalists, angel investors and startup ecosystem leaders from across India. A day of curated conversations, investor connects and dealflow for Jaipur’s early-stage founders.',
    agenda: [
      { time: '10:00 AM', title: 'Registration & founder networking' },
      { time: '11:00 AM', title: 'Investor panels & fireside chats' },
      { time: '12:30 PM', title: 'Founder ↔ investor connects' },
      { time: '01:30 PM', title: 'Closing networking lunch' },
    ],
  },
  {
    slug: 'stesi-2026',
    name: 'STESI 2026 — Smart Technologies Conference',
    type: 'Conference',
    dateLabel: 'July 22–23, 2026',
    time: '09:00 AM – 6:00 PM',
    startsAt: '2026-07-22T09:00:00+05:30',
    location: 'Manipal University, Jaipur',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    registerUrl:
      'https://allevents.in/jaipur/stesi-2026-international-conference-on-smart-technologies-for-energy-sustainability-and-industry/200029982068025',
    registered: 96,
    seatsLeft: 40,
    completed: false,
    short: 'International conference on smart tech for energy, sustainability & industry.',
    description:
      'STESI 2026 is an international conference spanning seven research tracks — smart grids, IoT, AI, materials science and energy policy — connecting deep-tech founders, researchers and industry over two days at Manipal University Jaipur.',
    agenda: [
      { time: '09:00 AM', title: 'Inauguration & keynote' },
      { time: '11:00 AM', title: 'Parallel research tracks' },
      { time: '02:00 PM', title: 'Industry & startup sessions' },
      { time: '05:00 PM', title: 'Networking & awards' },
    ],
  },
  {
    slug: 'shopping-centres-next-2026',
    name: 'Shopping Centres Next 2026',
    type: 'Conference',
    dateLabel: 'July 23–24, 2026',
    time: '09:00 AM – 9:00 PM',
    startsAt: '2026-07-23T09:00:00+05:30',
    location: 'Jaipur Marriott Hotel',
    image:
      'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=1200&q=80',
    registerUrl:
      'https://allevents.in/jaipur/shopping-centres-next-2026-retail-real-estate-conference-india/80002163942756',
    registered: 142,
    seatsLeft: 58,
    completed: false,
    short: 'Retail real estate conference for mall developers, D2C brands & retailers.',
    description:
      'India’s retail real estate conference connecting top mall developers, retailers, D2C brands, leasing experts and innovators through conference sessions and an exhibition floor — a strong room for consumer and retail-tech founders.',
    agenda: [
      { time: '09:00 AM', title: 'Doors open & exhibition' },
      { time: '10:30 AM', title: 'Keynotes & developer panels' },
      { time: '02:00 PM', title: 'D2C & retail-tech showcase' },
      { time: '06:00 PM', title: 'Networking evening' },
    ],
  },
  {
    slug: 'startup-grind-jaipur',
    name: 'Startup Grind Jaipur',
    type: 'Networking',
    dateLabel: 'Monthly meetup',
    time: 'Evenings',
    startsAt: null, // recurring — no fixed date
    location: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    registerUrl: 'https://www.startupgrind.com/jaipur/',
    registered: 73,
    seatsLeft: 27,
    completed: false,
    short: 'The global Startup Grind community’s Jaipur chapter — fireside chats & networking.',
    description:
      'Startup Grind is a global community for entrepreneurs, and its Jaipur chapter runs regular fireside chats, founder stories and networking meetups to help local startups build, grow and scale. Join the chapter to get notified about the next session.',
    agenda: [
      { time: '06:00 PM', title: 'Doors open & intros' },
      { time: '06:30 PM', title: 'Fireside chat with a founder' },
      { time: '07:30 PM', title: 'Open networking' },
    ],
  },
  {
    slug: 'echai-founders-meetup-jaipur',
    name: 'eChai Founders Meetup — Jaipur',
    type: 'Networking',
    dateLabel: 'Recurring',
    time: 'Evenings',
    startsAt: null, // recurring — no fixed date
    location: 'J Startup House, Jaipur',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    registerUrl: 'https://echai.ventures/cities/jaipur/events',
    registered: 58,
    seatsLeft: 22,
    completed: false,
    short: 'eChai Ventures’ candid founder meetups, demo days & pitch nights in Jaipur.',
    description:
      'eChai Ventures hosts startup stories, candid founder conversations, demo days and pitch nights in Jaipur — open to all founders, investors and product builders. Check the eChai Jaipur calendar for the next meetup and RSVP.',
    agenda: [
      { time: '05:30 PM', title: 'Founder check-ins' },
      { time: '06:00 PM', title: 'Candid founder conversations' },
      { time: '07:00 PM', title: 'Demo & pitch corner' },
    ],
  },
  {
    slug: 'bharat-renewable-expo-2027',
    name: 'Bharat Renewable Expo 2027',
    type: 'Conference',
    dateLabel: 'Jan 29–31, 2027',
    time: '09:00 AM – 6:00 PM',
    startsAt: '2027-01-29T09:00:00+05:30',
    location: 'JECC, Sitapura, Jaipur',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    registerUrl:
      'https://allevents.in/jaipur/bharat-renewable-expo-2027-tickets/80001454798597',
    registered: 110,
    seatsLeft: 90,
    completed: false,
    short: 'A three-day clean-energy expo showcasing Rajasthan’s renewable push.',
    description:
      'Bharat Renewable Expo is an immersive three-day exhibition on the future of clean energy, unveiling Rajasthan’s pioneering efforts in solar, storage and green tech — a strong stage for climate and energy startups. Free to attend.',
    agenda: [
      { time: '09:00 AM', title: 'Expo floor opens' },
      { time: '11:00 AM', title: 'Clean-energy keynotes' },
      { time: '02:00 PM', title: 'Startup & innovation pavilion' },
      { time: '05:00 PM', title: 'Networking' },
    ],
  },
]

// Active list = admin override (localStorage) or the defaults above.
export const EVENTS = registerCollection('events', DEFAULT_EVENTS)

// Fresh read for pages so admin edits show on navigation.
export const getEvents = () => getCollection('events')

// Filter pill → predicate. Only types that actually exist in EVENTS are shown.
export const EVENT_FILTERS = [
  'All',
  'Upcoming',
  'Investor Summits',
  'Conferences',
  'Networking',
]

export const FILTER_TYPE = {
  'Investor Summits': 'Summit',
  Conferences: 'Conference',
  Networking: 'Networking',
}

export const TYPE_STYLES = {
  Summit: 'bg-orange text-white',
  Conference: 'bg-ink text-white',
  Networking: 'bg-sky-600 text-white',
}

export const LOW_SEATS = 15

export function getEvent(slug) {
  return getEvents().find((e) => e.slug === slug)
}

// Soonest upcoming event that has a concrete start time (skips recurring ones).
export function getNextEvent(now = Date.now()) {
  return (
    getEvents()
      .filter((e) => e.startsAt && new Date(e.startsAt).getTime() > now)
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))[0] || null
  )
}
