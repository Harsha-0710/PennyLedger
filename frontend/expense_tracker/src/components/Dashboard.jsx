import { useState } from 'react'
import { toast } from 'react-toastify'
import Sidebar from './Sidebar'
import '../styles/Dashboard.css'

const pageContent = {
  dashboard: {
    title: 'Overview',
    subtitle: 'Your financial snapshot at a glance.',
    metric: [
      { label: 'Monthly Spend', value: '$2,540' },
      { label: 'Savings Rate', value: '24%' },
      { label: 'Open Bills', value: '3' }
    ]
  },
  'add-expense': {
    title: 'Add Expense',
    subtitle: 'Log a new purchase or bill.',
    fields: ['Title', 'Category', 'Amount', 'Date', 'Notes']
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Track your spending and trends.',
    charts: ['Spending by Category', 'Monthly Comparison', 'Top Vendors']
  },
  settings: {
    title: 'Settings',
    subtitle: 'Update your preferences and profile.',
    settings: ['Profile', 'Notifications', 'Security']
  }
}

export default function Dashboard({ onSignOut }) {
  const [selectedPage, setSelectedPage] = useState('dashboard')
  const [expense, setExpense] = useState({
    title: '',
    category: 'Business',
    otherCategory: '',
    amount: '',
    date: '',
    notes: ''
  })

  const categories = ['Business', 'Food', 'Travel', 'Utilities', 'Entertainment', 'Other']

  const displayCategory =
    expense.category === 'Other' && expense.otherCategory
      ? expense.otherCategory
      : expense.category

  const handleSignOut = () => {
    if (typeof onSignOut === 'function') {
      onSignOut()
    }
    toast.info('Signed out successfully.')
  }

  const handleExpenseChange = (field) => (event) => {
    setExpense((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSaveExpense = () => {
    toast.success('Expense added successfully.')
    setExpense({
      title: '',
      category: 'Business',
      otherCategory: '',
      amount: '',
      date: '',
      notes: ''
    })
  }

  const activePage = pageContent[selectedPage]

  return (
    <div className="dashboard-shell">
      <Sidebar onSelect={setSelectedPage} onSignOut={handleSignOut} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-welcome">Welcome back, Alex</p>
            <h1>{activePage.title}</h1>
            <p className="dashboard-subtitle">{activePage.subtitle}</p>
          </div>
          <div className="dashboard-status">
            <span>Today</span>
            <strong>April 20, 2026</strong>
          </div>
        </header>

        {selectedPage === 'dashboard' && (
          <div className="dashboard-metrics">
            {activePage.metric.map((item) => (
              <div key={item.label} className="dashboard-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        )}

        {selectedPage === 'add-expense' && (
          <section className="dashboard-panel dashboard-expense-page">
            <div className="expense-layout">
              <div className="expense-form-panel">
                <div className="expense-section-heading">
                  <h2>Log a new expense</h2>
                  <p>Capture details for every transaction and keep your records organized.</p>
                </div>

                <div className="expense-grid">
                  <label className="form-field">
                    <span>Expense Title</span>
                    <input
                      type="text"
                      value={expense.title}
                      onChange={handleExpenseChange('title')}
                      placeholder="e.g. Office supplies"
                    />
                  </label>

                  <label className="form-field">
                    <span>Category</span>
                    <select value={expense.category} onChange={handleExpenseChange('category')}>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  {expense.category === 'Other' && (
                    <label className="form-field full-width">
                      <span>Specify category</span>
                      <input
                        type="text"
                        className="other-category-input"
                        value={expense.otherCategory}
                        onChange={handleExpenseChange('otherCategory')}
                        placeholder="Enter category name"
                      />
                    </label>
                  )}

                  <label className="form-field">
                    <span>Amount</span>
                    <div className="input-with-symbol">
                      <span>₹</span>
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={handleExpenseChange('amount')}
                        placeholder="0.00"
                      />
                    </div>
                  </label>

                  <label className="form-field">
                    <span>Date</span>
                    <input
                      type="date"
                      value={expense.date}
                      onChange={handleExpenseChange('date')}
                    />
                  </label>

                  <label className="form-field full-width">
                    <span>Notes</span>
                    <textarea
                      rows="5"
                      value={expense.notes}
                      onChange={handleExpenseChange('notes')}
                      placeholder="Add vendor, receipt details, or reminder"
                    />
                  </label>
                </div>

                <div className="expense-actions">
                  <button type="button" className="btn btn-primary" onClick={handleSaveExpense}>
                    Save Expense
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setExpense({
                        title: '',
                        category: 'Business',
                        otherCategory: '',
                        amount: '',
                        date: '',
                        notes: ''
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
              </div>

              <aside className="expense-summary-panel">
                <div className="summary-card">
                  <h3>Expense summary</h3>
                  <div className="summary-list">
                    <div>
                      <span>Title</span>
                      <strong>{expense.title || 'Not provided'}</strong>
                    </div>
                    <div>
                      <span>Category</span>
                      <strong>{displayCategory}</strong>
                    </div>
                    <div>
                      <span>Amount</span>
                      <strong>{expense.amount ? `$${expense.amount}` : '$0.00'}</strong>
                    </div>
                    <div>
                      <span>Date</span>
                      <strong>{expense.date || 'Choose a date'}</strong>
                    </div>
                    <div>
                      <span>Notes</span>
                      <strong>{expense.notes || 'No notes added'}</strong>
                    </div>
                  </div>
                </div>

                <div className="summary-card summary-tip">
                  <h3>Smart tips</h3>
                  <ul>
                    <li>Use categories to make monthly reviews easier.</li>
                    <li>Add notes for fast receipt matching.</li>
                    <li>Log expenses immediately after purchase.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </section>
        )}

        {selectedPage === 'analytics' && (
          <section className="dashboard-panel">
            <div className="analytics-list">
              {activePage.charts.map((chart) => (
                <div key={chart} className="analytics-card">
                  <h3>{chart}</h3>
                  <p>Insightful numbers and charts to help you spend smarter.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedPage === 'settings' && (
          <section className="dashboard-panel">
            <div className="settings-list">
              {activePage.settings.map((setting) => (
                <div key={setting} className="settings-card">
                  <h3>{setting}</h3>
                  <p>Manage your {setting.toLowerCase()} preferences.</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
