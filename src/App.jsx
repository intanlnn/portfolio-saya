import { useState } from 'react'
import Cursor from './components/Cursor.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import HeroSection from './components/HeroSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import ProjectsSection from './components/ProjectsSection.jsx'
import SkillsSection from './components/SkillsSection.jsx'
import ExperienceSection from './components/AchievementsSection .jsx'
import ContactSection from './components/ContactSection.jsx'
import OrbitNav from './components/OrbitNav.jsx'
import CinematicReveal from './components/CinematicReveal.jsx'

export default function App() {
  const [showCinematic, setShowCinematic] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [revealDone, setRevealDone] = useState(false)

  const handleCardClick = () => {
    setShowCinematic(true)
  }

  const handleRevealComplete = () => {
    setShowCinematic(false)
    setRevealDone(true)
    setContentVisible(true)
    setTimeout(() => {
      const el = document.getElementById('about')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const handleNavigate = (section) => {
    const el = document.getElementById(section)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000' }}>
      <ParticleBackground />
      <Cursor />

      {showCinematic && <CinematicReveal onComplete={handleRevealComplete} />}

      {/* Hero — always visible */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection onCardClick={handleCardClick} photoSrc="/photo.png" />
      </div>

      {/* Main content — visible after card click or directly scrollable */}
      <div style={{
        position: 'relative', zIndex: 10,
        opacity: 1,
        transition: 'opacity 0.8s ease'
      }}>
        <AboutSection />

        {/* Divider */}
        <div style={{
          height: 1, margin: '0 5%',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(99,102,241,0.3), transparent)'
        }} />

        <ProjectsSection />

        <div style={{
          height: 1, margin: '0 5%',
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)'
        }} />

        <SkillsSection />

        <div style={{
          height: 1, margin: '0 5%',
          background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)'
        }} />

        <ExperienceSection />

        <div style={{
          height: 1, margin: '0 5%',
          background: 'linear-gradient(90deg, transparent, rgba(232,121,249,0.3), transparent)'
        }} />

        <ContactSection />
      </div>

      <OrbitNav onNavigate={handleNavigate} />
    </div>
  )
}
