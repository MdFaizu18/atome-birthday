"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import confetti from "canvas-confetti"
import Image from "next/image"
import Anu from "../assets/image.jpeg"
// Seeded random for consistent values between server and client
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ============ CUSTOMIZABLE CONSTANTS ============
const BIRTHDAY_NAME = "Ms. Anu Varshini"
const PLACEHOLDER_IMAGE = Anu

const MESSAGES = {
  landing: "Hey Atomee... I made something for you",
  imageReveal: "Special day deserves a special picture",
  firstMessage: "Happy Birthday matti 🎂😂… seri seri, konjam decent ah solren.. un maari oru loosu, annoying, over scene potra person en life la vandhadhu romba rare. Aana honestly sollanum na, thanks for coming into my life… enna evlo torture pannalum, still you’re one of the best friends I got 🩵. Un polambal, un drama, un mokka ellam illa na life romba bore ayirukum.So yeah… matti ah irundhaalum, you’re my favourite matti 😌✨.Stay the same, don’t change… illati naan bore adichiduven 😤😂.Athe mari unnoda face ku selavu panratha faizu ku selavu panna unaku punniyama pogum 😭😂. Jokes apart… don’t overthink atome, everything happens for a reason.You are already blasting, keep rocking on 🤍.I am always there for you as a good friend.. whatever troubles you, you can reach me whenever you need me.Happy Borndayyy loosu !! 🎉💫",
  mainHighlight: "Happy Birthday Dikkuu",
  subHighlight: "You are really lucky to have me as your friend 😜",
  finalCelebration: `Pirantha Naal vazhthukal ${BIRTHDAY_NAME}`,
}

// Audio file must be in `public/` for Turbopack/Next to serve it by URL.
const AUDIO_SRC = "/audio.mp3"
// ================================================

// Particle System Component - uses seeded random for SSR consistency
function ParticleField({ count = 50, color = "rgba(255, 255, 255, 0.6)", seed = 42 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(seed + i) * 100,
      y: seededRandom(seed + i + 1000) * 100,
      size: seededRandom(seed + i + 2000) * 3 + 1,
      duration: seededRandom(seed + i + 3000) * 20 + 10,
      delay: seededRandom(seed + i + 4000) * 5,
    })),
    [count, seed]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Aurora Background Component
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[100px] opacity-50"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120, 119, 198, 0.3), transparent), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(255, 119, 198, 0.2), transparent)",
            "radial-gradient(ellipse 80% 50% at 80% 60%, rgba(120, 119, 198, 0.3), transparent), radial-gradient(ellipse 60% 50% at 20% 40%, rgba(255, 119, 198, 0.2), transparent)",
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(120, 119, 198, 0.3), transparent), radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 119, 198, 0.2), transparent)",
            "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120, 119, 198, 0.3), transparent), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(255, 119, 198, 0.2), transparent)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
    </div>
  )
}

// Morphing Blob Component
function MorphingBlob({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`absolute blur-3xl opacity-30 ${className}`}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

// Typewriter with Cursor
function Typewriter({
  text,
  className,
  onComplete,
  speed = 40
}: {
  text: string
  className?: string
  onComplete?: () => void
  speed?: number
}) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      const completeTimeout = setTimeout(onComplete, 500)
      return () => clearTimeout(completeTimeout)
    }
  }, [currentIndex, text, onComplete, speed])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <span className={className}>
      {displayText}
      <span
        className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
        style={{ opacity: showCursor ? 1 : 0 }}
      />
    </span>
  )
}

