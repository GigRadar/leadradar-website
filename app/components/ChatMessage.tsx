'use client'

import { useState, useEffect } from 'react'
import SignalTable from './SignalTable'
import ExportPanel from './ExportPanel'

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

interface UserMessageProps {
  type: 'user'
  text: string
}

interface AIMessageProps {
  type: 'ai'
  steps: string[]
  signals: Signal[]
  totalOlder: number
  onNewSearch: () => void
}

type ChatMessageProps = UserMessageProps | AIMessageProps

export default function ChatMessage(props: ChatMessageProps) {
  if (props.type === 'user') {
    return <UserMessage text={props.text} />
  }

  return <AIMessage {...props} />
}

function UserMessage({ text }: { text: string }) {
  // Split into words but preserve the spaces between them so the bubble
  // wraps naturally. Each word animates in with a small stagger so the
  // sentence settles into place gracefully — no typewriter, just a soft
  // reveal of text the user already typed.
  const words = text.split(/(\s+)/)
  return (
    <div className="chat-msg chat-msg-user">
      <div className="chat-msg-label">// your query</div>
      <div className="chat-msg-bubble chat-msg-bubble-user">
        {words.map((w, i) =>
          /^\s+$/.test(w) ? (
            <span key={i}>{w}</span>
          ) : (
            <span
              key={i}
              className="chat-word"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              {w}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function AIMessage({ steps, signals, totalOlder, onNewSearch }: Omit<AIMessageProps, 'type'>) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [showTable, setShowTable] = useState(false)

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const delay = visibleSteps === 0 ? 300 : 500 + Math.random() * 400
      const timer = setTimeout(() => setVisibleSteps(v => v + 1), delay)
      return () => clearTimeout(timer)
    } else if (steps.length > 0 && !showTable) {
      const timer = setTimeout(() => setShowTable(true), 600)
      return () => clearTimeout(timer)
    }
  }, [visibleSteps, steps.length, showTable])

  return (
    <div className="chat-msg chat-msg-ai">
      <div className="chat-msg-label">// leadradar</div>
      <div className="chat-msg-bubble chat-msg-bubble-ai">
        {/* Thinking steps */}
        <div className="chat-steps">
          {steps.slice(0, visibleSteps).map((step, i) => (
            <div className="chat-step" key={i}>
              <span className="chat-step-check">{i < visibleSteps - 1 || showTable ? '✓' : '·'}</span>
              <span className="chat-step-text">{step}</span>
            </div>
          ))}
          {visibleSteps < steps.length && (
            <div className="chat-step chat-step-loading">
              <span className="chat-step-dots">···</span>
            </div>
          )}
        </div>

        {/* Results */}
        {showTable && (
          <div className="chat-results">
            <div className="chat-results-header">
              <span className="chat-results-count">{signals.length} signals found</span>
              <span className="chat-results-window">last 7 days</span>
            </div>
            <div className="chat-results-grid">
              <div className="chat-results-table">
                <SignalTable signals={signals} totalOlder={totalOlder} />
              </div>
              <ExportPanel onNewSearch={onNewSearch} signalCount={signals.length} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
