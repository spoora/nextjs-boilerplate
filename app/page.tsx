'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kytkzkwumyeocuwrlgbf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dGt6a3d1bXllb2N1d3JsZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjk4ODksImV4cCI6MjA2Mjg0NTg4OX0.4UkP5Avtx3bfHaudEUE1pYQ7VYWcxf4W7siWotHc7Rs'
)

export default function DashboardPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('Geosatable')
        .select('*')

      if (error) console.error('Error:', error)
      else setData(data)
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Satellite GEO Dashboard</h1>

      {data.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">JCAT</th>
                <th className="border px-2 py-1">Piece</th>
                <th className="border px-2 py-1">Satellite Name</th>
                <th className="border px-2 py-1">Satellite Operator</th>
                <th className="border px-2 py-1">Launch date Date</th>
                <th className="border px-2 py-1">Geo orbit Reach Date</th>
                <th className="border px-2 py-1">Status Date</th>
                <th className="border px-2 py-1">Inclination</th>
                <th className="border px-2 py-1">Orbit Type</th>
                <th className="border px-2 py-1">Longitude</th>
                <th className="border px-2 py-1">Commercial Telecom</th>
                <th className="border px-2 py-1">Ku Frequency</th>
                <th className="border px-2 py-1">C Frequency</th>
                <th className="border px-2 py-1">Ka Frequency</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sat, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{sat.JCAT}</td>
                  <td className="border px-2 py-1">{sat.Piece}</td>
                  <td className="border px-2 py-1">{sat['Satellite Name']}</td>
                  <td className="border px-2 py-1">{sat['Satellite Operator']}</td>
                  <td className="border px-2 py-1">{sat['Launch date Date']}</td>
                  <td className="border px-2 py-1">{sat['Geo orbit Reach Date']}</td>
                  <td className="border px-2 py-1">{sat['Status Date']}</td>
                  <td className="border px-2 py-1">{sat['Inclination']}</td>
                  <td className="border px-2 py-1">{sat['Orbit Type']}</td>
                  <td className="border px-2 py-1">{sat['Longitude']}</td>
                  <td className="border px-2 py-1">{sat['Commercial Telecom']}</td>
                  <td className="border px-2 py-1">{sat['Ku Frequency (Yes/No)']}</td>
                  <td className="border px-2 py-1">{sat['C Frequency (Yes/No)']}</td>
                  <td className="border px-2 py-1">{sat['Ka Frequency (Yes/No)']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
