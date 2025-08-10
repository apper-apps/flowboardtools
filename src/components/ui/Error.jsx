import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center p-4", className)}>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {onRetry && (
          <div className="space-y-3">
            <Button 
              onClick={onRetry}
              className="w-full"
              size="large"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="ghost"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error