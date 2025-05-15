import { supabase } from "./supabase"

export async function getTables() {
  try {
    // Try to query for available tables using system tables
    const { data, error } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "public")

    if (error) {
      console.error("Error fetching tables:", error)
      return { tables: [], error }
    }

    return {
      tables: data?.map((row) => row.tablename) || [],
      error: null,
    }
  } catch (err) {
    console.error("Error in getTables:", err)
    return { tables: [], error: err }
  }
}
