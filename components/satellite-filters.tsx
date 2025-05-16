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
  const [minInclination, setMinInclination] = useState<string>("")
  const [maxInclination, setMaxInclination] = useState<string>("")
  const [nameSearch, setNameSearch] = useState("")

  // Extract unique orbit types from data
  const orbitTypes = Array.from(new Set(data.map((item) => item["Orbit Type"] || "").filter(Boolean)))

  // Apply filters when filter values change
  // Using useCallback to memoize the filter function
  const applyFilters = useCallback(() => {
    const filteredData = data.filter((item) => {
      const nameMatch =
        !nameSearch ||
        (item["Satellite Name"] && item["Satellite Name"].toLowerCase().includes(nameSearch.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(nameSearch.toLowerCase()))

      const operatorMatch =
        !operatorSearch ||
        (item["Satellite Operator"] &&
          item["Satellite Operator"].toLowerCase().includes(operatorSearch.toLowerCase())) ||
        (item.operator && item.operator.toLowerCase().includes(operatorSearch.toLowerCase()))

      const orbitMatch =
        !orbitType || orbitType === "all" || item["Orbit Type"] === orbitType || item.orbit_type === orbitType

      // Add inclination filter
      const inclination =
        item["Inclination"] !== undefined
          ? item["Inclination"]
          : item.inclination !== undefined
            ? item.inclination
            : null

      const minInclinationValue = minInclination !== "" ? Number.parseFloat(minInclination) : null
      const maxInclinationValue = maxInclination !== "" ? Number.parseFloat(maxInclination) : null

      const inclinationMatch =
        inclination === null ||
        ((minInclinationValue === null || inclination >= minInclinationValue) &&
          (maxInclinationValue === null || inclination <= maxInclinationValue))

      return nameMatch && operatorMatch && orbitMatch && inclinationMatch
    })

    onFilterChange(filteredData)
  }, [data, nameSearch, operatorSearch, orbitType, minInclination, maxInclination, onFilterChange])

  // Only run the filter when the filter values change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return (
    <div className="space-y-4">
      {/* Satellite Name Search - Full width on all screens */}
      <div className="w-full space-y-2">
        <Label htmlFor="name-search">Satellite Name</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="name-search"
            placeholder="Search by satellite name..."
            className="pl-8"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Operator Search - Full width on all screens */}
      <div className="w-full space-y-2">
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

      {/* Orbit Type - Full width on mobile, specific width on desktop */}
      <div className="w-full space-y-2">
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

      {/* Inclination Range - Two columns on all screens */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-inclination">Min Inclination (°)</Label>
          <Input
            id="min-inclination"
            type="number"
            placeholder="Min"
            value={minInclination}
            onChange={(e) => setMinInclination(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-inclination">Max Inclination (°)</Label>
          <Input
            id="max-inclination"
            type="number"
            placeholder="Max"
            value={maxInclination}
            onChange={(e) => setMaxInclination(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
