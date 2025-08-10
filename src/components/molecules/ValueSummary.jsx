import React from "react"
import { formatCurrency } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const ValueSummary = ({ 
  totalValue, 
  dealCount, 
  className 
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-primary-700">
            Pipeline Value
          </h3>
          <p className="text-2xl font-bold text-primary-900">
            {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-primary-600">
            {dealCount} {dealCount === 1 ? "Deal" : "Deals"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ValueSummary