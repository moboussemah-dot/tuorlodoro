import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Checkout entry point — ready for Stripe.
 *
 * When Stripe is connected, this handler will create a Checkout Session from
 * the validated line items (product id + egg mix as metadata) and return the
 * hosted payment URL. Until then it reports that payments are not live yet so
 * the UI can show a friendly message instead of failing.
 */
const lineSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(50),
  white: z.number().int().min(0),
  brown: z.number().int().min(0),
});

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ lines: z.array(lineSchema).min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    if (!stripeKey) {
      return { ok: false as const, reason: "payments_not_configured" as const, lines: data.lines.length };
    }
    // TODO (Stripe step): build line_items from data.lines and create a Checkout Session.
    return { ok: false as const, reason: "payments_not_configured" as const, lines: data.lines.length };
  });