// Magnetic Button Component
function MagneticButton({
  children,
  onClick,
  variant = "primary"
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary" | "ghost"
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const variants = {
    primary: "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.4)]",
    secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20",
    ghost: "bg-transparent text-white/80 hover:text-white",
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={`relative px-8 py-4 rounded-full font-medium text-base overflow-hidden group transition-all duration-300 ${variants[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}

// Floating 3D Card
function FloatingCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Glowing Ring Animation
function GlowingRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-rose-500/30"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Step 0: Landing Screen
function LandingScreen({ onNext }: { onNext: () => void }) {
  const [showButton, setShowButton] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <AuroraBackground />
      <ParticleField count={80} color="rgba(244, 63, 94, 0.4)" />

      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none mix-blend-soft-light"
        style={{
          background: "radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <MorphingBlob className="w-96 h-96 bg-rose-500/20 -top-20 -left-20" />
      <MorphingBlob className="w-80 h-80 bg-pink-500/20 -bottom-20 -right-20" />

      <div className="text-center z-10 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight">
          <Typewriter text={MESSAGES.landing} onComplete={() => setShowButton(true)} speed={60} />
        </h1>

        <motion.p
          className="text-white/40 text-sm md:text-base mb-12 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ delay: 0.3 }}
        >
          A special surprise awaits
        </motion.p>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <MagneticButton onClick={onNext}>
                <span>Start  </span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.span>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </motion.div>
  )
}

// Step 1: Image Reveal with Parallax
function ImageRevealScreen({ onNext }: { onNext: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <AuroraBackground />
      <GlowingRings />

      {/* Floating decorative elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-rose-400/60"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 1.2, bounce: 0.3 }}
      >
        <FloatingCard className="mb-10">
          {/* Glow effect behind image */}
          <div className="absolute -inset-8 bg-gradient-to-r from-rose-500/40 via-pink-500/40 to-rose-500/40 rounded-full blur-2xl" />

          {/* Rotating border */}
          <motion.div
            className="absolute -inset-2 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative p-1 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-sm">
            <img
              src={PLACEHOLDER_IMAGE.src}
              alt="Special person"
              className="relative w-79 h-92 rounded-sm md:w-92 md:h-92 object-cover border-2 border-white/10"
            />
          </div>
        </FloatingCard>
      </motion.div>

      <motion.div
        className="text-center z-10 max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-4xl text-white font-light mb-4 tracking-tight">
          {MESSAGES.imageReveal}
        </h2>
        {/* <p className="text-white/50 text-sm mb-10">Scroll down or click to continue</p> */}

        <MagneticButton onClick={onNext} variant="secondary">
          <span>Last one...</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </MagneticButton>
      </motion.div>
    </motion.div>
  )
}

// Step 2: First Message with Glass Card
function FirstMessageScreen({ onNext }: { onNext: () => void }) {
  const [showButton, setShowButton] = useState(false)

  return (
    <motion.div
      className="py-8 min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      {/* Soft floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose-300/30 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-pink-300/30 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="relative z-10 max-w-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 1 }}
      >
        {/* Glass card */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          {/* Decorative corner */}
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <div className="text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-medium mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              A message for you ( Thalai eluthu )
            </motion.div>

            <p className="text-lg md:text-xl text-slate-700 font-light leading-relaxed">
              <Typewriter
                text={MESSAGES.firstMessage}
                onComplete={() => setShowButton(true)}
                speed={30}
              />
            </p>
          </div>
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" }}
            >
              <MagneticButton onClick={onNext}>
                <span>Innum iruku aluthuu</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// Step 3: Main Highlight with Dramatic Reveal
function MainHighlightScreen({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (revealed) {
      // Elegant confetti burst
      const duration = 4000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ["#f43f5e", "#ec4899", "#fbbf24", "#f472b6"],
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ["#f43f5e", "#ec4899", "#fbbf24", "#f472b6"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [revealed])

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AuroraBackground />

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="text-center z-10 max-w-3xl">
        {/* Big animated heart */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 blur-2xl bg-rose-500/40 rounded-full scale-150" />
            <svg className="w-24 h-24 md:w-32 md:h-32 text-rose-500 relative" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 50 }}
          transition={{ type: "spring", duration: 1, delay: 0.3 }}
          style={{
            textShadow: "0 0 80px rgba(244, 63, 94, 0.5)",
          }}
        >
          {MESSAGES.mainHighlight}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/80 font-light mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ delay: 0.8 }}
        >
          {MESSAGES.subHighlight}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ delay: 1.2 }}
        >
          <MagneticButton onClick={onNext}>
            <span>Next Click Pannu...</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.span>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Floating particles */}
      <ParticleField count={60} color="rgba(244, 63, 94, 0.5)" />
    </motion.div>
  )
}

// Step 4: Final Celebration
function FinalCelebrationScreen({ onReplay }: { onReplay: () => void }) {
  const playAudio = useCallback(() => {
    try {
      const audio = new Audio(AUDIO_SRC)
      // Some browsers return a Promise; keep failures silent.
      audio.play().catch(() => { })
    } catch {
      // Ignore audio playback issues (missing file, unsupported browser, etc.).
    }
  }, [])

  const triggerCelebration = useCallback(() => {
    // Massive celebration
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#f43f5e", "#ec4899", "#fbbf24", "#a855f7", "#3b82f6"],
      zIndex: 1000,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    // Side cannons
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors: ["#f43f5e", "#ec4899", "#fbbf24"],
      })
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors: ["#f43f5e", "#ec4899", "#fbbf24"],
      })
    }, 200)
  }, [])

  useEffect(() => {
    playAudio()
    triggerCelebration()
  }, [playAudio, triggerCelebration])

  // Celebratory elements
  const celebrationIcons = ["cake", "gift", "party", "balloon", "star"]

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgb(86, 70, 91) 0%,rgb(0, 0, 0) 50%,rgb(92, 75, 91) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Floating celebration elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl md:text-6xl"
          style={{
            left: `${5 + i * 8}%`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        >
          {["🎂", "🎁", "🎉", "🎈", "⭐", "🎊"][i % 6]}
        </motion.div>
      ))}

      <div className="text-center z-10 max-w-4xl py-6">
        {/* Animated badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.span>
          <span className="text-white font-medium tracking-wide">Atomee's Day</span>
          <motion.span
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl "
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1, delay: 0.2 }}
        >
          <motion.span
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {MESSAGES.finalCelebration}
          </motion.span>
        </motion.h1>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1, delay: 0.2 }}
        > 
          <div className=" p-1 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-sm">
            <img
              src={PLACEHOLDER_IMAGE.src}
              alt="Special person"
              className="relative w-79 h-92 rounded-full md:w-92 md:h-92 object-cover border-2 border-white/10"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 md:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {["🎂", "🎁", "🎉", "🥳", "💝"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-4xl md:text-6xl"
              animate={{
                y: [0, -15, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          className="text-white/90 text-lg md:text-2xl mb-10 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Wishing you all the happiness and success in your life!
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => {
              playAudio()
              triggerCelebration()
            }}
            className="px-8 py-4 rounded-full bg-white text-rose-500 font-semibold text-lg shadow-2xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
            >
           Blast hu Blast hu 
          </button>
          <button
            onClick={() => {
              playAudio()
              onReplay()
            }}
            className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
          >
            Replay Journey
          </button>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-8 left-8 text-6xl md:text-8xl opacity-20"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute bottom-8 right-8 text-6xl md:text-8xl opacity-20"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎁
      </motion.div>
    </motion.div>
  )
}

// Progress Indicator
function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {[...Array(totalSteps)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-rose-500 w-8" : "bg-white/30 w-1.5"
            }`}
          animate={i === currentStep ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
      ))}
    </motion.div>
  )
}

// Main App Component
export default function BirthdayApp() {
  const [step, setStep] = useState(0)
  const totalSteps = 5

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  const replay = () => setStep(0)

  return (
    <main className="overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && <LandingScreen key="landing" onNext={nextStep} />}
        {step === 1 && <MainHighlightScreen key="main" onNext={nextStep} />}
        {step === 2 && <FirstMessageScreen key="first" onNext={nextStep} />}
        {/* {step === 3 && <ImageRevealScreen key="image" onNext={nextStep} />} */}
        {step === 3 && <FinalCelebrationScreen key="final" onReplay={replay} />}
      </AnimatePresence>

      {step < totalSteps - 1 && (
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
      )}
    </main>
  )
}
