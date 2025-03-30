"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children?: React.ReactNode
  content: string
  className?: string
  placement?: "top" | "bottom" | "left" | "right"
}

export function Tooltip({ 
  children, 
  content,
  className,
  placement = "top"
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Determine the position based on placement
  const getPositionStyle = () => {
    switch (placement) {
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { top: "50%", right: "100%", transform: "translateY(-50%)" };
      case "right":
        return { top: "50%", left: "100%", transform: "translateY(-50%)" };
      case "top":
      default:
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)" };
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <button 
          type="button"
          className="h-6 w-6 p-0 ml-1 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </button>
      )}
      
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 w-64 p-2 mt-2 text-sm text-gray-700 bg-white rounded-md shadow-lg border border-gray-200",
            className
          )}
          style={getPositionStyle()}
        >
          {content}
        </div>
      )}
    </div>
  )
}
