"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  message: string
  retry?: () => void
}

export function ErrorDisplay({ message, retry }: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4 border border-red-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {retry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
