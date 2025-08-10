export const formatCurrency = (value) => {
  if (!value && value !== 0) return "$0"
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatDate = (date) => {
  if (!date) return ""
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj)
}

export const getDaysInStage = (createdDate, lastModified) => {
  const startDate = lastModified ? new Date(lastModified) : new Date(createdDate)
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50"
    case "medium":
      return "text-amber-600 bg-amber-50"
    case "low":
      return "text-emerald-600 bg-emerald-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export const getStageColor = (stageName) => {
  const colors = {
    "New Lead": "bg-blue-500",
    "Qualified": "bg-purple-500",
    "Proposal": "bg-amber-500",
    "Negotiation": "bg-orange-500",
    "Won": "bg-emerald-500",
    "Lost": "bg-red-500"
  }
  
  return colors[stageName] || "bg-gray-500"
}