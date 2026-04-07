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
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) return
    setTyped('')
    setDone(false)
    // Time-based typewriter: each tick computes how many chars should
    // be visible based on real elapsed time, so the animation stays
    // accurate even when the browser throttles timers (e.g. hidden tab
    // → setInterval pinned to ~1Hz). setInterval is used instead of
    // requestAnimationFrame because rAF is fully suspended in hidden
    // tabs, while setInterval still fires (slowly).
    const duration = Math.min(900, Math.max(220, text.length * 28))
    const start = Date.now()
    const tick = () => {
      const ratio = Math.min(1, (Date.now() - start) / duration)
      const count = Math.floor(text.length * ratio)
      setTyped(text.slice(0, count))
      if (ratio >= 1) {
        clearInterval(id)
        setTyped(text)
        setDone(true)
      }
    }
    const id = setInterval(tick, 18)
    return () => clearInterval(id)
  }, [text])

  return (
    <div className="chat-msg chat-msg-user">
      <div className="chat-msg-label">// your query</div>
      <div className="chat-msg-bubble chat-msg-bubble-user">
        {typed}
        <span className={`chat-msg-caret${done ? ' is-done' : ''}`}>▍</span>
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
