import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Empty = ({ 
  title = "No data available",
  description = "There's nothing here yet.",
  actionLabel = "Get Started",
  onAction,
  icon = "Package",
  className 
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center p-4", className)}>
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">
            {description}
          </p>
        </div>

        {onAction && (
          <Button 
            onClick={onAction}
            className="w-full"
            size="large"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your pipeline will appear here once you start adding deals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Empty