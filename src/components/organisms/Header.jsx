import React from "react"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ValueSummary from "@/components/molecules/ValueSummary"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ 
  searchTerm, 
  onSearchChange, 
  onAddDeal, 
  totalValue, 
  totalDeals 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Top section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                FlowBoard CRM
              </h1>
              <p className="text-gray-600 mt-1">
                Visual sales pipeline management
              </p>
            </div>
            <Button 
              onClick={onAddDeal}
              size="large"
              className="shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
              New Deal
            </Button>
          </div>

          {/* Controls section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search deals by name, contact, or company..."
              />
            </div>
            <div className="lg:ml-6">
              <ValueSummary 
                totalValue={totalValue} 
                dealCount={totalDeals} 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header