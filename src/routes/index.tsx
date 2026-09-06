import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Asterisk,
  Check,
  Clock,
  Egg,
  Leaf,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Sun,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { GlassButton } from "@/components/ui/glass-button";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/ui/animated-testimonials";
import {
  cartTotals,
  eur,
  lineKey,
  MIX_OPTIONS,
  mixFor,
  mixSummary,
  type CartLine,
  type EggMix,
  type MixOptionKey,
  type Product,
} from "@/lib/cart";
import { productById, products, subscription } from "@/lib/catalog";
import farm from "@/assets/farm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tuorlo d'Oro — Uova bio dal Valdarno" },
      {
        name: "description",
        content:
          "Uova biologiche da una sola fattoria del Valdarno, Toscana. Scegli bianche, marroni o miste: raccolte a mano e consegnate a casa in 48 ore.",
      },
      { property: "og:title", content: "Tuorlo d'Oro — Uova bio dal Valdarno" },
      {
        property: "og:description",
        content: "Uova bio da galline felici, deposte questa settimana e consegnate a casa tua.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

/** Eggshell dots: a white egg is white with an ink ring; a brown one is #7c4a21. */
const eggDot = (variant: "white" | "brown") =>
  `h-2.5 w-2.5 rounded-full border border-foreground/60 ${
    variant === "white" ? "bg-white" : "bg-[#7c4a21]"
  }`;

/** Two mini-eggs that preview the colour of the selected mix. */
function EggColorDots({ mixKey }: { mixKey: MixOptionKey }) {
  const colors: Array<"white" | "brown"> =
    mixKey === "white"
      ? ["white", "white"]
      : mixKey === "brown"
        ? ["brown", "brown"]
        : ["white", "brown"];
  return (
    <span className="flex -space-x-1" aria-hidden>
      {colors.map((c, i) => (
        <span key={i} className={eggDot(c)} />
      ))}
    </span>
  );
}

/** Live counter shown on the pack photo: exact egg count for the chosen mix. */
function EggCountBadge({
  eggs,
  mix,
  className = "bottom-4 left-4",
}: {
  eggs: number;
  mix: EggMix;
  className?: string;
}) {
  const counts = [
    { color: "white" as const, n: mix.white },
    { color: "brown" as const, n: mix.brown },
  ].filter((c) => c.n > 0);
  return (
    <div
      className={`pointer-events-none absolute z-10 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-1.5 shadow-sm backdrop-blur ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
        <Egg className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-bold leading-none tabular-nums">{eggs}</span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        uova
      </span>
      <span aria-hidden className="mx-0.5 h-3 w-px bg-border" />
      {counts.map((c) => (
        <span key={c.color} className="flex items-center gap-1 leading-none">
          <span className={eggDot(c.color)} />
          <span className="text-xs font-bold tabular-nums">{c.n}</span>
        </span>
      ))}
    </div>
  );
}

const features = [
  {
    icon: Sun,
    title: "Galline all'aperto",
    text: "Razzolano ogni giorno tra gli ulivi del Valdarno, dall'alba al tramonto.",
  },
  {
    icon: Leaf,
    title: "Certificate biologiche",
    text: "Mangime bio coltivato in fattoria, zero antibiotici, uova senza gabbie.",
  },
  {
    icon: Egg,
    title: "Deposte questa settimana",
    text: "Raccolte a mano ogni mattina e spedite entro 48 ore dalla deposizione.",
  },
  {
    icon: Truck,
    title: "Consegna a casa",
    text: "Fino a Firenze, Arezzo e Siena. Imballaggio in cartone, gratis da 25 €.",
  },
];

const marqueeItems = [
  "Uova bio del Valdarno",
  "Deposte questa settimana",
  "Bianche, marroni o miste",
  "Raccolte a mano",
  "Zero intermediari",
  "Consegna in 48 ore",
];

/* ------------------------------------------------------------------ */
/*  Reviews                                                            */
/* ------------------------------------------------------------------ */

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Giulia Ferrini",
    role: "Figline e Incisa Valdarno",
    company: "mamma, ordina ogni settimana",
    content:
      "Le uova arrivano il mercoledì mattina, sempre deposte da pochi giorni. I miei figli hanno scoperto la differenza tra un uovo vero e uno del supermercato: il tuorlo è arancione, alto, saporito.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 2,
    name: "Marco Baldi",
    role: "San Giovanni Valdarno",
    company: "pasticcere, cliente dal 2022",
    content:
      "Per le mie creme e i miei impasti uso solo queste uova. Montano che è una meraviglia e il gusto si sente. Finalmente posso scegliere quante bianche e quante marroni: per la pasta frolla le marroni sono un'altra cosa.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Elena Ricci",
    role: "Firenze",
    company: "ordina per tutta la famiglia",
    content:
      "La consegna è puntuale e l'imballaggio è tutto di cartone, si vede la cura. Sapere che le uova vengono da una sola fattoria, a mezz'ora da casa, mi fa stare tranquilla.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Andrea Santini",
    role: "Montevarchi",
    company: "chef, le usa in cucina",
    content:
      "Lavoro con le uova tutti i giorni e queste hanno sempre il tuorlo giusto: vivo, profumato, di stagione. Il servizio è rapido e la fattoria risponde sempre. Consigliatissime.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const deliveryTowns = [
  "Firenze",
  "Figline Valdarno",
  "Incisa",
  "Rignano sull'Arno",
  "Pontassieve",
  "Montevarchi",
  "San Giovanni Valdarno",
  "Arezzo",
];

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function SectionKicker({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
      <span className="h-px w-8 bg-foreground/40" />
      {children}
    </span>
  );
}

/**
 * True at the lg breakpoint (≥1024px), where the hero runs side-by-side.
 * The hero parallax is desktop-only: on a stacked phone layout the image
 * would otherwise lag behind the scroll and slide under the marquee strip.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

function EggMixPicker({
  value,
  onChange,
  className,
}: {
  value: MixOptionKey;
  onChange: (v: MixOptionKey) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-center gap-1 rounded-full border border-border bg-background p-1 ${className ?? ""}`}
      role="radiogroup"
      aria-label="Colore delle uova"
    >
      {MIX_OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-semibold transition-all duration-300 ${
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <EggColorDots mixKey={opt.key} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart + catalogue behaviour                                         */
/* ------------------------------------------------------------------ */

const CART_STORAGE_KEY = "tuorlo-doro:cart:v1";

interface StoredCartLine {
  productId: string;
  qty: number;
  white: number;
  brown: number;
}

/** Rehydrate the cart from localStorage (browser only — safe during SSR). */
function readStoredCart(): Record<string, CartLine> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as StoredCartLine[];
    if (!Array.isArray(stored)) return {};
    const cart: Record<string, CartLine> = {};
    for (const item of stored) {
      const product = productById(item.productId);
      if (!product || item.qty < 1) continue;
      const mix: EggMix = { white: item.white, brown: item.brown };
      const key = lineKey(product.id, mix);
      cart[key] = { key, product, mix, qty: item.qty };
    }
    return cart;
  } catch {
    return {};
  }
}

/** Persist the cart so a refresh doesn't silently wipe an order. */
function writeStoredCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredCartLine[] = lines.map((l) => ({
      productId: l.product.id,
      qty: l.qty,
      white: l.mix.white,
      brown: l.mix.brown,
    }));
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private mode / quota — the in-memory cart still works.
  }
}

function PackCard({
  product,
  index,
  onAdd,
}: {
  product: Product;
  index: number;
  onAdd: (product: Product, mixKey: MixOptionKey) => void;
}) {
  const [mixKey, setMixKey] = useState<MixOptionKey>("mixed");
  const mix = mixFor(mixKey, product.eggs);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft transition-shadow duration-500 hover:shadow-yolk"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-shell">
        <img
          src={product.imageUrl}
          alt={`${product.name} — ${product.eggs} uova`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-background">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-medium tracking-tight">{product.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {product.eggs} uova · allevate all'aperto
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {product.deliveryTime}
          </p>
        </div>

        <div className="mt-auto">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Colore uova</span>
            <span className="tabular-nums text-foreground/70">{mixSummary(mix)}</span>
          </div>
          <EggMixPicker value={mixKey} onChange={setMixKey} />
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="font-display text-[1.7rem] leading-none tracking-tight">
              {eur(product.price)}
              <span className="ml-1 align-middle font-sans text-xs font-normal text-muted-foreground">
                / {product.eggs} uova
              </span>
            </div>
            <GlassButton
              size="sm"
              variant="solid"
              onClick={() => onAdd(product, mixKey)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              Aggiungi
            </GlassButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<Record<string, CartLine>>(readStoredCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shopTab, setShopTab] = useState<"confezioni" | "abbonamento">("confezioni");

  const heroRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the cart in sync with localStorage (no order lost on refresh).
  useEffect(() => {
    writeStoredCart(Object.values(cart));
  }, [cart]);

  // Lock background scroll and close on Escape while the drawer/modal is open.
  useEffect(() => {
    if (!cartOpen && !checkoutOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setCheckoutOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, checkoutOpen]);

  const lines = Object.values(cart);
  const { subtotal, shipping, total, count } = cartTotals(lines);

  const add = (product: Product, mixKey: MixOptionKey) => {
    const mix = mixFor(mixKey, product.eggs);
    const key = lineKey(product.id, mix);
    setCart((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: { key, product, mix, qty: (existing?.qty ?? 0) + 1 },
      };
    });
    toast.success(`${product.name} — ${mixSummary(mix)}`, {
      description: "Aggiunta al carrello",
    });
  };

  const changeQty = (key: string, delta: number) =>
    setCart((prev) => {
      const line = prev[key];
      if (!line) return prev;
      const qty = Math.max(0, line.qty + delta);
      const next = { ...prev };
      if (qty === 0) delete next[key];
      else next[key] = { ...line, qty };
      return next;
    });

  const scrollToShop = () =>
    document.getElementById("confezioni")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Toaster position="bottom-center" />

      {/* ------------------------------------------------ Header */}
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8 lg:px-12 ${
          scrolled
            ? "border-b border-border/70 bg-background/85 py-3 shadow-[0_8px_30px_-20px_oklch(0.15_0.01_60/0.4)] backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="h-3 w-3 rounded-full border border-foreground/70 bg-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-foreground" />
          </span>
          <span className="font-display text-lg font-medium tracking-tight">
            Tuorlo <em className="font-medium italic">d'Oro</em>
          </span>
        </a>

        <nav className="hidden items-center gap-9 text-sm font-medium text-foreground/70 md:flex">
          <a href="#confezioni" className="transition hover:text-foreground">
            Confezioni
          </a>
          <a href="#recensioni" className="transition hover:text-foreground">
            Recensioni
          </a>
          <a href="#consegna" className="transition hover:text-foreground">
            Come funziona
          </a>
        </nav>

        <GlassButton size="sm" onClick={() => setCartOpen(true)} aria-label="Apri carrello">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Carrello</span>
          {count > 0 && (
            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[0.68rem] font-bold text-background">
              {count}
            </span>
          )}
        </GlassButton>
      </header>

      {/* ------------------------------------------------ Hero */}
      <section
        ref={heroRef}
        className="relative grid min-h-svh items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12 lg:pb-24 lg:pt-36"
      >
        {/* faint dotted backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 dotted-bg opacity-60 [mask-image:radial-gradient(60%_60%_at_70%_20%,black,transparent)]"
        />

        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
            <MapPin className="h-3.5 w-3.5 text-foreground" />
            Fattoria biologica · Valdarno, Toscana
          </span>

          <h1 className="mt-7 font-display text-[2.9rem] font-light leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
            Uova di una sola
            <br />
            fattoria,{" "}
            <em className="relative font-medium italic">
              nel cuore del Valdarno.
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 w-full text-foreground/80"
                fill="none"
              >
                <path
                  d="M2 9c40-6 120-8 196-4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>

          <p className="mt-7 max-w-lg text-[1.02rem] leading-relaxed text-muted-foreground">
            Le nostre galline razzolano libere tra gli ulivi sopra Figline Valdarno:
            mangiano bio, depongono quando vogliono e noi raccogliamo a mano ogni
            mattina. Tu scegli quante uova bianche o marroni — in 48 ore sono a casa tua.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LiquidMetalButton label="Ordina ora" size="lg" onClick={scrollToShop} />
            <GlassButton size="lg" onClick={() => document.getElementById("recensioni")?.scrollIntoView()}>
              Leggi le recensioni
            </GlassButton>
          </div>

          {/* trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex -space-x-2.5">
              {[68, 32, 44].map((n, i) => (
                <img
                  key={n}
                  src={`https://randomuser.me/api/portraits/${i === 1 ? "men" : "women"}/${n}.jpg`}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-sm">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                ))}
                <span className="ml-1.5 font-semibold">4,9 / 5</span>
              </span>
              <p className="mt-0.5 text-muted-foreground">+200 famiglie servite nel Valdarno</p>
            </div>
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          {...(isDesktop ? { style: { y: visualY } } : {})}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full border border-dashed border-foreground/20"
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-shell shadow-yolk"
          >
            <img
              src={farm}
              alt="Le nostre galline all'aperto tra gli ulivi del Valdarno"
              width={1024}
              height={860}
              fetchPriority="high"
              className="aspect-[6/5] w-full object-cover"
            />
          </motion.div>

          {/* floating chips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="absolute -left-4 top-8 flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-soft backdrop-blur sm:-left-8"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold leading-tight">Raccolte ieri</div>
              <div className="text-xs text-muted-foreground">in 48 h sono da te</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="absolute -bottom-5 right-2 flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground px-4 py-2.5 text-background shadow-soft sm:-right-4"
          >
            <Egg className="h-4 w-4" />
            <span className="text-xs font-semibold">Bianche · Miste · Marroni</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ------------------------------------------------ Marquee */}
      <div className="group relative overflow-hidden border-y border-foreground/10 bg-foreground py-3.5">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-8 whitespace-nowrap pr-8 text-xs font-semibold uppercase tracking-[0.24em] text-background/90"
                >
                  {item}
                  <Asterisk className="h-3 w-3 text-background/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ Features */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-card text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-sans text-[0.98rem] font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Shop */}
      <section id="confezioni" className="relative border-t border-border/70 bg-card/60 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <SectionKicker>Le nostre uova</SectionKicker>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-light leading-[1.08] tracking-[-0.02em] sm:text-5xl">
                Scegli la confezione,
                <br />
                <em className="font-medium italic">poi il colore delle uova.</em>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Ogni confezione può essere tutta bianca, tutta marrone o mista, metà e
                metà. Spediamo entro 48 ore dalla deposizione; consegna gratuita da
                25 €.
              </p>
            </div>
            <div className="shrink-0 pb-1">
              <AnimatedTabs
                value={shopTab}
                onChange={(v) => setShopTab(v as "confezioni" | "abbonamento")}
                tabs={[
                  { label: "Confezioni", value: "confezioni" },
                  { label: "Abbonamento", value: "abbonamento" },
                ]}
              />
            </div>
          </motion.div>

          <div className="mt-14">
            <AnimatePresence mode="wait">
              {shopTab === "confezioni" ? (
                <motion.div
                  key="confezioni"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {products.map((p, i) => (
                    <PackCard key={p.id} product={p} index={i} onAdd={add} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="abbonamento"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <SubscriptionCard product={subscription} onAdd={add} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ How it works */}
      <section id="consegna" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <SectionKicker>Come funziona</SectionKicker>
            <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.02em] sm:text-5xl">
              Dall'alba del Valdarno <em className="font-medium italic">alla tua cucina.</em>
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              Niente magazzini né intermediari: ogni ordine parte dalla nostra fattoria
              e arriva da te in giornata di consegna. Sulla confezione trovi sempre la
              settimana di deposizione.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {deliveryTowns.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-foreground/15 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/75"
                >
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background">
                + tutto il Valdarno
              </span>
            </div>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {[
              {
                n: "01",
                title: "Scegli e ordina entro la domenica",
                text: "Confezioni singole o abbonamento, con il colore delle uova che preferisci.",
              },
              {
                n: "02",
                title: "Raccogliamo le uova all'alba",
                text: "Il giorno della consegna le uova vengono raccolte a mano, controllate una a una e imballate in cartone.",
              },
              {
                n: "03",
                title: "In 48 ore sono a casa tua",
                text: "Consegna a domicilio tra Firenze, Arezzo, Siena e tutto il Valdarno. Gratis da 25 €.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-6 py-7"
              >
                <span className="font-display text-3xl font-light text-foreground/25">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-sans text-base font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------ Reviews */}
      <div id="recensioni" className="border-t border-border/70 bg-card/60">
        <AnimatedTestimonials
          badgeText="4,9 / 5 · Clienti del Valdarno"
          title="Chi ha già scelto le nostre uova"
          subtitle="Siamo una piccola fattoria familiare del Valdarno e la cosa che ci rende più orgogliosi sono le famiglie, i pasticceri e gli chef che tornano ogni settimana."
          testimonials={testimonials}
          autoRotateInterval={6500}
          trustedCompaniesTitle="Consegniamo a Firenze, Arezzo, Siena e in tutto il Valdarno"
          trustedCompanies={deliveryTowns}
        />
      </div>

      {/* ------------------------------------------------ Final CTA */}
      <section className="px-5 pb-24 pt-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-foreground px-7 py-16 text-background sm:px-14 lg:px-20 lg:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(oklch(1 0 0) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-light leading-[1.1] tracking-[-0.02em] sm:text-5xl">
                Uova vere, ogni settimana,
                <br />
                <em className="font-medium italic">dalla nostra fattoria alla tua.</em>
              </h2>
              <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-background/70">
                Ordina entro domenica: lunedì all'alba raccogliamo, e in 48 ore le tue
                uova sono davanti alla porta di casa.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-4">
              <button
                type="button"
                onClick={scrollToShop}
                className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-4 text-sm font-bold text-foreground transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Ordina ora
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("recensioni")?.scrollIntoView()}
                className="text-sm font-medium text-background/60 underline-offset-4 transition hover:text-background hover:underline"
              >
                Prima leggi le recensioni
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------ Footer */}
      <footer className="border-t border-border px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
          {/* Left and right columns share equal flex space, which pins the nav
              to the true centre of the footer on desktop. */}
          <div className="flex w-full flex-col items-center sm:w-auto sm:flex-1 sm:items-start">
            <a href="#" className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full border border-foreground/70 bg-white" />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-foreground" />
              </span>
              <span className="font-display text-base font-medium tracking-tight">
                Tuorlo <em className="font-medium italic">d'Oro</em>
              </span>
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Azienda agricola biologica · Valdarno (AR), Toscana · Consegna in 48 ore
            </p>
          </div>
          <nav className="flex shrink-0 items-center gap-6 text-sm text-muted-foreground">
            <a href="#confezioni" className="transition hover:text-foreground">
              Confezioni
            </a>
            <a href="#consegna" className="transition hover:text-foreground">
              Consegna
            </a>
            <a href="#recensioni" className="transition hover:text-foreground">
              Recensioni
            </a>
          </nav>
          <p className="flex w-full justify-center text-xs text-muted-foreground sm:w-auto sm:flex-1 sm:justify-end">
            © 2026 Tuorlo d'Oro
          </p>
        </div>
      </footer>

      {/* ------------------------------------------------ Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            aria-label="Chiudi"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Il tuo carrello
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Chiudi carrello"
                className="rounded-full border border-border p-2 transition hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {lines.length > 0 &&
              !lines.some((l) => l.product.recurring === "week") &&
              subtotal < 25 && (
              <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Ti mancano{" "}
                  <span className="font-bold text-foreground">
                    {eur(25 - subtotal)}
                  </span>{" "}
                  per la consegna gratuita.
                </p>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    animate={{ width: `${Math.min(100, (subtotal / 25) * 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-foreground"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto pb-4">
              {lines.length === 0 && (
                <div className="mt-10 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </span>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Il carrello è vuoto. Aggiungi qualche uovo!
                  </p>
                  <GlassButton
                    size="sm"
                    className="mt-5"
                    onClick={() => {
                      setCartOpen(false);
                      scrollToShop();
                    }}
                  >
                    Vai alle confezioni
                  </GlassButton>
                </div>
              )}
              {lines.map((line) => (
                <motion.div
                  layout
                  key={line.key}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3"
                >
                  <img
                    src={line.product.imageUrl}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[4.5rem] w-[4.5rem] rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{line.product.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <EggColorDots mixKey={mixKeyOf(line.mix)} />
                      {mixSummary(line.mix)}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {eur(line.product.price)}{" "}
                      {line.product.recurring === "week" ? "/ settimana" : "/ confezione"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeQty(line.key, -1)}
                        aria-label="Riduci quantità"
                        className="rounded-full border border-border p-1 transition hover:bg-accent"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        onClick={() => changeQty(line.key, 1)}
                        aria-label="Aumenta quantità"
                        className="rounded-full border border-border p-1 transition hover:bg-accent"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold tabular-nums">
                      {eur(line.product.price * line.qty)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {lines.length > 0 && (
              <div className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotale</span>
                  <span className="tabular-nums text-foreground">{eur(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Consegna</span>
                  <span className="tabular-nums text-foreground">
                    {shipping === 0 ? "Gratis" : eur(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-display text-2xl">
                  <span>Totale</span>
                  <span className="tabular-nums">{eur(total)}</span>
                </div>
                <GlassButton
                  variant="solid"
                  className="mt-2 w-full"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                >
                  Vai al pagamento
                  <ArrowRight className="h-4 w-4" />
                </GlassButton>
                <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Pagamento sicuro in arrivo con Stripe
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}

      {/* ------------------------------------------------ Checkout (Stripe-ready) */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            aria-label="Chiudi"
            onClick={() => setCheckoutOpen(false)}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-yolk"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl font-medium">Riepilogo ordine</h2>
              <button
                onClick={() => setCheckoutOpen(false)}
                aria-label="Chiudi"
                className="rounded-full border border-border p-2 transition hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <div key={line.key} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      {line.product.name}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        × {line.qty}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{mixSummary(line.mix)}</div>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {eur(line.product.price * line.qty)}
                  </span>
                </div>
              ))}
              <div className="space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotale</span>
                  <span className="tabular-nums text-foreground">{eur(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Consegna</span>
                  <span className="tabular-nums text-foreground">
                    {shipping === 0 ? "Gratis" : eur(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-display text-2xl">
                  <span>Totale</span>
                  <span className="tabular-nums">{eur(total)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-card px-6 py-5">
              <div className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background p-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Lock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">Pronto per Stripe, non ancora attivo</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Il checkout è già predisposto: appena la fattoria collega Stripe (chiave
                    segreta nell'ambiente), questo pulsante aprirà una sessione di pagamento
                    protetta con carta, Apple Pay e Google Pay. Oggi nessun addebito.
                  </p>
                </div>
              </div>
              <GlassButton variant="solid" className="mt-4 w-full" onClick={() => setCheckoutOpen(false)}>
                Ho capito, chiudi
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

/** Recover the colour choice from a mix (for displaying the mini egg dots). */
function mixKeyOf(mix: { white: number; brown: number }): MixOptionKey {
  if (mix.brown === 0) return "white";
  if (mix.white === 0) return "brown";
  return "mixed";
}

/* ------------------------------------------------------------------ */
/*  Subscription card                                                  */
/* ------------------------------------------------------------------ */

function SubscriptionCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product, mixKey: MixOptionKey) => void;
}) {
  const [mixKey, setMixKey] = useState<MixOptionKey>("mixed");
  const mix = mixFor(mixKey, product.eggs);
  const savings = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.article className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative min-h-[16rem] bg-shell">
        <img
          src={product.imageUrl}
          alt={product.name}
          width={1024}
          height={820}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {product.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-foreground px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-background">
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          <Truck className="h-3.5 w-3.5" />
          Consegna inclusa
        </span>
        <EggCountBadge eggs={product.eggs} mix={mix} className="right-5 top-5" />
      </div>

      <div className="flex flex-col justify-center gap-6 p-7 lg:p-10">
        <div>
          <SectionKicker>Abbonamento settimanale</SectionKicker>
          <h3 className="mt-3 font-display text-3xl font-light tracking-tight sm:text-4xl">
            12 uova ogni settimana,
            <br />
            <em className="font-medium italic">come un abbonamento al fresco.</em>
          </h3>
        </div>

        <ul className="space-y-2.5 text-sm text-muted-foreground">
          {[
            "Scegli ogni settimana bianche, miste o marroni",
            `Risparmi il ${savings}% rispetto alla confezione singola`,
            "Salta, modifica o disdici quando vuoi, in un click",
            "Data di deposizione scritta a mano sulla confezione",
          ].map((li) => (
            <li key={li} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {li}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl leading-none tracking-tight">
                {eur(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">/ settimana</span>
            </div>
            {product.originalPrice && (
              <p className="mt-1 text-xs text-muted-foreground">
                invece di{" "}
                <span className="line-through">{eur(product.originalPrice)}</span> ·{" "}
                {product.quantity}
              </p>
            )}
            <p className="mt-3 text-xs font-medium text-foreground/70">{mixSummary(mix)}</p>
          </div>
          <div className="flex flex-col items-stretch gap-2.5 sm:items-end">
            <div className="w-full sm:w-72">
              <EggMixPicker value={mixKey} onChange={setMixKey} />
            </div>
            <GlassButton variant="solid" size="lg" onClick={() => onAdd(product, mixKey)}>
              Inizia l'abbonamento
              <ArrowRight className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
