"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import type { Satellite } from "@/types/satellite"

interface SatellitesTableProps {
  satellites: Satellite[]
}

type SortField = keyof Satellite | null
type SortDirection = "asc" | "desc"

export function SatellitesTable({ satellites }: SatellitesTableProps) {
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  const sortedSatellites = [...satellites].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === null) return 1
    if (bValue === null) return -1

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? (aValue < bValue ? -1 : 1) : bValue < aValue ? -1 : 1
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center font-semibold">
                Satellite Name
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("operator")}
                className="flex items-center font-semibold"
              >
                Operator
                {getSortIcon("operator")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("launch_date")}
                className="flex items-center font-semibold"
              >
                Launch Date
                {getSortIcon("launch_date")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("geo_orbit_date")}
                className="flex items-center font-semibold"
              >
                GEO Orbit Date
                {getSortIcon("geo_orbit_date")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("inclination")}
                className="flex items-center font-semibold"
              >
                Inclination
                {getSortIcon("inclination")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("orbit_type")}
                className="flex items-center font-semibold"
              >
                Orbit Type
                {getSortIcon("orbit_type")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("longitude")}
                className="flex items-center font-semibold"
              >
                Longitude
                {getSortIcon("longitude")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("frequency")}
                className="flex items-center font-semibold"
              >
                Ku/C/Ka Frequency
                {getSortIcon("frequency")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSatellites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No satellites found.
              </TableCell>
            </TableRow>
          ) : (
            sortedSatellites.map((satellite) => (
              <TableRow key={satellite.id}>
                <TableCell className="font-medium">{satellite.name}</TableCell>
                <TableCell>{satellite.operator}</TableCell>
                <TableCell>{formatDate(satellite.launch_date)}</TableCell>
                <TableCell>{formatDate(satellite.geo_orbit_date)}</TableCell>
                <TableCell className="text-right">
                  {satellite.inclination !== null ? `${satellite.inclination}°` : "N/A"}
                </TableCell>
                <TableCell>{satellite.orbit_type}</TableCell>
                <TableCell className="text-right">
                  {satellite.longitude !== null ? `${satellite.longitude}°` : "N/A"}
                </TableCell>
                <TableCell>{satellite.frequency || "N/A"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
