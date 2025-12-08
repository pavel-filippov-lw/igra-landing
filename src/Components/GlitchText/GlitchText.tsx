import gsap from "gsap"
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react"

export interface GlitchTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  lines: string[]
}

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________"

const randomChar = () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]

export const GlitchText: FC<GlitchTextProps> = ({ lines, className, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const glitch = (index: number) => {
      if (!ref.current) return

      const nextText = lines[(index + 1) % lines.length]
      ref.current.innerHTML = nextText
        .split("")
        .map((c) => `<span style="display:inline-block; position:relative">${c}</span>`)
        .join("")

      const chars = ref.current.querySelectorAll("span")

      const tl = gsap.timeline({
        onComplete: () => setIndex((prev) => (prev + 1) % lines.length),
      })

      tl.to(chars, {
        duration: 0.08,
        opacity: 0.5,
        repeat: 4,
        yoyo: true,
        ease: "steps(2)",
      })

      tl.to(
        chars,
        {
          duration: 0.12,
          textShadow:
            "0 0 4px rgba(255,0,0,0.9), 0 0 4px rgba(0,255,255,0.9)",
          repeat: 3,
          yoyo: true,
          ease: "steps(2)",
        },
        "<",
      )

      tl.to(
        chars,
        {
          duration: 0.15,
          onUpdate: () => {
            chars.forEach((span, i) => {
              if (Math.random() < 0.2) {
                span.innerHTML = randomChar()
              }
            })
          },
          onComplete: () => {
            chars.forEach((span, i) => {
              span.innerHTML = nextText[i] || ""
            })
          },
        },
        "<",
      )

      tl.to(chars, {
        duration: 0.1,
        opacity: 1,
        textShadow: "none",
        ease: "power2.out",
      })
    }

    const interval = setInterval(() => glitch(index), 2000)

    return () => clearInterval(interval)
  }, [index])

  return (
    <div
      ref={ref}
      {...props}
      className={className}
    >
      {lines[index]}
    </div>
  )
}
