'use client'

import { useState } from 'react'

interface ExportPanelProps {
  onNewSearch: () => void
  signalCount: number
}

export default function ExportPanel({ onNewSearch, signalCount }: ExportPanelProps) {
  const [watchEnabled, setWatchEnabled] = useState(false)
  const [showExport, setShowExport] = useState(false)

  return (
    <div className="export-panel">
      {/* New Search */}
      <button className="export-btn export-btn-primary" onClick={onNewSearch}>
        + new search
      </button>

      {/* Export */}
      <div className="export-group">
        <button className="export-btn" onClick={() => setShowExport(!showExport)}>
          {showExport ? '- export' : '+ export'} <span className="export-count">{signalCount} signals</span>
        </button>
        {showExport && (
          <div className="export-dropdown">
            <button className="export-option" onClick={() => alert('Sign up to export to Clay')}>
              <img className="export-icon" src="https://www.google.com/s2/favicons?domain=clay.com&sz=32" alt="Clay" />
              Export to Clay
            </button>
            <button className="export-option" onClick={() => alert('Sign up to download CSV')}>
              <span className="export-icon-text">[csv]</span>
              Download CSV
            </button>
            <button className="export-option" onClick={() => alert('Sign up to send to Webhook')}>
              <span className="export-icon-text">[api]</span>
              Send to Webhook
            </button>
            <button className="export-option" onClick={() => alert('Sign up to connect Zapier')}>
              <img className="export-icon" src="https://www.google.com/s2/favicons?domain=zapier.com&sz=32" alt="Zapier" />
              Zapier / Make
            </button>
            <div className="export-signup-hint">
              sign up free to enable exports
            </div>
          </div>
        )}
      </div>

      {/* Watch */}
      <div className="export-group">
        <button
          className={`export-btn export-btn-watch${watchEnabled ? ' active' : ''}`}
          onClick={() => setWatchEnabled(!watchEnabled)}
        >
          <span className="watch-eye">{watchEnabled ? '◉' : '◎'}</span>
          watch — real-time signals
        </button>
        {watchEnabled && (
          <div className="watch-paywall">
            <div className="watch-paywall-text">
              // real-time monitoring requires a subscription
            </div>
            <div className="watch-tiers">
              <span className="watch-tier">1K signals · $27/mo</span>
              <span className="watch-tier">10K signals · $243/mo</span>
              <span className="watch-tier watch-tier-hot">custom · contact us</span>
            </div>
            <a href="#waitlist" className="export-btn export-btn-primary" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              sign up to subscribe →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
