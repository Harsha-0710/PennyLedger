import { useState } from 'react'
import { motion } from 'framer-motion'
import Login from './Login'
import SignUp from './SignUp'
import '../styles/LandingPage.css'

export default function LandingPage({ onAuthSuccess }) {
  const [currentView, setCurrentView] = useState('home') // home, login, signup

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2 }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.4 }
    },
    hover: { scale: 1.05 }
  }

  if (currentView === 'login') {
    return (
      <Login
        onBack={() => setCurrentView('home')}
        onSwitchToSignUp={() => setCurrentView('signup')}
        onAuthSuccess={onAuthSuccess}
      />
    )
  }

  if (currentView === 'signup') {
    return (
      <SignUp
        onBack={() => setCurrentView('home')}
        onSwitchToLogin={() => setCurrentView('login')}
        onAuthSuccess={onAuthSuccess}
      />
    )
  }

  return (
    <motion.div
      className="landing-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Navigation Bar */}
      <nav className="navbar">
        <motion.div
          className="navbar-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/logo.png" alt="MyPennyLedger Logo" className="navbar-logo" />
          <span className="brand-text">MyPennyLedger</span>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="hero-title"
            variants={textVariants}
          >
            Take Control of Your Finances
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            variants={textVariants}
          >
            Track, manage, and optimize your expenses with ease. Get real-time insights into your spending habits and reach your financial goals faster.
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              className="btn btn-primary"
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => setCurrentView('signup')}
            >
              Get Started Free
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              variants={buttonVariants}
              whileHover="hover"
              onClick={() => setCurrentView('login')}
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Illustration Area */}
        <motion.div
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="floating-card card-1">
            <div className="card-emoji">📊</div>
            <p>Analytics</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-emoji">💸</div>
            <p>Budget</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-emoji">📈</div>
            <p>Growth</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Choose MyPennyLedger?
        </motion.h2>

        <div className="features-grid">
          {[
            { icon: '🎯', title: 'Easy Tracking', desc: 'Log expenses in seconds' },
            { icon: '📊', title: 'Smart Analytics', desc: 'Visualize your spending patterns' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is protected' },
            { icon: '📱', title: 'Multi-Device', desc: 'Access anywhere, anytime' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 MyPennyLedger. All rights reserved.</p>
      </footer>
    </motion.div>
  )
}
