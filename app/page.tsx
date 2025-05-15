"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

// Create Supabase client using environment variables
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // First, let's try to get a list of tables to see what's available
        const { data: tableData, error: tableError } = await supabase.from("Geosatable").select("*").limit(10)

        if (tableError) {
          // If "Geosatable" doesn't exist, try a different approach
          console.error("Error with Geosatable:", tableError)

          // Try to query for available tables
          const { data: tables, error: schemaError } = await supabase.rpc("get_tables")

          if (schemaError) {
            throw new Error(`Could not find tables: ${schemaError.message}`)
          }

          if (tables && tables.length > 0) {
            // Use the first table found
            const firstTable = tables[0]
            console.log(`Found table: ${firstTable}`)

            const { data: tableData, error: dataError } = await supabase.from(firstTable).select("*").limit(10)

            if (dataError) throw new Error(`Error fetching from ${firstTable}: ${dataError.message}`)
            setData(tableData || [])
          } else {
            throw new Error("No tables found in the database")
          }
        } else {
          // If Geosatable exists, use it
          setData(tableData || [])
        }
      } catch (err: any) {
        console.error("Error:", err)
        setError(err.message || "An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to render table headers based on the first data item
  const renderTableHeaders = () => {
    if (data.length === 0) return null

    const firstItem = data[0]
    return (
      <tr>
        {Object.keys(firstItem).map((key) => (
          <th key={key} className="border px-2 py-1 bg-gray-100 font-medium text-left">
            {key}
          </th>
        ))}
      </tr>
    )
  }

  // Function to render table rows
  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        {Object.values(item).map((value: any, i) => (
          <td key={i} className="border px-2 py-1">
            {value !== null ? String(value) : "N/A"}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Satellite GEO Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">Loading data...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
          <p className="mt-2 text-sm">
            Please make sure your Supabase database has the required tables and permissions.
          </p>
        </div>
      ) : data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="overflow-auto border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>{renderTableHeaders()}</thead>
            <tbody className="divide-y divide-gray-200">{renderTableRows()}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
