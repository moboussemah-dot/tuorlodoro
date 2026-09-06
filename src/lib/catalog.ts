import type { Product } from "@/lib/cart";

import pack6 from "@/assets/pack-6.jpg";
import pack12 from "@/assets/pack-12.jpg";
import pack30 from "@/assets/pack-30.jpg";
import packSub from "@/assets/pack-sub.jpg";

/**
 * Tuorlo d'Oro catalogue.
 *
 * Every carton in the catalogue is one product; the customer then picks the
 * egg colour mix (white / mixed / brown) when adding it to the cart.
 */
export const products: Product[] = [
  {
    id: "conf-6",
    name: "Confezione da 6",
    quantity: "6 uova",
    eggs: 6,
    price: 4.5,
    deliveryTime: "48 h dalla deposizione",
    imageUrl: pack6,
    category: "confezioni",
  },
  {
    id: "conf-12",
    name: "Confezione da 12",
    quantity: "12 uova",
    eggs: 12,
    price: 8.2,
    deliveryTime: "48 h dalla deposizione",
    imageUrl: pack12,
    category: "confezioni",
    badge: "Più venduta",
  },
  {
    id: "conf-30",
    name: "Cassetta da 30",
    quantity: "30 uova",
    eggs: 30,
    price: 18.9,
    deliveryTime: "48 h dalla deposizione",
    imageUrl: pack30,
    category: "confezioni",
    badge: "Per famiglie & chef",
  },
];

export const subscription: Product = {
  id: "abbonamento",
  name: "Abbonamento settimanale",
  quantity: "12 uova a settimana",
  eggs: 12,
  price: 6.95,
  originalPrice: 8.2,
  discount: "−15%",
  deliveryTime: "Ogni settimana · salta quando vuoi",
  imageUrl: packSub,
  category: "abbonamento",
  recurring: "week",
};

export const catalogue: Product[] = [...products, subscription];

export function productById(id: string): Product | undefined {
  return catalogue.find((p) => p.id === id);
}
