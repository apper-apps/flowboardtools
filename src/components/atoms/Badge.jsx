import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  size = "medium",
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200"
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  }
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base"
  }
  
  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge