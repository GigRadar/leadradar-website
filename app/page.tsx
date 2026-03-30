'use client'

import { useState, useEffect, useRef } from 'react'
import LeadRadarLogo from './components/LeadRadarLogo'

const PERSONAS = [
  { avatar: 'https://i.pravatar.cc/40?img=47', name: 'Sarah Chen',      title: 'VP of Sales',       company: 'Stripe',     logo: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=12', name: 'Marcus Johnson',  title: 'Head of Growth',    company: 'Figma',      logo: 'https://www.google.com/s2/favicons?domain=figma.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=44', name: 'Emily Rodriguez', title: 'CRO',               company: 'Notion',     logo: 'https://www.google.com/s2/favicons?domain=notion.so&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=15', name: 'Alex Kim',        title: 'VP Sales',          company: 'Linear',     logo: 'https://www.google.com/s2/favicons?domain=linear.app&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=33', name: 'Jordan Taylor',   title: 'Head of Sales',     company: 'Vercel',     logo: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=49', name: 'Nina Patel',      title: 'RevOps Lead',       company: 'Rippling',   logo: 'https://www.google.com/s2/favicons?domain=rippling.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=18', name: 'Daniel Wu',       title: 'GTM Engineer',      company: 'Retool',     logo: 'https://www.google.com/s2/favicons?domain=retool.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=56', name: 'Laura Martinez',  title: 'Dir of Revenue',    company: 'Loom',       logo: 'https://www.google.com/s2/favicons?domain=loom.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=11', name: 'Ryan Brooks',     title: 'Sales Engineer',    company: 'Segment',    logo: 'https://www.google.com/s2/favicons?domain=segment.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=52', name: 'Kayla Lee',       title: 'Head of Marketing', company: 'Intercom',   logo: 'https://www.google.com/s2/favicons?domain=intercom.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=22', name: 'Tom Nguyen',      title: 'VP Growth',         company: 'Webflow',    logo: 'https://www.google.com/s2/favicons?domain=webflow.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=60', name: 'Ava Singh',       title: 'CRO',               company: 'Attio',      logo: 'https://www.google.com/s2/favicons?domain=attio.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=25', name: 'Chris Foster',    title: 'RevOps Manager',    company: 'Apollo',     logo: 'https://www.google.com/s2/favicons?domain=apollo.io&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=64', name: 'Maya Rossi',      title: 'Head of Sales',     company: 'Clay',       logo: 'https://www.google.com/s2/favicons?domain=clay.com&sz=32' },
  { avatar: 'https://i.pravatar.cc/40?img=8',  name: 'Ben Harrison',    title: 'VP Revenue',        company: 'Instantly',  logo: 'https://www.google.com/s2/favicons?domain=instantly.ai&sz=32' },
]

const SIGNALS = [
  { icon: '🔥', srcClass: 'tg', srcLabel: '[Telegram]', text: '#saas-growth  "anyone using Clay alternatives? getting expensive fast"', time: '2s',  persona: 0 },
  { icon: '📡', srcClass: 'uw', srcLabel: '[Upwork]',   text: 'Job post: "Build LinkedIn scraper for outbound leads"  $3,200 budget',   time: '5s',  persona: 1 },
  { icon: '⚡', srcClass: 'rd', srcLabel: '[Reddit]',   text: 'r/sales  "ZoomInfo renewed, feels like robbery — what are you using?"',   time: '9s',  persona: 2 },
  { icon: '📊', srcClass: 'li', srcLabel: '[LinkedIn]', text: 'liked 3 posts from Gong competitors this week',                           time: '13s', persona: 3 },
  { icon: '🎯', srcClass: 'uw', srcLabel: '[Upwork]',   text: 'Job post: "Automate outreach for B2B SaaS startup"  $1,800 fixed price',  time: '18s', persona: 4 },
  { icon: '🔥', srcClass: 'tg', srcLabel: '[Telegram]', text: '#leadgen  "just hit 50 demos this month using intent signals only"',       time: '22s', persona: 5 },
  { icon: '🔴', srcClass: 'rd', srcLabel: '[Reddit]',   text: 'r/entrepreneur  "what signal told you a prospect was actually ready?"',    time: '27s', persona: 6 },
  { icon: '📡', srcClass: 'dc', srcLabel: '[Discord]',  text: 'GTM Operators  "clay waterfall is broken again, anyone else?"',            time: '31s', persona: 7 },
  { icon: '⚡', srcClass: 'li', srcLabel: '[LinkedIn]', text: 'switched from Salesforce to Attio · 3 posts about RevOps stack',          time: '36s', persona: 8 },
  { icon: '🎯', srcClass: 'uw', srcLabel: '[Upwork]',   text: 'Job post: "Scrape Crunchbase for Series A funding leads"  $900 budget',   time: '40s', persona: 9 },
  { icon: '🔥', srcClass: 'rd', srcLabel: '[Reddit]',   text: 'r/startups  "built a bot monitoring competitor G2 reviews for leads"',    time: '44s', persona: 10 },
  { icon: '📡', srcClass: 'uw', srcLabel: '[Upwork]',   text: 'Job post: "Lead enrichment pipeline with Apollo + Clay"  $2,100',         time: '49s', persona: 11 },
  { icon: '⚡', srcClass: 'li', srcLabel: '[LinkedIn]', text: "RSVP'd to SaaStr Annual · following 4 sales intelligence tools",          time: '54s', persona: 12 },
  { icon: '🔴', srcClass: 'rd', srcLabel: '[Reddit]',   text: 'r/sales  "Apollo data quality dropped this quarter — alternatives?"',     time: '58s', persona: 13 },
  { icon: '🎯', srcClass: 'tg', srcLabel: '[Telegram]', text: '#saas-sales  "client asking for intent signals to feed into Instantly"',   time: '63s', persona: 14 },
]

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <img className="feed-avatar" src={src} alt={name} />
  )
}

