"use client"

import { useEffect, useRef } from "react"

export default function VoiceVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    // Configuration
    const numParticles = 40
    const particles: {
      angle: number
      radius: number
      baseRadius: number
      speed: number
      amplitude: number
      phase: number
    }[] = []

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        angle: (i / numParticles) * Math.PI * 2,
        radius: 40 + Math.random() * 5,
        baseRadius: 40 + Math.random() * 5,
        speed: 0.03 + Math.random() * 0.02,
        amplitude: 5 + Math.random() * 15,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 70)
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.3)")
      gradient.addColorStop(1, "rgba(96, 165, 250, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 70, 0, Math.PI * 2)
      ctx.fill()

      // Draw connecting lines
      ctx.strokeStyle = "rgba(96, 165, 250, 0.4)"
      ctx.lineWidth = 1

      // Update and draw particles
      ctx.beginPath()

      particles.forEach((particle, index) => {
        // Update particle radius with wave effect
        particle.phase += particle.speed
        const radiusOffset = Math.sin(particle.phase) * particle.amplitude
        particle.radius = particle.baseRadius + radiusOffset

        // Calculate position
        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      // Close the path
      ctx.closePath()
      ctx.stroke()

      // Draw particles
      particles.forEach((particle) => {
        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius

        ctx.fillStyle = "rgba(96, 165, 250, 0.8)"
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw center circle
      ctx.fillStyle = "rgba(96, 165, 250, 0.6)"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60"
    />
  )
}
