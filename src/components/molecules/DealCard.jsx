import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatDate, getDaysInStage, getPriorityColor } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete,
  isDragging = false,
  className,
  ...props 
}) => {
  const daysInStage = getDaysInStage(deal.createdDate, deal.lastModified)
  const priorityColor = getPriorityColor(deal.priority)

  const handleClick = (e) => {
    e.stopPropagation()
    onEdit(deal)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(deal)
  }

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer",
        "hover:shadow-md hover:border-gray-300 transition-all duration-200",
        "group select-none",
        `priority-${deal.priority}`,
        isDragging && "opacity-50 rotate-2 z-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* Priority indicator */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {deal.name}
          </h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(deal.value)}
            </span>
            <Badge 
              variant={deal.priority === "high" ? "danger" : deal.priority === "medium" ? "warning" : "success"}
              size="small"
            >
              {deal.priority}
            </Badge>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-50 rounded"
        >
          <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
        </button>
      </div>

      {/* Contact info */}
      <div className="mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="User" className="h-4 w-4 mr-1" />
          <span className="truncate">{deal.contactName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
          <span className="truncate">{deal.contactEmail}</span>
        </div>
      </div>

      {/* Timeline info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
          <span>{daysInStage} days in stage</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>
      </div>

      {/* Notes preview */}
      {deal.notes && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2">
            {deal.notes}
          </p>
        </div>
      )}
    </div>
  )
}

export default DealCard