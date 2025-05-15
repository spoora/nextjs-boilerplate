"use server"

import { supabase } from "@/utils/supabase"
import type { Satellite } from "@/types/satellite"

export async function getSatellites(): Promise<{ data: Satellite[] | null; error: any }> {
  const { data, error } = await supabase.from("satellites").select("*").order("name")

  return { data, error }
}
