import React from "react"
import DealCard from "@/components/molecules/DealCard"
import { formatCurrency, getStageColor } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const PipelineStage = ({ 
  stage, 
  deals, 
  onDealEdit, 
  onDealDelete,
  onDrop,
  onDragOver,
  onDragLeave,
  isDropZone = false,
  className 
}) => {
  const stageValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const stageColor = getStageColor(stage.name)

  const handleDragOver = (e) => {
    e.preventDefault()
    onDragOver(stage.id)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    onDragLeave()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData("dealId")
    onDrop(dealId, stage.id)
  }

  return (
    <div className={cn("flex-shrink-0 w-80", className)}>
      {/* Stage header */}
      <div className={cn(
        "sticky top-0 bg-white z-10 p-4 border-b border-gray-200 rounded-t-lg",
        "shadow-sm backdrop-blur-sm bg-white/95"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={cn("w-3 h-3 rounded-full mr-2", stageColor)} />
            <h2 className="text-lg font-semibold text-gray-900">
              {stage.name}
            </h2>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {deals.length}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-primary-600">
            {formatCurrency(stageValue)}
          </span>
          <span className="ml-1">total value</span>
        </div>
      </div>

      {/* Deals container */}
      <div 
        className={cn(
          "min-h-96 p-4 space-y-3 transition-all duration-200",
          "bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-lg",
          isDropZone && "drop-zone-active"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {deals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">
              <div className={cn("w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center", stageColor, "bg-opacity-20")}>
                <div className={cn("w-6 h-6 rounded-full", stageColor)} />
              </div>
            </div>
            <p className="text-sm">No deals in this stage</p>
            <p className="text-xs text-gray-400 mt-1">
              Drag deals here to move them
            </p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.Id}
              deal={deal}
              onEdit={onDealEdit}
              onDelete={onDealDelete}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("dealId", deal.Id.toString())
                e.target.classList.add("dragging")
              }}
              onDragEnd={(e) => {
                e.target.classList.remove("dragging")
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PipelineStage