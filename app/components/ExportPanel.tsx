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
        <span className="action-icon-text">[csv]</span>
        <span className="action-label">CSV</span>
      </button>
      <button className="action-btn" onClick={exportLocked('Webhook')}>
        <span className="action-icon-text">[api]</span>
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
