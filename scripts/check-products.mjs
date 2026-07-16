import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rvhyaiwfbfhwjnwglsnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHlhaXdmYmZod2pud2dsc25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEzODU0NSwiZXhwIjoyMDk5NzE0NTQ1fQ.HvrJHmx_g-KeBM1qrJwiyIc_fcEUt7iHhxCVmMwtdH4";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from("products").select("*").eq("in_stock", true).order("created_at", { ascending: false });
  console.log("Products count:", data?.length);
  if (data && data.length > 0) {
    console.log("First product:", data[0].name);
  } else {
    console.log("Error or empty:", error);
  }
}
check();
