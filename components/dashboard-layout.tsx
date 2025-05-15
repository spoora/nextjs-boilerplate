import type { ReactNode } from "react"
import { Search, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="font-semibold text-lg mr-4">Satellite Dashboard</div>
          <div className="ml-auto flex items-center gap-4">
            <form className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search satellites..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </form>
            <button className="rounded-full border p-2" type="button">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </button>
            <button className="rounded-full border p-2" type="button">
              <User className="h-4 w-4" />
              <span className="sr-only">Account</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
