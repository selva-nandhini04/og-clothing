// Run: node scripts/setup-db.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Use the Supabase Management API to run SQL
async function runSQL(sql) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/rvhyaiwfbfhwjnwglsnr/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    console.error("SQL Error:", JSON.stringify(data, null, 2));
    return false;
  }
  console.log("✓ SQL executed");
  return true;
}

const SCHEMA_SQL = `
-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  original_price numeric,
  member_price numeric,
  tag text,
  category text,
  images text[],
  colors jsonb,
  sizes text[],
  in_stock boolean default true,
  edition_size int,
  edition_number int,
  created_at timestamptz default now()
);

-- Collections table
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  tag text,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  items jsonb not null,
  total numeric not null,
  name text,
  email text,
  phone text,
  address text,
  city text,
  pin text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Lottery entries
create table if not exists lottery_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  collection text not null,
  created_at timestamptz default now(),
  unique(email, collection)
);

-- Enable Row Level Security
alter table products enable row level security;
alter table collections enable row level security;
alter table orders enable row level security;
alter table newsletter_subscribers enable row level security;
alter table lottery_entries enable row level security;

-- Public read for products
create policy if not exists "Products are publicly readable"
  on products for select using (true);

-- Public read for collections
create policy if not exists "Collections are publicly readable"
  on collections for select using (true);

-- Anyone can insert orders
create policy if not exists "Anyone can create orders"
  on orders for insert with check (true);

-- Users can read their own orders
create policy if not exists "Users can read own orders"
  on orders for select using (auth.uid() = user_id or email = (select email from auth.users where id = auth.uid()));

-- Anyone can subscribe to newsletter
create policy if not exists "Anyone can subscribe"
  on newsletter_subscribers for insert with check (true);

-- Anyone can enter lottery
create policy if not exists "Anyone can enter lottery"
  on lottery_entries for insert with check (true);
`;

const SEED_SQL = `
-- Seed products
insert into products (name, slug, description, price, original_price, member_price, tag, category, sizes, in_stock, edition_size)
values
  ('OG Archive Oversized Hoodie', 'og-archive-oversized-hoodie', 'A brutalist take on the classic hood. Double-lined hood, boxy oversized silhouette, signature back embroidery. Made in a run of 500. Numbered, never restocked.', 1299, 1999, 999, 'Core / 001', 'Outerwear', ARRAY['XS','S','M','L','XL','XXL'], true, 200),
  ('Cargo-X Field Trouser', 'cargo-x-field-trouser', 'Technical field trouser with utility pocket system. Articulated knee panels, adjustable ankle cuff.', 1799, 2499, 1499, 'Utility / 04', 'Denim', ARRAY['XS','S','M','L','XL','XXL'], true, 150),
  ('Terrace Knit Vest', 'terrace-knit-vest', 'Match-day knit vest. Ribbed trim, relaxed body. Inspired by terrace culture.', 999, 1499, 799, 'Terrace / 07', 'Knitwear', ARRAY['XS','S','M','L','XL'], true, 100),
  ('Vanguard Technical Parka', 'vanguard-technical-parka', 'Storm-grade technical parka with sealed seams and oversized hood. For people who take weather personally.', 1899, 2799, 1599, 'Core / 001', 'Outerwear', ARRAY['S','M','L','XL','XXL'], true, 100),
  ('OG Stadium Jersey', 'og-stadium-jersey', 'Match-day performance jersey. Moisture-wicking mesh, OG embroidery on chest. Part of the FIFA 2026 capsule.', 1199, 1699, 999, 'FIFA''26 / 01', 'Football', ARRAY['XS','S','M','L','XL','XXL'], true, 500),
  ('Archive Crewneck', 'archive-crewneck', '400gsm cotton crewneck. Clean and considered. Part of the core archive.', 1099, 1599, 899, 'Core / 002', 'Knitwear', ARRAY['XS','S','M','L','XL','XXL'], true, 200)
on conflict (slug) do nothing;

-- Seed collections
insert into collections (name, slug, description, tag)
values
  ('Oversized Archive', 'oversized-archive', 'The foundation. Boxy silhouettes, 500gsm loop-back cotton, garment-dyed in-house.', 'Core · 24 pieces · Vol. 01'),
  ('Football Terrace', 'football-terrace', 'Designed for the terraces. Match-day energy, off-pitch wearability.', 'FIFA''26 Capsule · 12 pieces'),
  ('Spring / Winter 2026', 'spring-winter-2026', 'The debut seasonal collection. Hand-finished stitching, dead-of-night silhouettes.', 'Seasonal · Vol. 01')
on conflict (slug) do nothing;
`;

console.log("🚀 Setting up OG Clothing database...");
const schemaOk = await runSQL(SCHEMA_SQL);
if (schemaOk) {
  console.log("✓ Schema created");
  const seedOk = await runSQL(SEED_SQL);
  if (seedOk) console.log("✓ Seed data inserted");
}
console.log("✅ Done!");
