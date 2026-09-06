"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Quote, Star } from "lucide-react"
import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it.",
  badgeText = "Trusted",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted worldwide",
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return
    const i = setInterval(
      () => setActiveIndex((c) => (c + 1) % testimonials.length),
      autoRotateInterval,
    )
    return () => clearInterval(i)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <section ref={sectionRef} className={cn("relative overflow-hidden py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Left */}
          <div className="space-y-6">
            {badgeText && (
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                <Star className="h-3 w-3 fill-yolk text-yolk" />
                {badgeText}
              </motion.span>
            )}
            <motion.h2 variants={itemVariants} className="text-4xl font-medium tracking-tight sm:text-5xl">
              {title}
            </motion.h2>
            <motion.p variants={itemVariants} className="max-w-md leading-relaxed text-muted-foreground">
              {subtitle}
            </motion.p>
            <motion.div variants={itemVariants} className="flex items-center gap-2 pt-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    activeIndex === index ? "w-10 bg-foreground" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                  )}
                  aria-label={`Recensione ${index + 1}`}
                />
              ))}
            </motion.div>
          </div>

          {/* Right: active card (auto-height, crossfaded on rotation) */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <AnimatePresence initial={false} mode="popLayout">
                {(() => {
                  const t = testimonials[activeIndex]!
                  return (
                    <motion.article
                      key={t.id}
                      initial={{ opacity: 0, y: 22, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-soft"
                    >
                      <div>
                        <div className="flex gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yolk text-yolk" />
                          ))}
                        </div>
                        <div className="mt-5 flex gap-3">
                          <Quote className="h-6 w-6 shrink-0 text-muted-foreground/40" />
                          <p className="font-display text-lg leading-relaxed sm:text-xl">"{t.content}"</p>
                        </div>
                      </div>
                      <div>
                        <Separator className="my-5" />
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border border-border">
                            <AvatarImage src={t.avatar} alt={t.name} loading="lazy" />
                            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold">{t.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.role} · {t.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )
                })()}
              </AnimatePresence>
              {/* decorative */}
              <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full bg-foreground/[0.07] blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-40 w-40 rounded-full bg-foreground/[0.05] blur-3xl" />
            </div>
          </motion.div>
        </motion.div>

        {trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate={controls} className="mt-20 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{trustedCompaniesTitle}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustedCompanies.map((c) => (
                <span key={c} className="font-display text-xl text-foreground/50 transition hover:text-foreground">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
