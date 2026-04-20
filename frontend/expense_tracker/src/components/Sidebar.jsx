import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'add-expense', label: 'Add Expense' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' }
]

const renderIcon = (id) => {
  switch (id) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16H9V20H4V16Z" fill="currentColor" />
          <path d="M10 10H15V20H10V10Z" fill="currentColor" />
          <path d="M16 4H21V20H16V4Z" fill="currentColor" />
        </svg>
      )
    case 'add-expense':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15H9V19H5V15Z" fill="currentColor" />
          <path d="M10 10H14V19H10V10Z" fill="currentColor" />
          <path d="M15 7H19V19H15V7Z" fill="currentColor" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" />
          <path d="M19.4 15C19.4 14.4 19.3 13.8 19.1 13.2L21 11.6L19.1 9.4L16.9 10.3C16.4 9.8 15.8 9.5 15.1 9.2L14.6 7H9.4L8.9 9.2C8.2 9.5 7.6 9.8 7.1 10.3L4.9 9.4L3 11.6L4.9 13.2C4.7 13.8 4.6 14.4 4.6 15C4.6 15.6 4.7 16.2 4.9 16.8L3 18.4L4.9 20.6L7.1 19.7C7.6 20.2 8.2 20.5 8.9 20.8L9.4 23H14.6L15.1 20.8C15.8 20.5 16.4 20.2 16.9 19.7L19.1 20.6L21 18.4L19.1 16.8C19.3 16.2 19.4 15.6 19.4 15Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ onSignOut }) {
  const [activeItem, setActiveItem] = useState('dashboard')
  const navigate = useNavigate()

  const handleSelect = (itemId) => {
    setActiveItem(itemId)
    navigate(`/${itemId}`)
  }

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <img src="/logo.png" alt="MyPennyLedger Logo" className="logo-image" />
        </div>
        <div>
          <h2>MyPennyLedger</h2>
          <p>Smart money manager</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-link ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => handleSelect(item.id)}
          >
            <span className="sidebar-icon">{renderIcon(item.id)}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-signout" onClick={onSignOut}>
          <span className="sidebar-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
