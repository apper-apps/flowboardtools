import dealsData from "@/services/mockData/deals.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Clone data to prevent mutations
const cloneDeals = () => JSON.parse(JSON.stringify(dealsData))

export const dealService = {
  async getAll() {
    await delay(300)
    return cloneDeals()
  },

  async getById(id) {
    await delay(200)
    const deals = cloneDeals()
    const deal = deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return deal
  },

  async create(dealData) {
    await delay(400)
    const deals = cloneDeals()
    
    // Find highest Id and add 1
    const maxId = Math.max(...deals.map(d => d.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData
    }
    
    return newDeal
  },

  async update(id, dealData) {
    await delay(300)
    const deals = cloneDeals()
    const dealIndex = deals.findIndex(d => d.Id === parseInt(id))
    
    if (dealIndex === -1) {
      throw new Error("Deal not found")
    }
    
    const updatedDeal = {
      ...deals[dealIndex],
      ...dealData,
      Id: parseInt(id) // Ensure Id remains integer
    }
    
    return updatedDeal
  },

  async delete(id) {
    await delay(250)
    // In a real API, this would delete the record
    // For mock service, we just simulate the delay
    return { success: true }
  }
}