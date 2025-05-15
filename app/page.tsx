"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Loader2, Download, RefreshCw } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SatelliteFilters } from "@/components/satellite-filters"
import { Button } from "@/components/ui/button"
import { ErrorDisplay } from "@/components/error-display"

// Create Supabase client using environment variables
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      // First, let's try to get data from "Geosatable"
      const { data: tableData, error: tableError } = await supabase.from("Geosatable").select("*")

      if (tableError) {
        // If "Geosatable" doesn't exist, try a different approach
        console.error("Error with Geosatable:", tableError)

        // Try to query for available tables
        const { data: tables, error: schemaError } = await supabase
          .from("pg_tables")
          .select("tablename")
          .eq("schemaname", "public")

        if (schemaError) {
          throw new Error(`Could not find tables: ${schemaError.message}`)
        }

        if (tables && tables.length > 0) {
          // Use the first table found
          const firstTable = tables[0].tablename
          console.log(`Found table: ${firstTable}`)

          const { data: tableData, error: dataError } = await supabase.from(firstTable).select("*")

          if (dataError) throw new Error(`Error fetching from ${firstTable}: ${dataError.message}`)

          const fetchedData = tableData || []
          setData(fetchedData)
          setFilteredData(fetchedData)
        } else {
          throw new Error("No tables found in the database")
        }
      } else {
        // If Geosatable exists, use it
        const fetchedData = tableData || []
        setData(fetchedData)
        setFilteredData(fetchedData)
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "An error occurred while fetching data")
    } finally {
      setLoading(false)
    }
  }

  // Memoize the filter change handler to prevent recreation on each render
  const handleFilterChange = useCallback((newFilteredData: any[]) => {
    setFilteredData(newFilteredData)
  }, [])

  // Function to export data as CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) return

    // Get headers from first item
    const headers = Object.keys(filteredData[0])

    // Convert data to CSV format
    const csvContent = [
      headers.join(","), // Header row
      ...filteredData.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle null values and escape commas
            return value === null ? "" : String(value).includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "satellite_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to render table headers based on the first data item
  const renderTableHeaders = () => {
    if (filteredData.length === 0) return null

    const firstItem = filteredData[0]
    return (
      <tr>
        {Object.keys(firstItem).map((key) => (
          <th
            key={key}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
          >
            {key}
          </th>
        ))}
      </tr>
    )
  }

  // Function to render table rows
  const renderTableRows = () => {
    return filteredData.map((item, index) => (
      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        {Object.entries(item).map(([key, value]: [string, any]) => (
          <td key={key} className="px-4 py-3 whitespace-nowrap text-sm">
            {value !== null ? String(value) : "N/A"}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Satellite Data</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={loading || filteredData.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : error ? (
          <ErrorDisplay message={error} retry={fetchData} />
        ) : data.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
            <p>No data available. Please make sure your Supabase database has the required tables.</p>
          </div>
        ) : (
          <>
            {/* Only render filters if we have data */}
            <SatelliteFilters data={data} onFilterChange={handleFilterChange} />

            <div className="mt-4 border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">{renderTableHeaders()}</thead>
                  <tbody className="bg-white divide-y divide-gray-200">{renderTableRows()}</tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="py-8 text-center text-gray-500">No results match your search criteria</div>
              )}

              <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-500">
                Showing {filteredData.length} of {data.length} satellites
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
