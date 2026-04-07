'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LeadRadarLogo from '../components/LeadRadarLogo'
import SearchBar from '../components/SearchBar'
import ChatMessage from '../components/ChatMessage'

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

interface Message {
  id: string
  type: 'user' | 'ai'
  text?: string
  steps?: string[]
  signals?: Signal[]
  totalOlder?: number
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [searchCount, setSearchCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialQueryHandled = useRef(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial query from URL
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !initialQueryHandled.current) {
      initialQueryHandled.current = true
      handleSearch(q)
    }
  }, [searchParams])

  const handleSearch = async (query: string) => {
    if (isSearching) return
    if (searchCount >= 5) {
      alert('Free users can run 5 searches. Sign up to continue.')
      return
    }

    setIsSearching(true)
    setSearchCount(c => c + 1)

    // Add user message
    const userMsg: Message = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      text: query,
    }
    setMessages(prev => [...prev, userMsg])

    // Add placeholder AI message
    const aiMsgId = `msg_${Date.now()}_ai`
    const placeholderAi: Message = {
      id: aiMsgId,
      type: 'ai',
      steps: [],
      signals: [],
      totalOlder: 0,
    }
    setMessages(prev => [...prev, placeholderAi])

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()

      // Update AI message with real data
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, steps: data.steps, signals: data.signals, totalOlder: data.total }
          : m
      ))
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, steps: ['// error: failed to search. try again.'], signals: [], totalOlder: 0 }
          : m
      ))
    } finally {
      setIsSearching(false)
    }
  }

  const handleNewSearch = () => {
    const input = document.querySelector('.search-bar-input') as HTMLInputElement
    input?.focus()
  }

  return (
    <div className="search-page">
      {/* Nav */}
      <nav className="search-nav">
        <a href="/" className="nav-logo"><LeadRadarLogo height={24} /></a>
        <div className="search-nav-right">
          <span className="search-nav-count">{searchCount}/5 searches</span>
          <button className="theme-toggle" onClick={toggleTheme}>[☀ / ☾]</button>
        </div>
      </nav>

      {/* Chat area */}
      <div className="search-chat">
        {messages.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">◈</div>
            <div className="search-empty-text">describe your ideal customer profile</div>
            <div className="search-empty-hint">// the more detail, the better the signals</div>
          </div>
        )}

        {messages.map(msg => (
          msg.type === 'user' ? (
            <ChatMessage key={msg.id} type="user" text={msg.text!} />
          ) : (
            <ChatMessage
              key={msg.id}
              type="ai"
              steps={msg.steps || []}
              signals={msg.signals || []}
              totalOlder={msg.totalOlder || 0}
              onNewSearch={handleNewSearch}
            />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="search-input-bar">
        <SearchBar
          variant="chat"
          onSubmit={handleSearch}
          autoFocus={!searchParams.get('q')}
          disabled={isSearching}
          placeholder="Describe your ICP — e.g. 'B2B SaaS companies hiring SDRs'"
        />
        <div className="search-input-hint">
          {isSearching ? '// searching...' : `// ${5 - searchCount} searches remaining · free tier · 100 signals`}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="search-page">
        <div className="search-empty">
          <div className="search-empty-icon">◈</div>
          <div className="search-empty-text">loading...</div>
        </div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
