import React, { useEffect, useMemo, useState } from "react";
import { dealService } from "@/services/api/dealService";
import { stageService } from "@/services/api/stageService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import DealModal from "@/components/organisms/DealModal";
import Header from "@/components/organisms/Header";
import PipelineStage from "@/components/organisms/PipelineStage";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PipelinePage = () => {
  const [deals, setDeals] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dropZoneStage, setDropZoneStage] = useState(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [dealsData, stagesData] = await Promise.all([
        dealService.getAll(),
        stageService.getAll()
      ])
      
      setDeals(dealsData)
      setStages(stagesData)
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filtered deals based on search
  const filteredDeals = useMemo(() => {
    if (!searchTerm.trim()) return deals
    
    const term = searchTerm.toLowerCase()
    return deals.filter(deal => 
      deal.name.toLowerCase().includes(term) ||
      deal.contactName.toLowerCase().includes(term) ||
      deal.contactEmail.toLowerCase().includes(term)
    )
  }, [deals, searchTerm])

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped = {}
    
    stages.forEach(stage => {
      grouped[stage.id] = filteredDeals.filter(deal => deal.stage === stage.name)
    })
    
    return grouped
  }, [filteredDeals, stages])

  // Calculate totals
  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0)
  const totalDeals = filteredDeals.length

  // Handle deal operations
  const handleAddDeal = () => {
    setSelectedDeal(null)
    setIsModalOpen(true)
  }

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        // Update existing deal
        const updatedDeal = await dealService.update(selectedDeal.Id, {
          ...dealData,
          lastModified: new Date().toISOString()
        })
        
        setDeals(prev => prev.map(deal => 
          deal.Id === selectedDeal.Id ? updatedDeal : deal
        ))
        
        toast.success("Deal updated successfully!")
      } else {
        // Create new deal
        const newDeal = await dealService.create({
          ...dealData,
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString()
        })
        
        setDeals(prev => [...prev, newDeal])
        toast.success("Deal created successfully!")
      }
      
      setIsModalOpen(false)
      setSelectedDeal(null)
    } catch (err) {
      toast.error("Failed to save deal. Please try again.")
      console.error("Error saving deal:", err)
    }
  }

  const handleDeleteDeal = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.name}"?`)) {
      try {
        await dealService.delete(deal.Id)
        setDeals(prev => prev.filter(d => d.Id !== deal.Id))
        toast.success("Deal deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete deal. Please try again.")
        console.error("Error deleting deal:", err)
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (stageId) => {
    setDropZoneStage(stageId)
  }

  const handleDragLeave = () => {
    setDropZoneStage(null)
  }

  const handleDrop = async (dealId, newStageId) => {
    setDropZoneStage(null)
    
    const deal = deals.find(d => d.Id === parseInt(dealId))
    const newStage = stages.find(s => s.id === newStageId)
    
    if (!deal || !newStage || deal.stage === newStage.name) {
      return
    }

    try {
      const updatedDeal = await dealService.update(deal.Id, {
        ...deal,
        stage: newStage.name,
        lastModified: new Date().toISOString()
      })
      
      setDeals(prev => prev.map(d => 
        d.Id === deal.Id ? updatedDeal : d
      ))
      
      toast.success(`Deal moved to ${newStage.name}!`)
    } catch (err) {
      toast.error("Failed to move deal. Please try again.")
      console.error("Error moving deal:", err)
    }
  }

  // Render loading state
  if (loading) {
    return <Loading />
  }

  // Render error state
  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
      />
    )
  }

  // Render empty state
  if (stages.length === 0) {
    return (
      <Empty
        title="No Pipeline Stages"
        description="Set up your sales pipeline stages to start managing deals."
        actionLabel="Refresh"
        onAction={loadData}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddDeal={handleAddDeal}
        totalValue={totalValue}
        totalDeals={totalDeals}
      />

      {/* Pipeline Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredDeals.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No deals found
              </h3>
              <p className="text-gray-600">
                No deals match your search for "{searchTerm}"
              </p>
            </div>
          </div>
        ) : (
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {stages.map((stage) => (
              <PipelineStage
                key={stage.id}
                stage={stage}
                deals={dealsByStage[stage.id] || []}
                onDealEdit={handleEditDeal}
                onDealDelete={handleDeleteDeal}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                isDropZone={dropZoneStage === stage.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDeal(null)
        }}
        onSave={handleSaveDeal}
        deal={selectedDeal}
        stages={stages}
      />
    </div>
  )
}

export default PipelinePage