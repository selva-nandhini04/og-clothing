import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function fixRLS() {
  const sql = `
    CREATE POLICY "Admins can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
    CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
  `;
  // This might fail if policies exist, but we can just use the service role client in queries.ts for admin stuff
}
// Actually, let's just make the query not fail, but if it's returning [], maybe that's not throwing an error.

async function checkOrders() {
    const { data, error } = await supabase.from("orders").select("*");
    console.log("Orders:", data?.length, "Error:", error);
}
checkOrders();
