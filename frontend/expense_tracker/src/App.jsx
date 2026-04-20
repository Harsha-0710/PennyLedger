import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import DashboardPage from './components/DashboardPage'
import AddExpensePage from './components/AddExpensePage'
import AnalyticsPage from './components/AnalyticsPage'
import SettingsPage from './components/SettingsPage'
import './styles/Layout.css'
import './App.css'
import CategoryChart from './components/CategoryChart'
import MonthlyChart from './components/MonthlyChart'
import VendorChart from './components/VendorChart'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token'))
  )

  const handleAuthSuccess = (token) => {
    if (typeof token === 'string' && token.length > 0) {
      localStorage.setItem('token', token)
    }
    setIsAuthenticated(true)
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return isAuthenticated ? (
      <BrowserRouter>
        <div className="dashboard-shell">
          <Sidebar onSignOut={handleSignOut} />
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/category" element={<CategoryChart />} />
            <Route path="/analytics/monthly" element={<MonthlyChart />} />
            <Route path="/analytics/vendors" element={<VendorChart />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </BrowserRouter>
  ) : (
    <>
      <LandingPage onAuthSuccess={handleAuthSuccess} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  )
}

export default App
