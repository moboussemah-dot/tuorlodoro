import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Egg, Leaf, Truck, Sun, ShoppingBag, Minus, Plus, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { GlassButton } from "@/components/ui/glass-button";
import { Component as GradientBlurBg } from "@/components/ui/gradient-blur-bg";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import eggsCarton from "@/assets/eggs-carton.jpg";
import farm from "@/assets/farm.jpg";

const BlackHole = lazy(() =>
  import("@/components/ui/blackhole-hero-section").then((m) => ({
    default: m.BlackHoleHeroSection,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tuorlo d'Oro — Uova Bio da una sola fattoria" },
      {
        name: "description",
        content:
          "Uova biologiche fresche da galline allevate all'aperto in una singola fattoria. Consegna settimanale a casa tua.",
      },
      { property: "og:title", content: "Tuorlo d'Oro — Uova Bio da una sola fattoria" },
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

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  badge?: string;
};

const products: Product[] = [
  { id: "6", name: "Confezione da 6", desc: "Per chi vive da solo o per una colazione speciale.", price: 4.5, unit: "6 uova" },
  { id: "12", name: "Confezione da 12", desc: "La scelta della famiglia. Fresche tutta la settimana.", price: 8.2, unit: "12 uova", badge: "Più venduta" },
  { id: "30", name: "Cassetta da 30", desc: "Per chef, pasticceri e grandi famiglie.", price: 18.9, unit: "30 uova" },
  { id: "abbonamento", name: "Abbonamento settimanale", desc: "12 uova ogni settimana, salta quando vuoi. -15%.", price: 6.95, unit: "a settimana", badge: "Risparmi 15%" },
];

const features = [
  { icon: Sun, title: "Galline all'aperto", text: "Razzolano ogni giorno tra gli ulivi, dall'alba al tramonto." },
  { icon: Leaf, title: "Certificate Bio", text: "Mangime biologico coltivato in fattoria, zero antibiotici." },
  { icon: Egg, title: "Deposte questa settimana", text: "Raccolte a mano ogni mattina, spedite entro 48 ore." },
  { icon: Truck, title: "Consegna a casa", text: "Imballaggio compostabile, gratis sopra i 25€." },
];

function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

const eur = (n: number) => n.toFixed(2).replace(".", ",") + " €";

function Index() {
  const narrow = useNarrow();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ product: products.find((p) => p.id === id)!, qty: q })),
    [cart],
  );
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  const add = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    toast.success(`${p.name} aggiunta al carrello`);
  };
  const change = (id: string, d: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  return (
    <main className="min-h-screen">
      <Toaster position="bottom-center" />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 lg:px-12">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
          <span className="h-3 w-3 rounded-full bg-gradient-yolk shadow-yolk" />
          Tuorlo d'Oro
        </a>
        <nav className="hidden items-center gap-8 text-sm text-foreground/70 md:flex">
          <a href="#shop" className="transition hover:text-foreground">Shop</a>
          <a href="#fattoria" className="transition hover:text-foreground">La fattoria</a>
          <a href="#recensioni" className="transition hover:text-foreground">Recensioni</a>
        </nav>
        <GlassButton size="sm" onClick={() => setOpen(true)} aria-label="Apri carrello">
          <ShoppingBag className="h-4 w-4" />
          Carrello
          {count > 0 && (
            <span className="ml-1 rounded-full bg-gradient-yolk px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </GlassButton>
      </header>

      {/* Hero */}
      <section className="relative min-h-[92svh] w-full md:min-h-[720px]">
        <ClientOnly fallback={<div className="absolute inset-0 bg-background" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <BlackHole
              className="absolute inset-0"
              focus={narrow ? [0.5, 0.76] : [0.72, 0.46]}
              scrim={narrow ? "top" : "left"}
              scrimStrength={0.9}
              distance={24}
              elevation={narrow ? -7 : -5.5}
              fov={narrow ? 58 : 42}
              glow={narrow ? 0.85 : 1}
              steps={narrow ? 180 : 280}
              resolution={narrow ? 0.55 : 0.7}
              hotColor="#fff3d6"
              midColor="#f5a623"
              coolColor="#b8420f"
            />
          </Suspense>
        </ClientOnly>
        <div className="relative z-10 flex min-h-[92svh] items-start px-6 pt-28 sm:px-10 md:min-h-[720px] md:items-center md:pt-0 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-[34rem]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-yolk/40 bg-yolk/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-yolk">
              <MapPin className="h-3 w-3" /> Una sola fattoria, Sabina
            </span>
            <h1 className="mt-6 text-[2.75rem] font-light leading-[1.02] tracking-[-0.03em] text-cream sm:text-6xl lg:text-[4.5rem]">
              Al centro di tutto,
              <br />
              <em className="font-medium not-italic text-yolk">un tuorlo d'oro.</em>
            </h1>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-cream/65 md:mt-7">
              Uova biologiche da galline che razzolano libere tra gli ulivi. Deposte questa
              settimana, consegnate a casa tua.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <GlassButton variant="solid" onClick={() => document.getElementById("shop")?.scrollIntoView()}>
                Ordina ora
              </GlassButton>
              <GlassButton onClick={() => document.getElementById("fattoria")?.scrollIntoView()}>
                Scopri la fattoria
              </GlassButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yolk/15 text-yolk">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-sm font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop */}
      <GradientBlurBg>
        <section id="shop" className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-yolk">Shop</span>
              <h2 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">Scegli la tua confezione</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Prezzi tutto incluso. Consegna gratuita sopra i 25 €, altrimenti 3,90 €.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass-panel group flex flex-col overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={eggsCarton}
                    alt={p.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-yolk px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-sans text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="font-display text-2xl text-yolk">{eur(p.price)}</span>
                      <span className="ml-1 text-xs text-muted-foreground">/ {p.unit}</span>
                    </div>
                    <GlassButton size="sm" variant="solid" onClick={() => add(p)}>
                      <Plus className="h-4 w-4" /> Aggiungi
                    </GlassButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </GradientBlurBg>

      {/* Farm */}
      <section id="fattoria" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl shadow-yolk"
        >
          <img src={farm} alt="Galline libere tra gli ulivi della fattoria" width={1280} height={960} loading="lazy" className="h-full w-full object-cover" />
        </motion.div>
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-yolk">La fattoria</span>
          <h2 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Una famiglia, 400 galline, un uliveto.
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Tutte le nostre uova arrivano da un unico posto: la fattoria di famiglia sulle colline
            della Sabina. Niente intermediari, niente miscele di allevamenti diversi. Le galline
            vivono all'aperto tra gli ulivi, mangiano cereali bio coltivati da noi e depongono
            quando vogliono loro.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Raccogliamo a mano ogni mattina e spediamo entro 48 ore. Sulla confezione trovi la data
            di deposizione e il nome di chi ha raccolto le tue uova.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[["400", "galline"], ["12 ha", "di uliveto"], ["48 h", "dalla raccolta"]].map(([n, l]) => (
              <div key={l} className="glass-panel rounded-2xl p-4 text-center">
                <div className="font-display text-2xl text-yolk">{n}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        © 2026 Tuorlo d'Oro · Azienda agricola biologica · Sabina, Lazio
      </footer>

      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button aria-label="Chiudi" className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.aside
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-panel relative flex h-full w-full max-w-md flex-col bg-card/90 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">Il tuo carrello</h2>
              <button onClick={() => setOpen(false)} aria-label="Chiudi" className="rounded-full p-2 transition hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {items.length === 0 && <p className="text-muted-foreground">Il carrello è vuoto. Aggiungi qualche uovo!</p>}
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border p-3">
                  <img src={eggsCarton} alt="" width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{eur(product.price)} / {product.unit}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => change(product.id, -1)} className="rounded-full border border-border p-1 hover:bg-accent" aria-label="Riduci"><Minus className="h-3 w-3" /></button>
                    <span className="w-5 text-center text-sm">{qty}</span>
                    <button onClick={() => change(product.id, 1)} className="rounded-full border border-border p-1 hover:bg-accent" aria-label="Aumenta"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Consegna</span><span>{total >= 25 || total === 0 ? "Gratis" : eur(3.9)}</span>
              </div>
              <div className="mt-2 flex justify-between font-display text-2xl">
                <span>Totale</span><span className="text-yolk">{eur(total + (total >= 25 || total === 0 ? 0 : 3.9))}</span>
              </div>
              <GlassButton
                variant="solid"
                className="mt-4 w-full"
                disabled={items.length === 0}
                onClick={() => toast.info("Il pagamento arriva nel prossimo passo — collegheremo il checkout.")}
              >
                Vai al pagamento
              </GlassButton>
            </div>
          </motion.aside>
        </div>
      )}
    </main>
  );
}
