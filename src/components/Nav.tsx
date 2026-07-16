import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Editorial", to: "/editorial" },
  { label: "Archive", to: "/archive" },
  { label: "FIFA'26", to: "/fifa26" },
];

export function TopBar() {
  return (
    <div className="hidden bg-foreground text-background md:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-2 text-[10px] tracking-[0.25em] uppercase font-mono">
        <span>Free returns · Worldwide</span>
        <span>New drop 06.19 · Terrace Archive</span>
        <span>EN / INR</span>
      </div>
    </div>
  );
}

export function Nav() {
  const { totalItems } = useCart();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background font-display text-sm">
              OG
            </span>
            <span className="font-display text-sm tracking-widest">CLOTHING</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => {
              const active = currentPath === l.to || currentPath.startsWith(l.to + "/");
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={
                    l.label === "FIFA'26"
                      ? "flex items-center gap-1.5 text-sm font-bold tracking-wide transition bg-gradient-to-r from-[#009C3B] via-[#F6B40E] to-[#E3001B] bg-clip-text text-transparent hover:opacity-80 drop-shadow-sm"
                      : `link-underline text-sm font-medium transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
                  }
                >
                  {l.label === "FIFA'26" && (
                    <img src="/fifa26-emblem.webp" alt="FIFA" className="h-4 w-auto inline-block drop-shadow-sm" />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 text-foreground">
            <button aria-label="Search" className="p-1 transition hover:opacity-60">
              <Search className="h-4 w-4" />
            </button>
            <Link to="/auth" aria-label="Account" className="p-1 transition hover:opacity-60">
              <User className="h-4 w-4" />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative p-1 transition hover:opacity-60">
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--color-electric)] text-[9px] text-white font-mono">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            {/* Mobile menu toggle */}
            <button
              aria-label="Menu"
              className="p-1 transition hover:opacity-60 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 top-[69px] z-30 bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden ${
            mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          <nav className="h-full overflow-y-auto px-6 py-8">
            <ul className="space-y-6">
              {NAV_LINKS.map((l, i) => (
                <li key={l.label} style={{ transitionDelay: `${i * 50}ms` }} className={`transition-all duration-500 transform ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <Link
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={
                      l.label === "FIFA'26"
                        ? "flex items-center gap-3 font-display text-4xl uppercase tracking-tight transition bg-gradient-to-r from-[#009C3B] via-[#F6B40E] to-[#E3001B] bg-clip-text text-transparent hover:opacity-80"
                        : "block font-display text-4xl uppercase tracking-tight transition hover:text-[color:var(--color-electric)]"
                    }
                  >
                    {l.label === "FIFA'26" && (
                      <img src="/fifa26-emblem.webp" alt="FIFA" className="h-8 w-auto inline-block drop-shadow-sm" />
                    )}
                    {l.label}
                  </Link>
                </li>
              ))}
              
              <div className="h-px w-full bg-border my-8" />
              
              <li className={`transition-all duration-500 delay-300 transform ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
                >
                  <User className="h-4 w-4" /> Account
                </Link>
              </li>
              <li className={`mt-6 transition-all duration-500 delay-400 transform ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
                >
                  <ShoppingBag className="h-4 w-4" /> Cart {totalItems > 0 && <span className="text-[color:var(--color-electric)]">({totalItems})</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
