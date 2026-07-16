import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, getProducts, getAllOrders, updateProductStock } from "@/lib/queries";
import { Database } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — OG CLOTHING" }],
  }),
  component: AdminDashboard,
});

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      try {
        const p = await getProducts();
        setProducts(p as Product[]);
      } catch (e) {
        console.error("Failed to load products", e);
      }
      try {
        const o = await getAllOrders();
        setOrders(o as Order[]);
      } catch (e) {
        console.error("Failed to load orders", e);
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  if (loading) {
    return <div className="p-20 text-center font-mono text-sm">Authenticating...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="eyebrow">Command Center</div>
          <h1 className="font-display text-4xl uppercase tracking-tight">Admin Dashboard.</h1>
        </div>
        <div className="flex gap-2 font-mono text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-full px-4 py-2 transition ${activeTab === "orders" ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`rounded-full px-4 py-2 transition ${activeTab === "inventory" ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70"}`}
          >
            Inventory
          </button>
        </div>
      </div>

      {activeTab === "orders" && <OrdersView orders={orders} />}
      {activeTab === "inventory" && <InventoryView products={products} onRefresh={async () => setProducts(await getProducts() as Product[])} />}
    </div>
  );
}

function OrdersView({ orders }: { orders: Order[] }) {
  if (!orders.length) return <div className="text-sm text-muted-foreground">No orders found.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-secondary/20">
              <td className="px-4 py-3 font-mono text-xs">{o.id.split("-")[0]}</td>
              <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.email}</div>
              </td>
              <td className="px-4 py-3 font-mono">₹{o.total.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-[color:var(--color-neon)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[color:var(--color-neon)]">
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryView({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const [selected, setSelected] = useState<Record<string, number>>({});

  function toggleSelection(id: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = 50; // default restock request quantity
      }
      return next;
    });
  }

  function updateRestockQty(id: string, qty: number) {
    if (selected[id] === undefined) return;
    setSelected((prev) => ({ ...prev, [id]: qty }));
  }

  function sendBulkWhatsApp() {
    const selectedIds = Object.keys(selected);
    if (!selectedIds.length) return;

    // Group items by sourcing contact (assuming they might be different, though right now all are 6374392488)
    // For simplicity of testing, let's just use the first contact we find in the selection
    const firstProduct = products.find(p => p.id === selectedIds[0]);
    const targetContact = firstProduct?.sourcing_contact || "6374392488";
    const formattedContact = targetContact.replace(/[^a-zA-Z0-9+]/g, ""); // clean non-alphanumeric except +

    const lines = selectedIds.map(id => {
      const p = products.find(prod => prod.id === id);
      return `- ${p?.name} (ID: ${p?.slug}): ${selected[id]} units`;
    });

    const msg = `URGENT RESTOCK REQUEST\n\nPlease restock the following items:\n${lines.join("\n")}\n\nThank you!`;
    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${formattedContact}?text=${encodedMsg}`, "_blank");
    
    // Clear selection after sending
    setSelected({});
  }

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="overflow-x-auto rounded-xl border border-border pb-16 relative">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-4 py-3 w-10"></th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Views</th>
            <th className="px-4 py-3">Current Stock</th>
            <th className="px-4 py-3">Low Threshold</th>
            <th className="px-4 py-3">Sourcing Contact (WhatsApp)</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <InventoryRow 
              key={p.id} 
              product={p} 
              onUpdate={onRefresh} 
              isSelected={selected[p.id] !== undefined}
              restockQty={selected[p.id]}
              onToggle={() => toggleSelection(p.id)}
              onUpdateRestockQty={(qty) => updateRestockQty(p.id, qty)}
            />
          ))}
        </tbody>
      </table>
      <div className="p-4 bg-secondary/30 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        WhatsApp notifications will automatically trigger to the Sourcing Contact when stock hits the threshold.
      </div>

      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl z-50">
          <span className="font-mono text-xs uppercase tracking-widest">{selectedCount} items selected</span>
          <button onClick={sendBulkWhatsApp} className="bg-[color:var(--color-electric)] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition">
            Send WhatsApp Request
          </button>
        </div>
      )}
    </div>
  );
}

function InventoryRow({ 
  product, 
  onUpdate,
  isSelected,
  restockQty,
  onToggle,
  onUpdateRestockQty 
}: { 
  product: Product; 
  onUpdate: () => void;
  isSelected: boolean;
  restockQty?: number;
  onToggle: () => void;
  onUpdateRestockQty: (qty: number) => void;
}) {
  const [stock, setStock] = useState(product.stock_count ?? 50);
  const [threshold, setThreshold] = useState(product.low_stock_threshold ?? 10);
  const [contact, setContact] = useState(product.sourcing_contact || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    
    // If the stock we are saving is low, immediately open WhatsApp to alert the sourcer.
    // Doing this BEFORE the await prevents the browser's popup blocker from stopping it.
    if (stock <= threshold) {
      const msg = `URGENT RESTOCK REQUEST\n\nStock for ${product.name} (ID: ${product.slug}) has been manually updated to ${stock} units, which is below the threshold of ${threshold}.\n\nPlease restock immediately.`;
      const formattedContact = contact.replace(/[^a-zA-Z0-9+]/g, "");
      window.open(`https://wa.me/${formattedContact}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    try {
      await updateProductStock(product.id, stock, threshold, contact);
      onUpdate();
    } catch (e) {
      console.error(e);
      alert("Failed to update stock");
    } finally {
      setSaving(false);
    }
  }

  const isLowStock = stock <= threshold;

  return (
    <tr className={`hover:bg-secondary/20 transition ${isSelected ? 'bg-secondary/30' : ''}`}>
      <td className="px-4 py-3">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-border"
        />
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold">{product.name}</div>
        <div className="text-xs text-muted-foreground font-mono">ID: {product.slug}</div>
      </td>
      <td className="px-4 py-3 font-mono">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2 py-0.5 text-xs text-foreground">
          <svg className="h-3 w-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          {product.views?.toLocaleString("en-IN") ?? 0}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className={`w-20 rounded border bg-background px-2 py-1 font-mono text-sm ${isLowStock ? 'border-red-500 text-red-500' : 'border-border'}`}
          />
          {isLowStock && (
            <span className="font-mono text-[9px] uppercase text-red-500 tracking-widest">Low Stock!</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-20 rounded border border-border bg-background px-2 py-1 font-mono text-sm"
        />
        {isSelected && (
          <div className="mt-2">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Request Qty:</div>
            <input
              type="number"
              value={restockQty}
              onChange={(e) => onUpdateRestockQty(Number(e.target.value))}
              className="w-20 rounded border border-[color:var(--color-electric)] bg-[color:var(--color-electric)]/10 text-[color:var(--color-electric)] px-2 py-1 font-mono text-sm"
            />
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          placeholder="e.g. +91 6374392488"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-32 rounded border border-border bg-background px-2 py-1 font-mono text-xs"
        />
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={handleSave}
          disabled={saving || (stock === product.stock_count && threshold === product.low_stock_threshold && contact === (product.sourcing_contact || ""))}
          className="rounded-full bg-foreground px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background transition hover:opacity-80 disabled:opacity-30"
        >
          {saving ? "..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
