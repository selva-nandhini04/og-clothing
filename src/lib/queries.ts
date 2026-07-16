import { supabase, type OrderItem } from "./supabase";

/* ─── Products ─── */
export async function getProducts(filters?: { category?: string; maxPrice?: number }) {
  let query = supabase.from("products").select("*").eq("in_stock", true).order("created_at", { ascending: false });
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data;
}

export async function updateProductStock(id: string, stockCount: number, threshold: number, sourcingContact: string) {
  const { error } = await supabase
    .from("products")
    .update({ stock_count: stockCount, low_stock_threshold: threshold, sourcing_contact: sourcingContact })
    .eq("id", id);
  if (error) throw error;
}

export async function incrementProductViews(slug: string) {
  // We use an RPC call to safely increment views without needing update privileges
  const { error } = await supabase.rpc("increment_product_views", { p_slug: slug });
  if (error) console.error("Failed to increment views:", error);
}

// Mock WhatsApp function
async function sendLowStockWhatsApp(contactNumber: string, productName: string, remaining: number) {
  const msg = `ALERT: Stock for ${productName} has dropped to ${remaining}. Please restock.`;
  console.log(`[WhatsApp to ${contactNumber || "UNKNOWN SOURCER"}]: ${msg}`);
  // In production, you would call a real WhatsApp API (like Twilio or MSG91) here.
}

/* ─── Collections ─── */
export async function getCollections() {
  const { data, error } = await supabase.from("collections").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/* ─── Orders ─── */
export async function createOrder(order: {
  user_id?: string;
  items: OrderItem[];
  total: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
}) {
  const { data, error } = await supabase.from("orders").insert({
    user_id: order.user_id ?? null,
    items: order.items as unknown as never,
    total: order.total,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    pin: order.pin,
    status: "pending",
  }).select().single();
  if (error) throw error;

  // Deduct stock for each item in the order
  for (const item of order.items) {
    if (!item.id.startsWith("goat-")) { // Skip mock GOAT jerseys
      const { data: product } = await supabase.from("products").select("stock_count, low_stock_threshold, name, sourcing_contact").eq("slug", item.slug).single();
      if (product && product.stock_count !== null) {
        const newStock = Math.max(0, product.stock_count - item.qty);
        await supabase.from("products").update({ stock_count: newStock }).eq("slug", item.slug);
        
        // WhatsApp Notification check
        const threshold = product.low_stock_threshold ?? 10;
        if (newStock <= threshold) {
          await sendLowStockWhatsApp(product.sourcing_contact || "No Contact Set", product.name, newStock);
        }
      }
    }
  }

  return data;
}

export async function getOrdersByEmail(email: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/* ─── Newsletter ─── */
export async function subscribeNewsletter(email: string) {
  const { error } = await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email" });
  if (error) throw error;
}

/* ─── Lottery ─── */
export async function enterLottery(email: string, collection: string) {
  const { error } = await supabase.from("lottery_entries").upsert({ email, collection }, { onConflict: "email" });
  if (error) throw error;
}

/* ─── Auth ─── */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
