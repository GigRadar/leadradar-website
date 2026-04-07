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

// Query-aware templates: every line references {topic}, a phrase
// extracted from the user's search query, so the generated signals
// actually reflect what the user is looking for.
const SIGNAL_TEMPLATES = [
  { desc: 'r/sales "looking for {topic} — current options are either bloated or expensive"', verified: true },
  { desc: 'Job post: "Hiring for {topic}" — ${budget} budget', verified: true },
  { desc: '#saas-growth "anyone here doing {topic} at scale? what tool stack?"', verified: false },
  { desc: 'Liked 4 LinkedIn posts about {topic} this week', verified: false },
  { desc: 'Job post: "Need help with {topic} — must move fast" — ${budget}/yr', verified: true },
  { desc: 'r/startups "we switched providers for {topic} and cut costs 60%"', verified: false },
  { desc: 'Followed 3 vendors in the {topic} space + engaged with their posts', verified: false },
  { desc: '"any solid {topic} recommendation? our current setup is failing us"', verified: true },
  { desc: 'Subscribed to two newsletters covering {topic} + downloaded a whitepaper', verified: false },
  { desc: 'Job post: "Looking for someone with {topic} experience"', verified: true },
  { desc: 'r/entrepreneur "building a stack around {topic}, what should I prioritize?"', verified: false },
  { desc: 'Posted in #gtm-engineers: "need help shipping {topic} this quarter"', verified: true },
  { desc: 'Replied to a pricing thread on X about {topic}', verified: false },
  { desc: 'Searched "{topic} vs alternatives" — visited 4 comparison pages', verified: true },
  { desc: 'r/sales "our team is evaluating {topic} tools this quarter"', verified: true },
  { desc: 'Mentioned budget reallocation for {topic} in a public Slack channel', verified: false },
  { desc: 'Job post: "Seeking lead to own {topic}" — ${budget}', verified: true },
  { desc: '"we need a better {topic} solution — too many gaps in what we have"', verified: true },
  { desc: 'Tweet: "what is everyone using for {topic} in 2026?" — 23 replies', verified: false },
  { desc: 'Attended a webinar on {topic} last Thursday + asked 2 questions', verified: false },
  { desc: '"anyone benchmarking {topic} vendors right now? would love to compare notes"', verified: true },
  { desc: 'Bookmarked 5 articles tagged {topic} on Hacker News this week', verified: false },
]

const BUDGETS = ['2,500', '4,800', '1,200', '8,000', '3,500', '6,200', '120,000', '95,000', '150,000']

const STOPWORDS = new Set([
  'a','an','the','and','or','but','of','for','to','in','on','at','by','from','with','about',
  'as','is','are','was','were','be','been','being','have','has','had','do','does','did',
  'this','that','these','those','my','our','your','their','i','we','you','they','them','it',
  'who','what','which','where','when','why','how','that','than','then','so','if','can','will',
  'me','us','any','all','some','more','most','other','new','best','top','need','looking','find',
  'using','use','use','also','just','really','very',
])

function extractTopics(query: string): string[] {
  const cleaned = query.toLowerCase().replace(/[^a-z0-9\s+#.&-]/g, ' ')
  const words = cleaned.split(/\s+/).filter(w => w && !STOPWORDS.has(w) && w.length > 1)
  if (words.length === 0) return [query.trim() || 'lead generation']

  // Build a few phrases: full query (trimmed), 2-grams, then individual words
  const phrases: string[] = []
  const trimmed = query.trim().replace(/\s+/g, ' ')
  if (trimmed.length <= 60) phrases.push(trimmed.toLowerCase())
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`)
  }
  phrases.push(...words)
  // dedupe, keep order
  return Array.from(new Set(phrases)).slice(0, 8)
}

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

function fillTemplate(template: string, topics: string[]): string {
  return template
    .replace('{topic}', pick(topics))
    .replace('{budget}', pick(BUDGETS))
}

function generateSignals(query: string): Signal[] {
  const count = 14 + Math.floor(Math.random() * 6) // 14-19 signals
  const used = new Set<number>()
  const signals: Signal[] = []
  const topics = extractTopics(query)

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
      description: fillTemplate(template.desc, topics),
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
