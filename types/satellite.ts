export interface Satellite {
  id: number
  name: string
  operator: string
  launch_date: string
  geo_orbit_date: string | null
  inclination: number | null
  orbit_type: string
  longitude: number | null
  frequency: string | null
}
