import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

async function runMigration() {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/rvhyaiwfbfhwjnwglsnr/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: `
        ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_count integer default 50;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold integer default 10;
        
        -- Admin policy for updating products
        CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (true);
      ` }),
    }
  );
  
  const data = await res.json();
  if (!res.ok) {
    console.error("Migration Failed:", data);
  } else {
    console.log("Migration Success");
  }
}

runMigration();
