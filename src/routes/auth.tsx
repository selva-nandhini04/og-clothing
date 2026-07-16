import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, Eye, EyeOff, Mail, User, LogOut, Package } from "lucide-react";
import { signIn, signUp, sendMagicLink, signOut, getSession, getOrdersByEmail } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Account — OG CLOTHING" },
      { name: "description", content: "Sign in or create your OG Clothing member account." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "magic";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof getOrdersByEmail>>>([]);
  const [loadingSession, setLoadingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoadingSession(false);
      if (s?.user?.email) {
        getOrdersByEmail(s.user.email).then(setOrders).catch(() => {});
      }
    });

    // Listen for auth state changes (e.g. magic link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user?.email) {
        getOrdersByEmail(s.user.email).then(setOrders).catch(() => {});
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "magic") {
        await sendMagicLink(email);
        setDone(true);
      } else if (mode === "signup") {
        await signUp(email, password, name);
        setDone(true);
      } else {
        await signIn(email, password);
        // Session listener above will update state
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
    setOrders([]);
    navigate({ to: "/" });
  }

  if (loadingSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  // ─── Logged-in dashboard ───
  if (session) {
    const user = session.user;
    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Member";
    return (
      <div className="bg-background text-foreground">
        <div className="mx-auto max-w-[1600px] px-6 py-12">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-2">Member account</div>
              <h1 className="font-display text-4xl uppercase md:text-5xl">
                Hey, {displayName}.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          {/* Member perks */}
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: "✱", title: "Early access", desc: "48 hours before public drops" },
              { icon: "◈", title: "Member pricing", desc: "Up to 30% off every piece" },
              { icon: "◎", title: "Store invites", desc: "Private openings and events" },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-border bg-[color:var(--color-bone)] p-5">
                <div className="font-display text-2xl text-[color:var(--color-electric)] mb-2">{b.icon}</div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.desc}</div>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-3xl uppercase">Your orders</h2>
              <Link to="/shop" className="link-underline text-sm text-muted-foreground hover:text-foreground">
                Shop more →
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <Package className="h-10 w-10 text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-2xl uppercase">No orders yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your order history will appear here</p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-80"
                >
                  Shop the drop →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {orders.map((order) => (
                  <div key={order.id} className="py-5 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {(order.items as { name: string }[]).map((i) => i.name).join(", ")}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm font-semibold">₹{order.total.toLocaleString("en-IN")}</div>
                      <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${
                        order.status === "delivered"
                          ? "bg-[color:var(--color-neon)]/20 text-foreground"
                          : order.status === "shipped"
                            ? "bg-[color:var(--color-electric)]/20 text-[color:var(--color-electric)]"
                            : "bg-secondary text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Auth forms ───
  return (
    <div className="min-h-[80vh] bg-background text-foreground">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Left panel — branding */}
        <div className="relative hidden min-h-[80vh] overflow-hidden bg-foreground text-background lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="absolute inset-0 opacity-10">
            <div style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.1) 59px, rgba(255,255,255,0.1) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.1) 59px, rgba(255,255,255,0.1) 60px)"
            }} className="h-full w-full" />
          </div>
          <div className="relative">
            <div className="font-display text-6xl uppercase leading-none">OG</div>
            <div className="font-display text-sm uppercase tracking-[0.4em] text-white/50 mt-1">Members</div>
          </div>
          <div className="relative space-y-8">
            {[
              { icon: "✱", title: "Early drop access", desc: "Get notified 48 hours before public release" },
              { icon: "◈", title: "Member pricing", desc: "Up to 30% off on every piece, every drop" },
              { icon: "◎", title: "Store invites", desc: "Private store openings and editorial events" },
            ].map((b) => (
              <div key={b.title} className="flex gap-4">
                <span className="mt-0.5 font-display text-lg text-[color:var(--color-electric)]">{b.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{b.title}</div>
                  <div className="mt-0.5 text-xs text-white/50">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative font-mono text-[10px] uppercase tracking-widest text-white/30">
            © 2026 OG Clothing · Members program
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex min-h-[80vh] flex-col justify-center px-6 py-16 lg:px-16">
          {done ? (
            <div className="max-w-sm">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-neon)]/20">
                <Mail className="h-6 w-6 text-[color:var(--color-neon)]" />
              </div>
              <h2 className="font-display text-3xl uppercase">
                {mode === "magic" ? "Check your email." : "Welcome to OG."}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {mode === "magic"
                  ? `We sent a magic link to ${email}. Click it to sign in instantly — no password needed.`
                  : `You're almost there. Check ${email} to confirm your account.`}
              </p>
              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:gap-4"
              >
                Shop the drop
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </Link>
            </div>
          ) : (
            <div className="max-w-sm w-full">
              {/* Mode tabs */}
              <div className="mb-8">
                <h1 className="font-display text-4xl uppercase">
                  {mode === "signin" ? "Sign in." : mode === "signup" ? "Create account." : "Magic link."}
                </h1>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {([
                    { id: "signin", label: "Sign in" },
                    { id: "signup", label: "Sign up" },
                    { id: "magic", label: "Magic link" },
                  ] as { id: Mode; label: string }[]).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id); setDone(false); setError(""); }}
                      className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${
                        mode === m.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/50"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Full name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Sharma"
                        required
                        className="w-full rounded-lg border border-border bg-[color:var(--color-bone)] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-foreground"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg border border-border bg-[color:var(--color-bone)] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-foreground"
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password *</label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!email) { setError("Enter your email first"); return; }
                            setLoading(true);
                            try { await sendMagicLink(email); setDone(true); setMode("magic"); } catch {}
                            setLoading(false);
                          }}
                          className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-electric)] link-underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full rounded-lg border border-border bg-[color:var(--color-bone)] py-3 pl-4 pr-11 text-sm outline-none transition focus:border-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {mode === "signup" && (
                      <p className="font-mono text-[10px] text-muted-foreground">Min. 6 characters</p>
                    )}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition disabled:opacity-60 hover:gap-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                      Please wait…
                    </span>
                  ) : (
                    <>
                      {mode === "magic" ? "Send magic link" : mode === "signup" ? "Create account" : "Sign in"}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <a href="#" className="link-underline text-foreground">Terms</a>
                {" "}and{" "}
                <a href="#" className="link-underline text-foreground">Privacy Policy</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
