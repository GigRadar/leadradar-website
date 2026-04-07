'use client'

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

interface SignalTableProps {
  signals: Signal[]
  totalOlder: number
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

function isWithin7Days(iso: string): boolean {
  const now = Date.now()
  const then = new Date(iso).getTime()
  return (now - then) < 7 * 24 * 60 * 60 * 1000
}

function daysAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function formatTotal(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

function SignalRow({ s, locked = false }: { s: Signal; locked?: boolean }) {
  return (
    <div className={`sig-row${locked ? ' sig-row-locked' : ''}`}>
      <span className="sig-cell sig-col-date">
        <span className="sig-date">{formatDate(s.date)}</span>
        <span className="sig-days-ago">{daysAgo(s.date)}</span>
      </span>
      <span className="sig-cell sig-col-source">
        {s.source.anonymous ? (
          <>
            <span className="sig-anon-icon">[?]</span>
            <span className="sig-source-name sig-anon">anonymous</span>
          </>
        ) : (
          <>
            <img className="sig-source-logo" src={s.source.logo!} alt={s.source.name} />
            <span className="sig-source-name">{s.source.name}</span>
          </>
        )}
      </span>
      <span className="sig-cell sig-col-signal">
        <span className="sig-pill">
          <span className="sig-pill-icon">⚡</span>
          <span className="sig-pill-text">{s.description}</span>
          {s.verified && <span className="sig-pill-check" title="Verified">✓</span>}
        </span>
        {s.extraCount > 0 && (
          <span className="sig-pill-more">+{s.extraCount} more</span>
        )}
      </span>
      <span className="sig-cell sig-col-name">
        <span className="sig-blur-wrap">
          <img className="sig-avatar" src={s.person.avatar} alt="" />
          <span className="sig-blur-text">{s.person.name}</span>
        </span>
      </span>
      <span className="sig-cell sig-col-company">
        <span className="sig-blur-wrap">
          <img className="sig-company-logo" src={s.company.logo} alt="" />
          <span className="sig-blur-text">{s.company.name}</span>
        </span>
      </span>
    </div>
  )
}

export default function SignalTable({ signals, totalOlder }: SignalTableProps) {
  const recentSignals = signals.filter(s => isWithin7Days(s.date))
  const olderSignals = signals.filter(s => !isWithin7Days(s.date))
  const lockedPreview = olderSignals.slice(0, 4)

  return (
    <div className="sig-table-wrap">
      <div className="sig-table">
        {/* Header */}
        <div className="sig-row sig-header">
          <span className="sig-cell sig-col-date">
            <span className="sig-h-icon">◷</span>
            <span>date</span>
          </span>
          <span className="sig-cell sig-col-source">
            <span className="sig-h-icon">⊡</span>
            <span>source</span>
          </span>
          <span className="sig-cell sig-col-signal">
            <span className="sig-h-icon">⚡</span>
            <span>signal</span>
          </span>
          <span className="sig-cell sig-col-name">
            <span className="sig-h-icon">◉</span>
            <span>name</span>
          </span>
          <span className="sig-cell sig-col-company">
            <span className="sig-h-icon">⌬</span>
            <span>company</span>
          </span>
        </div>

        {/* Recent signals (within 7 days) */}
        {recentSignals.map((s) => (
          <SignalRow key={s.id} s={s} />
        ))}

        {/* 7-day cutoff chip */}
        {olderSignals.length > 0 && (
          <div className="sig-cutoff">
            <span className="sig-cutoff-line" />
            <span className="sig-cutoff-chip">
              <span className="sig-cutoff-lock">⌬</span>
              <span>7-day preview</span>
              <span className="sig-cutoff-sep">·</span>
              <a href="#waitlist" className="sig-cutoff-link">unlock {formatTotal(totalOlder)}+ older</a>
            </span>
            <span className="sig-cutoff-line" />
          </div>
        )}

        {/* Older signals — fade-masked pile + overlay CTA */}
        {lockedPreview.length > 0 && (
          <div className="sig-locked-pile">
            <div className="sig-locked-fade">
              {lockedPreview.map((s) => (
                <SignalRow key={s.id} s={s} locked />
              ))}
            </div>
            <div className="sig-locked-overlay">
              <span className="sig-locked-badge">
                +{formatTotal(totalOlder)} more leads found
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
