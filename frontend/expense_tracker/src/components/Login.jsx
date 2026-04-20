import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Loader from './Loader'
import '../styles/AuthForms.css'

export default function Login({ onBack, onSwitchToSignUp, onAuthSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();

  if (Object.keys(newErrors).length !== 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("https://pennylegder.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess(data.idToken || true)
    }

    toast.success("Login successful! Redirecting to dashboard...")

    setEmail("");
    setPassword("");

  } catch (err) {
    toast.error(err.message)
    setErrors({ general: err.message });
  } finally {
    setIsLoading(false);
  }
};

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="auth-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="auth-container">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>

        <motion.div
          className="auth-form-wrapper"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="auth-header">
            <img src="/logo.png" alt="MyPennyLedger Logo" className="auth-logo" />
            <h1>Welcome Back!</h1>
            <p>Login to your account to continue</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div variants={itemVariants} className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </motion.div>

            <motion.div variants={itemVariants} className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </motion.div>

            <motion.div variants={itemVariants} className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot Password?</a>
            </motion.div>

            <motion.button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
              variants={itemVariants}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? <Loader /> : 'Login'}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="auth-footer">
            <p>
              Don't have an account?{' '}
              <a
                href="#signup"
                className="auth-link"
                onClick={(e) => {
                  e.preventDefault()
                  if (onSwitchToSignUp) onSwitchToSignUp()
                }}
              >
                Sign up here
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="auth-illustration"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="illustration-circle circle-1"></div>
          <div className="illustration-circle circle-2"></div>
          <div className="illustration-text">🔐</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
