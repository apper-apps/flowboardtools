import React from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search deals...",
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          className="h-4 w-4 text-gray-400" 
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        {...props}
      />
    </div>
  )
}

export default SearchBar