import { NextRequest, NextResponse } from 'next/server'

interface Signal {
  id: string
  date: string
  source: { name: string; logo: string | null; anonymous: boolean }
  description: string
  verified: boolean
  extraCount: number
  person: { name: string; avatar: string }
  company: { name: string; logo: string }
}

const SOURCES = [
  { name: 'Telegram', logo: 'https://www.google.com/s2/favicons?domain=telegram.org&sz=32', anonymous: false },
  { name: 'Reddit', logo: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=32', anonymous: false },
  { name: 'Upwork', logo: 'https://www.google.com/s2/favicons?domain=upwork.com&sz=32', anonymous: false },
  { name: 'LinkedIn', logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=32', anonymous: false },
  { name: 'Discord', logo: 'https://www.google.com/s2/favicons?domain=discord.com&sz=32', anonymous: false },
  { name: 'Anonymous source', logo: null, anonymous: true },
  { name: 'Anonymous source', logo: null, anonymous: true },
]

const PEOPLE = [
  { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=47', company: 'Stripe', companyLogo: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=32' },
  { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/40?img=12', company: 'Figma', companyLogo: 'https://www.google.com/s2/favicons?domain=figma.com&sz=32' },
  { name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/40?img=44', company: 'Notion', companyLogo: 'https://www.google.com/s2/favicons?domain=notion.so&sz=32' },
  { name: 'Alex Kim', avatar: 'https://i.pravatar.cc/40?img=15', company: 'Linear', companyLogo: 'https://www.google.com/s2/favicons?domain=linear.app&sz=32' },
  { name: 'Jordan Taylor', avatar: 'https://i.pravatar.cc/40?img=33', company: 'Vercel', companyLogo: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=32' },
  { name: 'Nina Patel', avatar: 'https://i.pravatar.cc/40?img=49', company: 'Rippling', companyLogo: 'https://www.google.com/s2/favicons?domain=rippling.com&sz=32' },
  { name: 'Daniel Wu', avatar: 'https://i.pravatar.cc/40?img=18', company: 'Retool', companyLogo: 'https://www.google.com/s2/favicons?domain=retool.com&sz=32' },
  { name: 'Laura Martinez', avatar: 'https://i.pravatar.cc/40?img=56', company: 'Loom', companyLogo: 'https://www.google.com/s2/favicons?domain=loom.com&sz=32' },
  { name: 'Ryan Brooks', avatar: 'https://i.pravatar.cc/40?img=11', company: 'Segment', companyLogo: 'https://www.google.com/s2/favicons?domain=segment.com&sz=32' },
  { name: 'Kayla Lee', avatar: 'https://i.pravatar.cc/40?img=52', company: 'Intercom', companyLogo: 'https://www.google.com/s2/favicons?domain=intercom.com&sz=32' },
  { name: 'Tom Nguyen', avatar: 'https://i.pravatar.cc/40?img=22', company: 'Webflow', companyLogo: 'https://www.google.com/s2/favicons?domain=webflow.com&sz=32' },
  { name: 'Ava Singh', avatar: 'https://i.pravatar.cc/40?img=60', company: 'Attio', companyLogo: 'https://www.google.com/s2/favicons?domain=attio.com&sz=32' },
  { name: 'Chris Foster', avatar: 'https://i.pravatar.cc/40?img=25', company: 'Apollo', companyLogo: 'https://www.google.com/s2/favicons?domain=apollo.io&sz=32' },
  { name: 'Maya Rossi', avatar: 'https://i.pravatar.cc/40?img=64', company: 'Clay', companyLogo: 'https://www.google.com/s2/favicons?domain=clay.com&sz=32' },
  { name: 'Ben Harrison', avatar: 'https://i.pravatar.cc/40?img=8', company: 'Instantly', companyLogo: 'https://www.google.com/s2/favicons?domain=instantly.ai&sz=32' },
  { name: 'Sophie Adams', avatar: 'https://i.pravatar.cc/40?img=36', company: 'HubSpot', companyLogo: 'https://www.google.com/s2/favicons?domain=hubspot.com&sz=32' },
  { name: 'Jake Rivera', avatar: 'https://i.pravatar.cc/40?img=14', company: 'Gong', companyLogo: 'https://www.google.com/s2/favicons?domain=gong.io&sz=32' },
  { name: 'Lisa Park', avatar: 'https://i.pravatar.cc/40?img=41', company: 'Outreach', companyLogo: 'https://www.google.com/s2/favicons?domain=outreach.io&sz=32' },
]

const SIGNAL_TEMPLATES = [
  { desc: 'r/sales "looking for alternatives to {tool}, pricing is getting out of hand"', verified: true },
  { desc: 'Job post: "Build {role} automation pipeline" — ${budget} budget', verified: true },
  { desc: '#saas-growth "anyone tried {tool}? need something for {need}"', verified: false },
  { desc: 'Liked 3 posts from {tool} competitors this week', verified: false },
  { desc: 'Job post: "Hiring {role} — must know {tool}" — ${budget}/yr', verified: true },
  { desc: 'r/startups "we switched from {tool} and saved 60% on our pipeline"', verified: false },
  { desc: 'Followed {competitor} CEO on LinkedIn + engaged with 4 posts', verified: false },
  { desc: '"anyone have a {need} recommendation? current tool is failing us"', verified: true },
  { desc: 'Subscribed to {competitor} newsletter + downloaded whitepaper', verified: false },
  { desc: 'Job post: "Looking for {role} with {tool} experience"', verified: true },
  { desc: 'r/entrepreneur "building a {need} stack, what signals matter most?"', verified: false },
  { desc: 'Posted in #gtm-engineers: "need help with {need}"', verified: true },
  { desc: 'Replied to {competitor} pricing thread on X/Twitter', verified: false },
  { desc: 'Searched for "{tool} vs alternatives" — 3 comparison pages visited', verified: true },
  { desc: 'r/sales "our {role} team is evaluating new {need} tools this quarter"', verified: true },
  { desc: 'Mentioned budget reallocation for {need} in public Slack channel', verified: false },
  { desc: 'Job post: "Seeking {role} to revamp outbound" — ${budget}', verified: true },
  { desc: '"we need a better {need} solution — current one has too many gaps"', verified: true },
]

const TOOLS = ['Clay', 'Apollo', 'ZoomInfo', 'Outreach', 'Gong', 'Salesloft', 'HubSpot', 'Instantly', 'Lemlist']
const ROLES = ['GTM Engineer', 'Sales Engineer', 'RevOps Manager', 'SDR Lead', 'Head of Growth', 'VP Sales']
const NEEDS = ['lead enrichment', 'outbound automation', 'intent signals', 'sales intelligence', 'pipeline management', 'prospecting']
const COMPETITORS = ['Clay', 'Apollo', 'ZoomInfo', 'Gong', 'Salesloft', 'Outreach']
const BUDGETS = ['2,500', '4,800', '1,200', '8,000', '3,500', '6,200', '120,000', '95,000', '150,000']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateDate(i: number, total: number): string {
  const now = Date.now()
  if (i < total * 0.6) {
    // Within last 7 days
    const daysAgo = Math.floor(Math.random() * 7)
    const d = new Date(now - daysAgo * 86400000 - Math.random() * 86400000)
    return d.toISOString()
  } else {
    // 8-30 days ago (behind paywall)
    const daysAgo = 8 + Math.floor(Math.random() * 22)
    const d = new Date(now - daysAgo * 86400000 - Math.random() * 86400000)
    return d.toISOString()
  }
}

function fillTemplate(template: string): string {
  return template
    .replace('{tool}', pick(TOOLS))
    .replace('{role}', pick(ROLES))
    .replace('{need}', pick(NEEDS))
    .replace('{competitor}', pick(COMPETITORS))
    .replace('{budget}', pick(BUDGETS))
}

function generateSignals(query: string): Signal[] {
  const count = 14 + Math.floor(Math.random() * 6) // 14-19 signals
  const used = new Set<number>()
  const signals: Signal[] = []

  for (let i = 0; i < count; i++) {
    let personIdx: number
    do { personIdx = Math.floor(Math.random() * PEOPLE.length) } while (used.has(personIdx))
    used.add(personIdx)
    if (used.size >= PEOPLE.length) used.clear()

    const person = PEOPLE[personIdx]
    const source = pick(SOURCES)
    const template = pick(SIGNAL_TEMPLATES)

    signals.push({
      id: `sig_${Date.now()}_${i}`,
      date: generateDate(i, count),
      source,
      description: fillTemplate(template.desc),
      verified: template.verified,
      extraCount: Math.random() < 0.45 ? 1 + Math.floor(Math.random() * 3) : 0,
      person: { name: person.name, avatar: person.avatar },
      company: { name: person.company, logo: person.companyLogo },
    })
  }

  // Sort by date descending
  signals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return signals
}

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 400))

  const signalCount = 14 + Math.floor(Math.random() * 6)
  const steps = [
    '// parsing your ICP criteria...',
    `// scanning ${Math.floor(40 + Math.random() * 20)} sources across Telegram, Reddit, Upwork, LinkedIn...`,
    `// cross-referencing signal database — ${(Math.floor(Math.random() * 3000) + 5000).toLocaleString()} candidates...`,
    `// ranking by relevance and recency...`,
    `// found ${signalCount} matching signals in 7-day window`,
  ]

  const signals = generateSignals(query)

  return NextResponse.json({ steps, signals, total: signals.length + Math.floor(Math.random() * 800) + 200 })
}
