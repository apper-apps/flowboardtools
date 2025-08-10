import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className }) => {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Header skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
              </div>
              <div className="h-12 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg w-32 animate-pulse" />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="lg:ml-6">
                <div className="h-20 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg w-64 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex-shrink-0 w-80">
              {/* Stage header skeleton */}
              <div className="bg-white p-4 border-b border-gray-200 rounded-t-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse mr-2" />
                    <div className="h-5 bg-gray-300 rounded w-24 animate-pulse" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-8 animate-pulse" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </div>

              {/* Deal cards skeleton */}
              <div className="min-h-96 p-4 space-y-3 bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-lg">
                {[1, 2, 3].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                        <div className="flex items-center space-x-2">
                          <div className="h-5 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-20" />
                          <div className="h-5 bg-gray-200 rounded-full w-16" />
                        </div>
                      </div>
                      <div className="h-4 w-4 bg-gray-200 rounded" />
                    </div>
                    
                    <div className="mb-3 space-y-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
                        <div className="h-3 bg-gray-200 rounded w-20" />
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
                        <div className="h-3 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading