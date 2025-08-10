import stagesData from "@/services/mockData/stages.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Clone data to prevent mutations
const cloneStages = () => JSON.parse(JSON.stringify(stagesData))

export const stageService = {
  async getAll() {
    await delay(200)
    const stages = cloneStages()
    // Sort by order
    return stages.sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay(150)
    const stages = cloneStages()
    const stage = stages.find(s => s.id === id)
    if (!stage) {
      throw new Error("Stage not found")
    }
    return stage
  },

  async create(stageData) {
    await delay(300)
    const stages = cloneStages()
    
    // Find highest order and add 1
    const maxOrder = Math.max(...stages.map(s => s.order), 0)
    const newStage = {
      id: `stage-${Date.now()}`,
      order: maxOrder + 1,
      ...stageData
    }
    
    return newStage
  },

  async update(id, stageData) {
    await delay(250)
    const stages = cloneStages()
    const stageIndex = stages.findIndex(s => s.id === id)
    
    if (stageIndex === -1) {
      throw new Error("Stage not found")
    }
    
    const updatedStage = {
      ...stages[stageIndex],
      ...stageData,
      id: id // Ensure id remains unchanged
    }
    
    return updatedStage
  },

  async delete(id) {
    await delay(200)
    // In a real API, this would delete the record
    // For mock service, we just simulate the delay
    return { success: true }
  }
}