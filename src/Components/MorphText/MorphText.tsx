import gsap from "gsap"
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react"

export interface MorphTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  lines: string[]
}

export const MorphText: FC<MorphTextProps> = ({ lines, className, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const morphText = (index: number) => {
      if (!ref.current) return

      const currentText = lines[index]
      const nextText = lines[(index + 1) % lines.length]

      const maxLength = Math.max(currentText.length, nextText.length)

      ref.current.innerHTML = nextText
        .padEnd(maxLength, ' ')
        .split('')
        .map((char) => `<span style="opacity:1; display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')

      const chars = ref.current.querySelectorAll('span')

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: () => gsap.utils.random(-20, 20),
          x: () => gsap.utils.random(-10, 10),
          rotation: () => gsap.utils.random(-20, 20),
          scale: () => gsap.utils.random(0.8, 1.2),
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.02,
          ease: "power2.out",
          onComplete: () => {
            setIndex((prev) => (prev + 1) % lines.length)
          },
        },
      )
    }

    const interval = setInterval(() => {
      morphText(index)
    }, 4000)

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
