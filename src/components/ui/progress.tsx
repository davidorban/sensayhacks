"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-indigo-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
