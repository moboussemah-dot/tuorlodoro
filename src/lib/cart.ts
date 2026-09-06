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

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
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
