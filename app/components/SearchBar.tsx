'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  variant: 'hero' | 'chat'
  onSubmit?: (query: string) => void
  autoFocus?: boolean
  disabled?: boolean
  placeholder?: string
}

const PLACEHOLDER = 'SaaS companies looking for sales automation tools...'

export default function SearchBar({ variant, onSubmit, autoFocus, disabled, placeholder }: SearchBarProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q || disabled) return

    if (onSubmit) {
      onSubmit(q)
      setValue('')
    } else {
      // Hero mode: navigate to search page
      router.push('/search?q=' + encodeURIComponent(q))
    }
  }

  return (
    <form className={`search-bar search-bar-${variant}`} onSubmit={handleSubmit}>
      <span className="search-bar-prompt">&gt;_</span>
      <input
        ref={inputRef}
        className="search-bar-input"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder || PLACEHOLDER}
        disabled={disabled}
      />
      <button className="search-bar-submit" type="submit" disabled={disabled || !value.trim()}>
        {variant === 'hero' ? 'search signals →' : '→'}
      </button>
    </form>
  )
}
