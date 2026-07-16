import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart";
import { createOrder, getSession, subscribeNewsletter } from "@/lib/queries";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — OG CLOTHING" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "" });
  const [submitting, setSubmitting] = useState(false);

  const shipping = totalPrice >= 1500 ? 0 : 149;
  const total = totalPrice + shipping;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const session = await getSession();
      await createOrder({
        user_id: session?.user?.id,
        items,
        total,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pin: form.pin,
      });
      // Try to subscribe them to newsletter too
      try { await subscribeNewsletter(form.email); } catch {}
      clearCart();
      setCheckoutStep("success");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkoutStep === "success") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[color:var(--color-neon)]/20">
            <ShoppingBag className="h-8 w-8 text-[color:var(--color-neon)]" />
          </div>
          <h1 className="font-display text-4xl uppercase">Order placed.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your numbered piece is on its way. You'll receive a confirmation at <strong>{form.email}</strong>.
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Estimated delivery: 3–5 business days
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:opacity-80"
          >
            Continue shopping →
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && checkoutStep === "cart") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
        <h1 className="font-display text-4xl uppercase">Your bag is empty.</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm">
          Looks like you haven't added anything yet. Go find something that makes you feel something.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:gap-4"
        >
          Shop the drop
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="font-display text-4xl uppercase md:text-5xl">
            {checkoutStep === "cart" ? `Your bag (${totalItems})` : "Checkout"}
          </h1>
          {checkoutStep === "checkout" && (
            <button
              onClick={() => setCheckoutStep("cart")}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-3 w-3" /> Back to bag
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left: items or checkout form */}
          <div className="lg:col-span-2">
            {checkoutStep === "cart" ? (
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-5 py-6">
                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md bg-[color:var(--color-bone)]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to="/product/$slug"
                            params={{ slug: item.slug }}
                            className="text-sm font-semibold hover:text-[color:var(--color-electric)] transition"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            <span>{item.colorLabel}</span>
                            <span>·</span>
                            <span>Size {item.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                          className="p-1 text-muted-foreground transition hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-full border border-border">
                          <button
                            onClick={() => updateQty(item.id, item.color, item.size, item.qty - 1)}
                            className="px-3 py-2 text-muted-foreground hover:text-foreground transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.color, item.size, item.qty + 1)}
                            className="px-3 py-2 text-muted-foreground hover:text-foreground transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-semibold">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-red-500 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear bag
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout form */
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Full name" type="text" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Arjun Sharma" />
                  <FormField label="Email address" type="email" required value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="you@example.com" />
                </div>
                <FormField label="Phone number" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+91 98765 43210" />
                <FormField label="Delivery address" type="text" required value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} placeholder="123, Main Street, Area" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="City" type="text" required value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} placeholder="Mumbai" />
                  <FormField label="PIN code" type="text" required value={form.pin} onChange={(v) => setForm((f) => ({ ...f, pin: v }))} placeholder="400001" />
                </div>

                <div className="rounded-xl border border-border bg-[color:var(--color-bone)] p-4">
                  <div className="eyebrow mb-2">Payment</div>
                  <p className="text-sm text-muted-foreground">
                    Secure payment via Razorpay. UPI, Cards, Net Banking, and Wallets accepted.
                  </p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {["UPI", "Visa", "Mastercard", "Rupay", "Net Banking"].map((m) => (
                      <span key={m} className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right: order summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-[color:var(--color-bone)] p-6">
              <h2 className="font-display text-xl uppercase mb-4">Order summary</h2>

              {/* Mini items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-3">
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded bg-background">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{item.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{item.size} · ×{item.qty}</p>
                    </div>
                    <span className="font-mono text-xs shrink-0">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-border border-y border-border py-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-mono">
                    {shipping === 0 ? (
                      <span className="text-[color:var(--color-neon)]">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span className="font-mono text-lg">₹{total.toLocaleString("en-IN")}</span>
              </div>

              {shipping > 0 && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-electric)]">
                  Add ₹{(1500 - totalPrice).toLocaleString("en-IN")} more for free shipping
                </p>
              )}

              {checkoutStep === "cart" ? (
                <button
                  onClick={() => setCheckoutStep("checkout")}
                  className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition hover:gap-4"
                >
                  Proceed to checkout
                  <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition disabled:opacity-50"
                >
                  {submitting ? "Placing order…" : `Place order — ₹${total.toLocaleString("en-IN")}`}
                </button>
              )}

              <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Free returns · 30 days · Secured by SSL
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-border bg-[color:var(--color-bone)] px-4 py-3 text-sm outline-none transition focus:border-foreground"
      />
    </div>
  );
}
