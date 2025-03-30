import gsap from "gsap"
import { FC, useCallback, useEffect, useRef, useState } from "react"

const lines = [
  'Template text for the first animation',
  'A chain for builders who want to build without limitations',
  'A chain where applications can run seamlessly across different chains',
  'A chain that is fast enough to avoid MEV headaches',
  'A chain that’s as secure as Bitcoin',
  'A chain that unleashes endless new possibilities for composable smart contracts',
  'A chain that lets builders manage risk in real time',
]

export interface DescriptionProps {
  className?: string
}

export const Description: FC<DescriptionProps> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const morphText = useCallback(() => {
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
      },
    )
  }, [ref.current])

  useEffect(() => {
    morphText()

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % lines.length)
    }, 6000)

    return () => {
      clearTimeout(timer)
    }
  }, [index])

  return (
    <div ref={ref} className={className}>
      {lines[index]}
    </div>
  )
}
