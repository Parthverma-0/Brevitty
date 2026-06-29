// Partner directory. `category` is the display tag; tab filtering maps each
// partner to one of the three wall sections: Techkit, Institutional, Affiliate.
// `logo` is an official-site icon; when absent (or if it fails to load) the UI
// falls back to the initials-on-color tile via PartnerLogo.
import { registerCollection, getCollection } from './store.js'

const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const DEFAULT_PARTNERS = [
  // ---- Techkit ----
  { name: 'GitHub', mark: 'GH', color: '#181717', category: 'Techkit', logo: favicon('github.com'), description: 'Code hosting & collaboration for founder teams.', website: 'https://github.com' },
  { name: 'Microsoft', mark: 'MS', color: '#0078d4', category: 'Techkit', logo: favicon('microsoft.com'), description: 'Cloud, software, and startup founder support.', website: 'https://microsoft.com' },
  { name: 'IBM', mark: 'IBM', color: '#0530ad', category: 'Techkit', logo: "https://www.ibm.com/adobe/dynamicmedia/deliver/dm-aid--216ef57c-54a2-491c-b5ca-94fad2271170/logo-13-striped-logo.jpg?preferwebp=true&width=1584", description: 'Enterprise tech and cloud credits for startups.', website: 'https://ibm.com' },
  { name: 'Notion', mark: 'N', color: '#111111', category: 'Techkit', logo: favicon('notion.so'), description: 'All-in-one workspace and docs for teams.', website: 'https://notion.so' },
  { name: 'HubSpot', mark: 'HS', color: '#ff7a59', category: 'Techkit', logo: favicon('hubspot.com'), description: 'CRM and marketing stack for early-stage growth.', website: 'https://hubspot.com' },
  { name: 'AWS', mark: 'AWS', color: '#ff9900', category: 'Techkit', logo: favicon('aws.amazon.com'), description: 'Cloud credits and infrastructure via AWS Activate.', website: 'https://aws.amazon.com' },
  { name: 'Million Minds', logo: 'https://million-minds.com/assets/img/mmlogo.jpg', color: '#2563eb', category: 'Techkit', description: 'Technology and engineering services partner.', website: '#' },
  { name: 'FIIT', logo: 'https://fitt-iitd.in/web/assets/images/logo.webp', color: '#db2777', category: 'Techkit', description: 'Industry interaction and training partner.', website: '#' },
  { name: 'SiteItUp', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADIklEQVR4AbSUA4yccRTEz3eLNCjOtr2ubdsOatu2bUYX8xrVbZzUNqNai+mbGh+Om/wO++bN/O1XwU+Q2WzONBgMY41GY5nJZLopv98KXsK/+R1r1FDLHqHan0AxtIrxDuG+4Bagg5ta9rCXHlVKFoMoMVglv18KqCIv6UGvSoVLk0WaTgs+AdXERy96Vihc9q+Z7OcNNtck9KS37sx1wqs9CGao7rkITlFYmzBD6UwE8LDoNYsGoWEhmlBTAZ9VzPxz6W1SeKEXHl4/Bo7iTnCVdlOCNWoqMogXzPx11+WL7Xqj5uyaOgfg2ObXOL7lrSKsUUOtnh8zmc1TnyX/3FMXGoiYBqNVk9E4vPWzFtRQyx6iNYB7zOby83l1Ky97GOJic9C/92YMGbAbs6eew4YVz7Bu+WNF1kuNGmrZw156qL2YzPbj+602yjBZypLi7ti44RO2bQHGjS1HclIpEhMKFWFt/LgT2L4V2LzRjZKSHgjT3o4yP617z+bCou5Yue4z1m4G+g7Yj9CQQFVCQgLQtv1CzFlwH9NmXUZGZjPxCNV8F7gFb/iP2hbExOWhe9/d6DPoKNp1WYUS+1BViqwDER2bi4iIVISHJ8NsrqN3Hd9wC7waol8HiTMpcYzEjJVfVJm+4hMKrYMRGhqkuPcKeHUHQGhG0zzLYIxf+hkTln1RpcA+8o9lN+gOQHMLCJexXngK6oenISImF9mlA5FrHaqKq8NqtOp7DM167BF9vuZKMFvzEBpkJnFpzdFt/FX0mvoQJa0WISw0UAhSpUnPAxixDBiyyI2U/B7iEaJ9CLWuIZuTxKTPQjf6LQWaDSlH/dhC1IvOVYQ1avotAfoscCMpT3sAzNZ9iGhc3HEbSrvuQ9ORF9F28nO0mfRECdaooZY97NV9iCr8FBvkef06JfPM/x41//FhoJosoFoSimLClREiOmQM4//blf34b1f+CxsGyYHVcJJSGRGujhEhwSck+19CM/C/pHYoViyhFfifT1gWqJa46pjkBgkXJyfId3gxF+kNkoFvktG/UTrwzfKB75jQv2s2VDqn9O+eAwDcD1yEXgsBkwAAAABJRU5ErkJggg==', color: '#f59e0b', category: 'Techkit', description: 'Do-it-yourself website builder for founders.', website: '#' },

  // ---- Institutional Partners ----
  { name: 'IndusInd Bank', mark: 'IB', color: '#b91c1c', category: 'Institutional', logo: favicon('indusind.com'), description: 'Banking and financial services for founders.', website: 'https://indusind.com' },
  { name: 'DoIT&C, Govt. of Rajasthan', mark: 'DC', color: '#1d4ed8', category: 'Institutional', logo: favicon('doitc.rajasthan.gov.in'), description: 'Department of IT & Communication, Government of Rajasthan.', website: 'https://doitc.rajasthan.gov.in' },
  { name: 'TiE Rajasthan', mark: 'TiE', color: '#e11d48', category: 'Institutional', logo: favicon('tie.org'), description: 'Mentorship and founder network.', website: 'https://tie.org' },
  { name: 'NEOS', logo: 'https://media.licdn.com/dms/image/v2/C510BAQGwQwEh8yAL8A/company-logo_200_200/company-logo_200_200/0/1631360294094?e=1783555200&v=beta&t=9yCRC5Nuck427RGQbBJR8BMuSj25ezeNlehUbCdbH9I', color: '#f97316', category: 'Institutional', description: 'Angel consulting and investing network.', website: 'https://neosangels.com' },
  { name: 'Poornima University', mark: 'PU', color: '#7c3aed', category: 'Institutional', logo: favicon('poornima.edu.in'), description: 'Campus innovation and academic partner.', website: 'https://poornima.edu.in' },
  { name: 'PGVF', logo: 'pgvf.png', color: '#047857', category: 'Institutional', description: 'Venture and grant funding partner.', website: '#' },


  // ---- Affiliates ----
  { name: 'nstart', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHGEKfWMNzOjA/company-logo_200_200/company-logo_200_200/0/1684334662236/nstart_logo?e=1783555200&v=beta&t=PPGxTrJBjtL3G2A3S8pxF2_fyf6U-WAzEmS69lqtOZ0', color: '#0e7490', category: 'Affiliate', description: 'An initiative by AIM and BCIC.', website: '#' },
  { name: 'FINLAB', logo: 'https://finlab.one/static/media/logofront.32ed35e165d9df937f977aa5cac8606a.svg', color: '#111827', category: 'Affiliate', description: 'Finance and fintech lab partner.', website: '#' },
]

// Active list = admin override (localStorage) or the defaults above.
export const PARTNERS = registerCollection('partners', DEFAULT_PARTNERS)

// Fresh read for pages so admin edits show on navigation.
export const getPartners = () => getCollection('partners')

export const PARTNER_TABS = ['All', 'Techkit', 'Institutional', 'Affiliates']

// Tab → which display categories it includes.
export const TAB_CATEGORIES = {
  Techkit: ['Techkit'],
  Institutional: ['Institutional'],
  Affiliates: ['Affiliate'],
}

// Featured spotlights — rotate on the dark hero card.
export const FEATURED = [
  {
    name: 'AWS',
    mark: 'AWS',
    color: '#ff9900',
    logo: favicon('aws.amazon.com'),
    quote:
      'Through AWS Activate, brevitty founders get the cloud credits and technical depth to build without worrying about infrastructure on day one.',
  },
  {
    name: 'NEOS',
    mark: 'NEOS',
    color: '#f97316',
    logo: "https://media.licdn.com/dms/image/v2/C510BAQGwQwEh8yAL8A/company-logo_200_200/company-logo_200_200/0/1631360294094?e=1783555200&v=beta&t=9yCRC5Nuck427RGQbBJR8BMuSj25ezeNlehUbCdbH9I",
    quote:
      'We back brevitty cohorts with both capital and hands-on consulting. The quality of founders coming out of Jaipur keeps surprising us.',
  },
  {
    name: 'Microsoft',
    mark: 'MS',
    color: '#0078d4',
    logo: favicon('microsoft.com'),
    quote:
      'Founders on brevitty get the cloud, tooling, and support to build fast. It’s exactly the kind of grassroots ecosystem we love backing.',
  },
]

export const PARTNER_STATS = [
  { value: 18, suffix: '+', label: 'Partners' },
  { value: 9, suffix: '', label: 'Tech Tools' },
  { value: 7, suffix: '', label: 'Institutions' },
  { value: 2, suffix: '', label: 'Affiliates' },
]
