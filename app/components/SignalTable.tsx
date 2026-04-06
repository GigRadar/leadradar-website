'use client'

interface Signal {
  id: string
  date: string
  source: { name: string; logo: string | null; anonymous: boolean }
  description: string
  verified: boolean
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

export default function SignalTable({ signals, totalOlder }: SignalTableProps) {
  const recentSignals = signals.filter(s => isWithin7Days(s.date))
  const olderSignals = signals.filter(s => !isWithin7Days(s.date))

  return (
    <div className="sig-table-wrap">
      <div className="sig-table">
        {/* Header */}
        <div className="sig-row sig-header">
          <span className="sig-cell sig-col-date">// date</span>
          <span className="sig-cell sig-col-source">// source</span>
          <span className="sig-cell sig-col-signal">// signal</span>
          <span className="sig-cell sig-col-name">// name</span>
          <span className="sig-cell sig-col-company">// company</span>
        </div>

        {/* Recent signals (within 7 days) */}
        {recentSignals.map((s) => (
          <div className="sig-row" key={s.id}>
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
              <span className="sig-desc">{s.description}</span>
              {s.verified && <span className="sig-verified" title="Verified signal">&#x2705;</span>}
            </span>
            <span className="sig-cell sig-col-name sig-blurred">
              <img className="sig-avatar" src={s.person.avatar} alt="" />
              <span>{s.person.name}</span>
            </span>
            <span className="sig-cell sig-col-company sig-blurred">
              <img className="sig-company-logo" src={s.company.logo} alt="" />
              <span>{s.company.name}</span>
            </span>
          </div>
        ))}

        {/* 7-day cutoff banner */}
        {olderSignals.length > 0 && (
          <div className="sig-cutoff">
            <span className="sig-cutoff-line" />
            <span className="sig-cutoff-text">
              7-day preview limit · <a href="#waitlist" className="sig-cutoff-link">sign up free</a> to unlock {totalOlder}+ older signals
            </span>
            <span className="sig-cutoff-line" />
          </div>
        )}

        {/* Older signals (blurred/locked) */}
        {olderSignals.slice(0, 3).map((s) => (
          <div className="sig-row sig-row-locked" key={s.id}>
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
            <span className="sig-cell sig-col-signal sig-blurred">
              <span className="sig-desc">{s.description}</span>
            </span>
            <span className="sig-cell sig-col-name sig-blurred">
              <img className="sig-avatar" src={s.person.avatar} alt="" />
              <span>{s.person.name}</span>
            </span>
            <span className="sig-cell sig-col-company sig-blurred">
              <img className="sig-company-logo" src={s.company.logo} alt="" />
              <span>{s.company.name}</span>
            </span>
          </div>
        ))}

        {olderSignals.length > 3 && (
          <div className="sig-row-more">
            + {totalOlder - 3} more signals hidden · <a href="#waitlist" className="sig-cutoff-link">sign up to reveal</a>
          </div>
        )}
      </div>
    </div>
  )
}
