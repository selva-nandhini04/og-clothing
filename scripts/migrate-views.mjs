import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
  return true;
}

async function migrate() {
  console.log("Adding views column...");
  await runSQL(`ALTER TABLE products ADD COLUMN IF NOT EXISTS views integer default 0;`);
  
  console.log("Adding RPC...");
  await runSQL(`
    create or replace function increment_product_views(p_slug text)
    returns void as $$
    begin
      update products set views = coalesce(views, 0) + 1 where slug = p_slug;
    end;
    $$ language plpgsql;
  `);
  
  console.log("Done.");
}

migrate();
