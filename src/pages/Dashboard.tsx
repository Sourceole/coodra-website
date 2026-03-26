import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, exchangeForBackendJwt } from '../lib/supabase'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.coodra.com'

const QUICK_CHIPS = [
  'What should I reorder this week?',
  'How are my margins looking?',
  'Any stockout risks?',
  'Top movers this month',
  'Slow-moving inventory',
]

interface BackendUser {
  email: string
  firstName: string
  businessName: string
  merchantKey: string
  planCode: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [backendJwt, setBackendJwt] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, chatLoading])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const jwt = await exchangeForBackendJwt()
      if (jwt) {
        setBackendJwt(jwt.token)
        sessionStorage.setItem('backend_jwt', jwt.token)
        sessionStorage.setItem('backend_jwt_exp', String(jwt.exp))
      }

      const user = session.user
      setBackendUser({
        email: user.email || '',
        firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
        businessName: user.user_metadata?.business_name || user.email?.split('@')[0] || '',
        merchantKey: '',
        planCode: 'free',
      })

      setLoading(false)
    }

    init()
  }, [navigate])

  const sendMessage = async (e?: React.FormEvent, initialInput?: string) => {
    e?.preventDefault()
    const text = (initialInput ?? input).trim()
    if (!text || chatLoading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setChatLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendJwt}`,
          'x-user-email': backendUser?.email || '',
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!res.ok) throw new Error('Chat request failed')
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding right now."
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble responding right now. Please try again." }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem('backend_jwt')
    sessionStorage.removeItem('backend_jwt_exp')
    navigate('/login')
  }

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>
  }

  return (
    <div className="dashboard" data-theme={theme}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <a className="sidebar-brand" href="/" aria-label="Coodra home">
          <img
            src="/images/coodra-logo.png"
            alt="Coodra"
            style={{ height: 44, width: 'auto', display: 'block' }}
          />
        </a>

        <button className="sidebar-new-chat" onClick={() => setMessages([])}>
          + New conversation
        </button>

        <div className="sidebar-user">
          <div className="user-info">
            <p className="user-name">{backendUser?.firstName || backendUser?.email}</p>
            <p className="user-business">{backendUser?.businessName}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-logo">COODRA</div>
              <h2>What's on your mind?</h2>
              <p>Ask me anything about your store — inventory, margins, Q4 planning, POS data.</p>
              <div className="quick-chips">
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip}
                    className="quick-chip"
                    onClick={() => sendMessage(undefined, chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message chat-message--${msg.role}`}>
                  <div className="message-content">
                    {msg.content.split('\n').map((line, j) => (
                      line.trim() ? <p key={j}>{line}</p> : null
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message chat-message--assistant">
                  <div className="message-content typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form className="chat-composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Coodra anything..."
            disabled={chatLoading}
            autoFocus
          />
          <button type="submit" disabled={chatLoading || !input.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  )
}