function SignalFeed() {
  const doubled = [...SIGNALS, ...SIGNALS]
  return (
    <div className="feed-window">
      <div className="feed-header">
        <div className="feed-dot" />
        leadradar feed · realtime · 8,241 signals tracked today
      </div>
      <div className="feed-body">
        <div className="feed-scroller">
          {doubled.map((s, i) => {
            const p = PERSONAS[s.persona]
            return (
              <div className="feed-item" key={i}>
                <Avatar src={p.avatar} name={p.name} />
                <div className="feed-item-body">
                  <div className="feed-item-who">
                    <span className="feed-name">{p.name}</span>
                    <span className="feed-dot-sep">·</span>
                    <span className="feed-role">{p.title}</span>
                    <span className="feed-dot-sep">·</span>
                    <img className="feed-company-logo" src={p.logo} alt={p.company} />
                    <span className="feed-company">{p.company}</span>
                    <div className={`feed-src ${s.srcClass}`}>{s.srcLabel}</div>
                    <div className="feed-time">{s.time} ago</div>
                  </div>
                  <div className="feed-text">{s.icon} {s.text}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo"><LeadRadarLogo height={28} /></div>
        <div className="nav-right">
          <a href="#how" className="nav-link">how it works</a>
          <a href="#signals" className="nav-link">signals</a>
          <a href="#waitlist" className="nav-link">pricing</a>
          <button className="theme-toggle" onClick={toggleTheme}>[☀ / ☾]</button>
          <a href="#waitlist" className="btn-cta">join waitlist →</a>
        </div>
      </nav>

      {/* HERO TEXT */}
      <section className="hero-text-section">
        <div className="hero-eyebrow">
          // <span>v0.1 — early access open</span> · crowd-sourced · open marketplace
        </div>
        <h1 className="hero-headline">
          The signal layer your<br />
          <em>GTM stack is missing.</em>
        </h1>
        <p className="hero-sub">
          Crowd-sourced intent signals from <strong>Telegram, Upwork, Reddit</strong> and 50+ sources —
          validated by the community, piped directly into{' '}
          <strong>Clay, Apollo, HeyReach, Instantly.</strong>
          <span className="cursor">█</span>
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn-cta">join waitlist →</a>
          <span className="hero-proof">
            · <span>600+</span> operators · <span>8.2M</span> signals tracked
          </span>
        </div>
      </section>

      {/* FLOW DIAGRAM */}
      <section className="flow-section">
        <div className="flow-diagram">
          {/* LEFT: Signal Sources */}
          <div className="flow-col-left">
            {[
              { icon: '📡', label: 'Telegram', sub: 'channels' },
              { icon: '💼', label: 'Upwork',   sub: 'job posts' },
              { icon: '🔴', label: 'Reddit',   sub: 'communities' },
              { icon: '💬', label: 'Discord',  sub: 'servers' },
              { icon: '🔗', label: 'LinkedIn', sub: 'dark social' },
            ].map((c) => (
              <div className="flow-card" key={c.label}>
                <span className="flow-card-icon">{c.icon}</span>
                <span className="flow-card-label">{c.label}</span>
                <span className="flow-card-sub">{c.sub}</span>
              </div>
            ))}
          </div>

          {/* LEFT ARROWS */}
          <div className="flow-connector-left">
            {[0,1,2,3,4].map(i => <div className="flow-arrow" key={i} />)}
          </div>

          {/* CENTER */}
          <div className="flow-center">
            <div className="center-logo">◈ LEADRADAR</div>
            <div className="center-subtitle">signal marketplace</div>
            <div className="center-divider" />
            <div className="center-stats">
              <div className="center-stat">
                <span className="center-stat-label">signals tracked</span>
                <span className="center-stat-val">8,241,097</span>
              </div>
              <div className="center-stat">
                <span className="center-stat-label">data providers</span>
                <span className="center-stat-val">open market</span>
              </div>
              <div className="center-stat">
                <span className="center-stat-label">economy</span>
                <span className="center-stat-val">credits-based</span>
              </div>
              <div className="center-stat">
                <span className="center-stat-label">connectors</span>
                <span className="center-stat-val">community-built</span>
              </div>
            </div>
            <div className="center-badge">crowd-sourced · open</div>
          </div>

          {/* RIGHT ARROWS */}
          <div className="flow-connector-right">
            {[0,1,2,3,4].map(i => <div className="flow-arrow" key={i} />)}
          </div>

          {/* RIGHT: GTM Stack */}
          <div className="flow-col-right">
            {[
              { icon: '🔵', label: 'Clay',     sub: 'enrichment' },
              { icon: '🔵', label: 'Apollo',   sub: 'enrichment' },
              { icon: '📧', label: 'HeyReach', sub: 'sequencing' },
              { icon: '⚡', label: 'Instantly', sub: 'sequencing' },
              { icon: '＋', label: 'your stack', sub: 'via API', extra: 'add' },
            ].map((c) => (
              <div className={`flow-card${c.extra ? ' ' + c.extra : ''}`} key={c.label}>
                <span className="flow-card-icon">{c.icon}</span>
                <span className="flow-card-label">{c.label}</span>
                <span className="flow-card-sub">{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNAL FEED */}
      <section className="feed-section" id="signals">
        <div className="section-label">// live signal stream</div>
        <SignalFeed />
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-label">// how it works</div>
        <div className="how-grid">
          <div className="how-card">
            <div className="how-num">01 ──</div>
            <div className="how-ascii">{`┌───┐\n│ ◎ │  contribute\n└───┘`}</div>
            <div className="how-title">Operators Contribute</div>
            <div className="how-desc">
              Run a Telegram scraper? Upwork monitor? Reddit watcher? Stream your data into
              LeadRadar and earn credits for every signal consumed by buyers.
            </div>
          </div>
          <div className="how-card">
            <div className="how-num">02 ──</div>
            <div className="how-ascii">{`┌───┐\n│ ≋ │  validate\n└───┘`}</div>
            <div className="how-title">Signals Get Validated</div>
            <div className="how-desc">
              AI scores each signal for quality and relevance. Contributor reputation builds
              over time. Garbage in → no credits out. Quality signals earn more.
            </div>
          </div>
          <div className="how-card">
            <div className="how-num">03 ──</div>
            <div className="how-ascii">{`┌───┐\n│ → │  consume\n└───┘`}</div>
            <div className="how-title">Buyers Get Intent</div>
            <div className="how-desc">
              GTM teams subscribe to signal streams and pipe directly into Clay, Apollo or
              any CRM. Reach buyers before your competitors even know they exist.
            </div>
          </div>
        </div>
      </section>

      {/* SIGNAL TYPES */}
      <section className="signals-section">
        <div className="section-label">// signal types</div>
        <div className="signals-grid">
          {[
            { ascii: '[TG]──►[◎]', name: 'Telegram Intel',   ex: 'channel discussions, tool complaints, buying signals' },
            { ascii: '[UW]──►[◎]', name: 'Upwork Intent',    ex: 'job posts revealing tech stack & budget signals' },
            { ascii: '[RD]──►[◎]', name: 'Reddit Signals',   ex: 'product complaints, alternatives searches, intent threads' },
            { ascii: '[LI]──►[◎]', name: 'LinkedIn Activity', ex: 'competitor engagement, job changes, post signals' },
            { ascii: '[JB]──►[◎]', name: 'Job Board Intel',  ex: 'hiring patterns revealing tool adoption & budgets' },
            { ascii: '[??]──►[◎]', name: 'Your Connector',   ex: 'upload your own source, earn credits on every query' },
          ].map((s) => (
            <div className="signal-card" key={s.name}>
              <div className="signal-ascii">{s.ascii}</div>
              <div className="signal-name">{s.name}</div>
              <div className="signal-ex">{s.ex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-label">// pricing</div>
        <div className="pricing-grid">

          {/* OPERATOR */}
          <div className="pricing-card pricing-operator">
            <div className="pricing-role">OPERATOR</div>
            <div className="pricing-sub">contribute signals · earn credits</div>
            <div className="pricing-divider">────────────────────────</div>
            <div className="pricing-earn-label">earn up to</div>
            <div className="pricing-big">$75.00<span className="pricing-unit"> / signal</span></div>
            <div className="pricing-calc">
              <span className="pricing-calc-op">1,000 signals</span>
              <span className="pricing-calc-arrow"> ──► </span>
              <span className="pricing-calc-result op-result">$75,000 earned</span>
            </div>
            <div className="pricing-divider">────────────────────────</div>
            <div className="pricing-perks">
              <div className="pricing-perk">◈ validated signals only</div>
              <div className="pricing-perk">◈ quality score → higher rate</div>
              <div className="pricing-perk">◈ reputation builds over time</div>
              <div className="pricing-perk">◈ any source: TG · Reddit · UW · your own</div>
            </div>
          </div>

          {/* CONSUMER */}
          <div className="pricing-card pricing-consumer">
            <div className="pricing-role">CONSUMER</div>
            <div className="pricing-sub">buy intent signals · pipe to your stack</div>
            <div className="pricing-divider">────────────────────────</div>

            <div className="pricing-tier">
              <div className="pricing-tier-name">☁ CLOUD · PAY-AS-YOU-GO</div>
              <div className="pricing-free-banner">FREE TIER · 1,000 signals / mo</div>
              <div className="pricing-big">$0.00000027<span className="pricing-unit"> / signal</span></div>
              <div className="pricing-calc">
                <span className="pricing-calc-op">1,000 signals</span>
                <span className="pricing-calc-arrow"> ──► </span>
                <span className="pricing-calc-result con-result">$0.27</span>
              </div>
              <div className="pricing-note">yes, twenty-seven cents for a thousand leads</div>
            </div>

            <div className="pricing-divider">────────────────────────</div>

            <div className="pricing-tier">
              <div className="pricing-tier-name">⬡ SELF-HOSTED · OPEN SOURCE</div>
              <div className="pricing-free-banner pricing-free-forever">FREE FOREVER</div>
              <div className="pricing-oss-desc">
                Run on your own infra. Full source available.<br />
                <span className="pricing-caveat">
                  ⚠ you'll need: enrichment credits · rotating proxies ·
                  captcha solvers · scraping infra · maintenance — the stuff
                  LeadRadar cloud handles for you.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="waitlist">
        <div className="cta-box">
          <div className="cta-headline">Get signals no one else has.</div>
          <div className="cta-sub">
            First 100 get founding contributor status + 10,000 free credits.
          </div>
          <div className="cta-input-row">
            <input className="cta-input" type="email" placeholder="your@email.com" />
            <a href="#" className="btn-cta">→ join</a>
          </div>
          <div className="cta-note">no spam · no credit card · open marketplace</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LeadRadarLogo height={30} />
          <span>· v0.1 early access</span>
        </div>
        <div>built in public · open marketplace · crowd-sourced</div>
      </footer>
    </>
  )
}
