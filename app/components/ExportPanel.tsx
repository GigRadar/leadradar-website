'use client'

import { useState } from 'react'

interface ExportPanelProps {
  onNewSearch: () => void
  signalCount: number
}

export default function ExportPanel({ onNewSearch, signalCount }: ExportPanelProps) {
  const [watchEnabled, setWatchEnabled] = useState(false)

  const exportLocked = (target: string) => () => alert(`Sign up free to export to ${target}`)

  return (
    <aside className="actions-panel">
      <button className="action-btn action-btn-primary" onClick={onNewSearch}>
        <span className="action-icon">+</span>
        <span className="action-label">new search</span>
      </button>

      <button
        className={`action-btn action-btn-watch${watchEnabled ? ' is-active' : ''}`}
        onClick={() => setWatchEnabled(!watchEnabled)}
      >
        <span className="action-icon">{watchEnabled ? '◉' : '◎'}</span>
        <span className="action-label">watch live</span>
      </button>

      {watchEnabled && (
        <div className="watch-paywall">
          <div className="watch-paywall-text">
            // real-time monitoring requires a subscription
          </div>
          <div className="watch-tiers">
            <span className="watch-tier">1K · $27/mo</span>
            <span className="watch-tier">10K · $243/mo</span>
            <span className="watch-tier watch-tier-hot">custom</span>
          </div>
          <a href="#waitlist" className="action-btn action-btn-primary action-btn-cta">
            <span className="action-label">sign up to subscribe →</span>
          </a>
        </div>
      )}

      <div className="action-section-label">
        // export · {signalCount} signals
      </div>

      <button className="action-btn" onClick={exportLocked('Clay')}>
        <img className="action-favicon" src="https://www.google.com/s2/favicons?domain=clay.com&sz=32" alt="" />
        <span className="action-label">Clay</span>
      </button>
      <button className="action-btn" onClick={exportLocked('CSV')}>
        <svg className="action-svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
          <line x1="2" y1="6.5" x2="14" y2="6.5" />
          <line x1="2" y1="10" x2="14" y2="10" />
          <line x1="6.5" y1="2.5" x2="6.5" y2="13.5" />
          <line x1="10.5" y1="2.5" x2="10.5" y2="13.5" />
        </svg>
        <span className="action-label">CSV</span>
      </button>
      <button className="action-btn" onClick={exportLocked('Webhook')}>
        <svg className="action-svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 9.5L9.5 6.5" />
          <path d="M9 4.5l1-1a2.8 2.8 0 0 1 4 4l-1 1" />
          <path d="M7 11.5l-1 1a2.8 2.8 0 0 1-4-4l1-1" />
        </svg>
        <span className="action-label">Webhook</span>
      </button>
      <button className="action-btn" onClick={exportLocked('Zapier / Make')}>
        <img className="action-favicon" src="https://www.google.com/s2/favicons?domain=zapier.com&sz=32" alt="" />
        <span className="action-label">Zapier / Make</span>
      </button>

      <div className="action-hint">sign up free to enable →</div>
    </aside>
  )
}
