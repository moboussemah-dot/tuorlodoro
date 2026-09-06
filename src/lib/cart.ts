/**
 * Shared cart / catalogue model.
 * Kept framework-free so it can be reused by the Stripe checkout server
 * function later (line items map 1:1 to Stripe `line_items`).
 */

export type ProductCategory = "confezioni" | "abbonamento";

export interface Product {
  id: string;
  name: string;
  quantity: string;
  /** Number of eggs in the pack — drives the white/brown selector. */
  eggs: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  deliveryTime: string;
  imageUrl: string;
  category: ProductCategory;
  /** Short marketing tag shown on the card (e.g. "Più venduta"). */
  badge?: string;
  /** Stripe Price ID — fill in once Stripe is connected. */
  stripePriceId?: string;
  recurring?: "week";
}

export interface EggMix {
  white: number;
  brown: number;
}

export interface CartLine {
  /** `${productId}:${white}w` — same product with a different mix is a separate line. */
  key: string;
  product: Product;
  mix: EggMix;
  qty: number;
}

export const FREE_SHIPPING_FROM = 25;
export const SHIPPING_COST = 3.9;

export const lineKey = (productId: string, mix: EggMix) => `${productId}:${mix.white}w`;

export const eur = (n: number) => n.toFixed(2).replace(".", ",") + " €";

/** Egg colour choices offered per pack. */
export type MixOptionKey = "white" | "mixed" | "brown";

export const MIX_OPTIONS: Array<{ key: MixOptionKey; label: string }> = [
  { key: "white", label: "Bianche" },
  { key: "mixed", label: "Miste" },
  { key: "brown", label: "Marroni" },
];

/** Turn a colour choice into concrete white/brown counts for a pack of N eggs. */
export function mixFor(key: MixOptionKey, eggs: number): EggMix {
  if (key === "white") return { white: eggs, brown: 0 };
  if (key === "brown") return { white: 0, brown: eggs };
  const white = Math.ceil(eggs / 2);
  return { white, brown: eggs - white };
}

/** Human summary, e.g. "3 bianche · 3 marroni". */
export function mixSummary(mix: EggMix): string {
  const w = mix.white;
  const b = mix.brown;
  const white = w === 1 ? "1 bianca" : `${w} bianche`;
  const brown = b === 1 ? "1 marrone" : `${b} marroni`;
  if (b === 0) return white;
  if (w === 0) return brown;
  return `${white} + ${brown}`;
}

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);
  const hasRecurring = lines.some((l) => l.product.recurring === "week");
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM || hasRecurring ? 0 : SHIPPING_COST;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { subtotal, shipping, total: subtotal + shipping, count };
}

/** Payload shape the checkout server function accepts. */
export interface CheckoutLineInput {
  productId: string;
  qty: number;
  white: number;
  brown: number;
}
