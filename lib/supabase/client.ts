import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createClientComponent = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Use this client in the browser
export const supabase = createClientComponent()
