"use client"

import { useEffect } from "react"

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    )

    const observeAll = () => {
      document
        .querySelectorAll<Element>(".reveal:not(.revealed), .reveal-stagger:not(.revealed)")
        .forEach((el) => observer.observe(el))
    }

    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
