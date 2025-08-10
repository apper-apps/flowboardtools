import mockDocuments from '@/services/mockData/documents'
import mockUsers from '@/services/mockData/users'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const documentService = {
  async getAll(filter = 'all', userId) {
    await delay(300)
    
    let filteredDocs = [...mockDocuments]
    
    if (filter === 'owned') {
      filteredDocs = filteredDocs.filter(doc => doc.ownerId === userId)
    } else if (filter === 'shared') {
      filteredDocs = filteredDocs.filter(doc => 
        doc.ownerId !== userId && doc.collaborators.some(c => c.userId === userId)
      )
    }
    
    // Add owner information
    return filteredDocs.map(doc => ({
      ...doc,
      owner: mockUsers.find(user => user.Id === doc.ownerId)
    })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },

  async getById(id) {
    await delay(200)
    
    const document = mockDocuments.find(doc => doc.Id === id)
    if (!document) {
      throw new Error('Document not found')
    }
    
    return {
      ...document,
      owner: mockUsers.find(user => user.Id === document.ownerId),
      collaborators: document.collaborators.map(collab => ({
        ...collab,
        user: mockUsers.find(user => user.Id === collab.userId)
      }))
    }
  },

  async create(documentData) {
    await delay(400)
    
    const newDocument = {
      Id: Math.max(...mockDocuments.map(d => d.Id)) + 1,
      title: documentData.title || 'Untitled Document',
      content: documentData.content || '',
      ownerId: documentData.ownerId,
      collaborators: documentData.collaborators || [],
      comments: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockDocuments.push(newDocument)
    return newDocument
  },

  async update(id, data) {
    await delay(200)
    
    const docIndex = mockDocuments.findIndex(doc => doc.Id === id)
    if (docIndex === -1) {
      throw new Error('Document not found')
    }
    
    mockDocuments[docIndex] = {
      ...mockDocuments[docIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      version: mockDocuments[docIndex].version + 1
    }
    
    return mockDocuments[docIndex]
  },

  async delete(id) {
    await delay(300)
    
    const docIndex = mockDocuments.findIndex(doc => doc.Id === id)
    if (docIndex === -1) {
      throw new Error('Document not found')
    }
    
    mockDocuments.splice(docIndex, 1)
    return { success: true }
  },

  async addCollaborator(documentId, userEmail, permission = 'edit') {
    await delay(300)
    
    const document = mockDocuments.find(doc => doc.Id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    
    const user = mockUsers.find(u => u.email === userEmail)
    if (!user) {
      throw new Error('User not found')
    }
    
    if (document.collaborators.some(c => c.userId === user.Id)) {
      throw new Error('User is already a collaborator')
    }
    
    document.collaborators.push({
      userId: user.Id,
      permission,
      addedAt: new Date().toISOString()
    })
    
    document.updatedAt = new Date().toISOString()
    return document
  },

  async removeCollaborator(documentId, userId) {
    await delay(300)
    
    const document = mockDocuments.find(doc => doc.Id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    
    document.collaborators = document.collaborators.filter(c => c.userId !== userId)
    document.updatedAt = new Date().toISOString()
    
    return document
  },

  async export(documentId, format) {
    await delay(800)
    
    const document = mockDocuments.find(doc => doc.Id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    
    let content = ''
    let mimeType = ''
    
    switch (format) {
      case 'pdf':
        content = `PDF export of: ${document.title}\n\n${document.content}`
        mimeType = 'application/pdf'
        break
      case 'docx':
        content = `Word export of: ${document.title}\n\n${document.content}`
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      case 'html':
        content = `<html><head><title>${document.title}</title></head><body><h1>${document.title}</h1><div>${document.content}</div></body></html>`
        mimeType = 'text/html'
        break
      default:
        throw new Error('Unsupported format')
    }
    
    return new Blob([content], { type: mimeType })
  },

  async addComment(documentId, comment) {
    await delay(200)
    
    const document = mockDocuments.find(doc => doc.Id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    
    const newComment = {
      Id: Date.now(),
      ...comment,
      replies: [],
      resolved: false,
      createdAt: new Date().toISOString()
    }
    
    document.comments.push(newComment)
    document.updatedAt = new Date().toISOString()
    
    return newComment
  },

  async resolveComment(documentId, commentId) {
    await delay(200)
    
    const document = mockDocuments.find(doc => doc.Id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    
    const comment = document.comments.find(c => c.Id === commentId)
    if (!comment) {
      throw new Error('Comment not found')
    }
    
    comment.resolved = true
    comment.resolvedAt = new Date().toISOString()
    document.updatedAt = new Date().toISOString()
    
    return comment
  }
}