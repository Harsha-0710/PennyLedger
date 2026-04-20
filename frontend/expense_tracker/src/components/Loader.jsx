import { motion } from 'framer-motion'
import '../styles/Loader.css'

export default function Loader({ fullScreen = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  const dotVariants = {
    animate: (index) => ({
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: index * 0.15
      }
    })
  }

  if (fullScreen) {
    return (
      <motion.div
        className="loader-fullscreen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="loader-content">
          <motion.div
            className="loader-spinner"
            variants={spinVariants}
            animate="animate"
          >
            <div className="spinner-ring"></div>
          </motion.div>
          <p className="loader-text">Loading...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="loader-inline">
      <motion.div
        className="loader-dots"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="loader-dot"
            custom={index}
            variants={dotVariants}
            animate="animate"
          />
        ))}
      </motion.div>
    </div>
  )
}
