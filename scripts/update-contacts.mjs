import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function run() {
  // Set default contact to 6374392488 for all products
  const { data, error } = await supabase
    .from("products")
    .update({ sourcing_contact: "6374392488", stock_count: 50, low_stock_threshold: 10 })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // dummy condition to update all

  if (error) {
    console.error("Error updating products:", error);
  } else {
    console.log("Successfully updated all products to use 6374392488 as sourcing contact.");
  }
}

run();
