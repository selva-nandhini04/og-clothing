import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          original_price: number | null;
          member_price: number | null;
          tag: string | null;
          category: string | null;
          images: string[] | null;
          colors: { id: string; label: string; hex: string }[] | null;
          sizes: string[] | null;
          in_stock: boolean;
          stock_count: number | null;
          low_stock_threshold: number | null;
          sourcing_contact: string | null;
          edition_size: number | null;
          views: number | null;
          edition_number: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          tag: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["collections"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["collections"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          items: OrderItem[];
          total: number;
          name: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          pin: string | null;
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: { email: string };
        Update: Partial<{ email: string }>;
      };
      lottery_entries: {
        Row: {
          id: string;
          email: string;
          collection: string;
          created_at: string;
        };
        Insert: { email: string; collection: string };
        Update: Partial<{ email: string; collection: string }>;
      };
    };
  };
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  colorLabel: string;
  size: string;
  qty: number;
  image: string;
  slug: string;
};
