import mockUsers from '@/services/mockData/users'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Generate JWT-like token (mock implementation)
const generateToken = (user) => {
  return btoa(JSON.stringify({
    userId: user.Id,
    email: user.email,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }))
}

const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      throw new Error('Token expired')
    }
    return mockUsers.find(user => user.Id === payload.userId)
  } catch {
    throw new Error('Invalid token')
  }
}

export const authService = {
  async login(email, password) {
    await delay(500)
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('User not found')
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password')
    }
    
    const token = generateToken(user)
    const { password: _, ...userWithoutPassword } = user
    
    return {
      user: userWithoutPassword,
      token
    }
  },

  async register(userData) {
    await delay(500)
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already registered')
    }
    
    const newUser = {
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    
    const token = generateToken(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    
    return {
      user: userWithoutPassword,
      token
    }
  },

  async validateToken(token) {
    await delay(100)
    const user = validateToken(token)
    if (!user) {
      throw new Error('Invalid token')
    }
    
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async updateProfile(profileData) {
    await delay(300)
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('No authentication token')
    }
    
    const currentUser = validateToken(token)
    if (!currentUser) {
      throw new Error('Invalid token')
    }
    
    const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    // Handle password change
    if (profileData.newPassword) {
      if (mockUsers[userIndex].password !== profileData.currentPassword) {
        throw new Error('Current password is incorrect')
      }
      mockUsers[userIndex].password = profileData.newPassword
    }
    
    // Update other profile fields
    if (profileData.name) {
      mockUsers[userIndex].name = profileData.name
    }
    
    if (profileData.email) {
      // Check if new email is already taken
      if (mockUsers.some(u => u.email === profileData.email && u.Id !== currentUser.Id)) {
        throw new Error('Email already in use')
      }
      mockUsers[userIndex].email = profileData.email
    }
    
    mockUsers[userIndex].updatedAt = new Date().toISOString()
    
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex]
    return userWithoutPassword
  }
}