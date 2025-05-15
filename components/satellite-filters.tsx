"use client"

import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SatelliteFiltersProps {
  data: any[]
  onFilterChange: (filteredData: any[]) => void
}

export function SatelliteFilters({ data, onFilterChange }: SatelliteFiltersProps) {
  const [operatorSearch, setOperatorSearch] = useState("")
  const [orbitType, setOrbitType] = useState("")

  // Extract unique orbit types from data
  const orbitTypes = Array.from(new Set(data.map((item) => item["Orbit Type"] || "").filter(Boolean)))

  // Apply filters when filter values change
  // Using useCallback to memoize the filter function
  const applyFilters = useCallback(() => {
    const filteredData = data.filter((item) => {
      const operatorMatch =
        !operatorSearch ||
        (item["Satellite Operator"] && item["Satellite Operator"].toLowerCase().includes(operatorSearch.toLowerCase()))

      const orbitMatch = !orbitType || orbitType === "all" || item["Orbit Type"] === orbitType

      return operatorMatch && orbitMatch
    })

    onFilterChange(filteredData)
  }, [data, operatorSearch, orbitType, onFilterChange])

  // Only run the filter when the filter values change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="operator-search">Satellite Operator</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="operator-search"
            placeholder="Search by operator..."
            className="pl-8"
            value={operatorSearch}
            onChange={(e) => setOperatorSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-[200px] space-y-2">
        <Label htmlFor="orbit-type">Orbit Type</Label>
        <Select value={orbitType} onValueChange={setOrbitType}>
          <SelectTrigger id="orbit-type">
            <SelectValue placeholder="All orbit types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All orbit types</SelectItem>
            {orbitTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
