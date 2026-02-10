import gsap from "gsap"
import { FC, HTMLAttributes, useEffect, useRef } from "react"

export interface GlitchTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  lines: string[]
}

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________"

const randomChar = () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]

export const GlitchText: FC<GlitchTextProps> = ({ lines, className, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  const renderText = (text: string) => {
    if (!ref.current) return
    ref.current.innerHTML = text
      .split("")
      .map((c) => `<span style="display:inline-block; position:relative">${c === " " ? "&nbsp;" : c}</span>`)
      .join("")
  }

  useEffect(() => {
    if (!lines.length) return
    renderText(lines[0]) // стартуем с первого
    indexRef.current = 0
  }, [lines])

  useEffect(() => {
    if (!lines.length) return

    const glitch = () => {
      const current = indexRef.current
      const nextIndex = (current + 1) % lines.length
      const nextText = lines[nextIndex]

      renderText(nextText)
      const chars = ref.current?.querySelectorAll("span")
      if (!chars) return

      const tl = gsap.timeline({
        onComplete: () => {
          indexRef.current = nextIndex
        },
      })

      tl.to(chars, { duration: 0.08, opacity: 0.5, repeat: 4, yoyo: true, ease: "steps(2)" })
      tl.to(chars, {
        duration: 0.12,
        textShadow: "0 0 4px rgba(255,0,0,0.9), 0 0 4px rgba(0,255,255,0.9)",
        repeat: 3,
        yoyo: true,
        ease: "steps(2)",
      }, "<")

      tl.to(chars, {
        duration: 0.15,
        onUpdate: () => {
          chars.forEach((span, i) => {
            if (nextText[i] !== " " && Math.random() < 0.2) span.innerHTML = randomChar()
          })
        },
        onComplete: () => {
          chars.forEach((span, i) => {
            span.innerHTML = nextText[i] === " " ? "&nbsp;" : (nextText[i] || "")
          })
        },
      }, "<")

      tl.to(chars, { duration: 0.1, opacity: 1, textShadow: "none", ease: "power2.out" })
    }

    const id = window.setInterval(glitch, 2000)

    return () => window.clearInterval(id)
  }, [lines])

  return (
    <div
      ref={ref}
      {...props}
      className={className}
    />
  )
}
