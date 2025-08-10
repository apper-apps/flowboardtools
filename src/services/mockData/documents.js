const mockDocuments = [
  {
    Id: 1,
    title: 'Product Requirements Document',
    content: '<h1>Product Requirements Document</h1><p>This document outlines the requirements for our new product feature...</p><h2>User Stories</h2><ul><li>As a user, I want to be able to create documents</li><li>As a user, I want to collaborate in real-time</li></ul>',
    ownerId: 1,
    collaborators: [
      { userId: 2, permission: 'edit', addedAt: '2024-01-15T11:00:00Z' },
      { userId: 3, permission: 'view', addedAt: '2024-01-15T12:00:00Z' }
    ],
    comments: [
      {
        Id: 1,
        content: 'Great start! Can we add more details about the user interface?',
        userId: 2,
        userName: 'Jane Smith',
        selection: { from: 120, to: 150 },
        resolved: false,
        replies: [],
        createdAt: '2024-01-15T13:00:00Z'
      }
    ],
    version: 3,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T15:45:00Z'
  },
  {
    Id: 2,
    title: 'Team Meeting Notes',
    content: '<h1>Team Meeting - January 16, 2024</h1><h2>Attendees</h2><ul><li>John Doe</li><li>Jane Smith</li><li>Bob Johnson</li></ul><h2>Agenda</h2><ol><li>Project updates</li><li>Sprint planning</li><li>Q&A</li></ol><p>Meeting notes and action items go here...</p>',
    ownerId: 2,
    collaborators: [
      { userId: 1, permission: 'edit', addedAt: '2024-01-16T09:00:00Z' },
      { userId: 3, permission: 'edit', addedAt: '2024-01-16T09:00:00Z' }
    ],
    comments: [],
    version: 2,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T16:30:00Z'
  },
  {
    Id: 3,
    title: 'API Documentation',
    content: '<h1>API Documentation</h1><p>This document describes the REST API endpoints for our application.</p><h2>Authentication</h2><p>All API requests require authentication via JWT tokens.</p><h2>Endpoints</h2><h3>GET /api/documents</h3><p>Retrieves a list of documents...</p>',
    ownerId: 3,
    collaborators: [
      { userId: 1, permission: 'view', addedAt: '2024-01-17T10:00:00Z' }
    ],
    comments: [
      {
        Id: 2,
        content: 'Should we include rate limiting information?',
        userId: 1,
        userName: 'John Doe',
        selection: { from: 200, to: 250 },
        resolved: true,
        resolvedAt: '2024-01-17T16:00:00Z',
        replies: [
          {
            Id: 3,
            content: 'Good point! I\'ll add that section.',
            userId: 3,
            userName: 'Bob Johnson',
            createdAt: '2024-01-17T15:30:00Z'
          }
        ],
        createdAt: '2024-01-17T15:00:00Z'
      }
    ],
    version: 1,
    createdAt: '2024-01-17T14:30:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  },
  {
    Id: 4,
    title: 'Marketing Strategy Q1',
    content: '<h1>Q1 Marketing Strategy</h1><p>Our marketing goals for the first quarter include...</p><h2>Target Audience</h2><p>Primary demographics and user personas...</p><h2>Campaigns</h2><table><tr><th>Campaign</th><th>Budget</th><th>Timeline</th></tr><tr><td>Social Media</td><td>$5,000</td><td>Jan-Mar</td></tr></table>',
    ownerId: 1,
    collaborators: [
      { userId: 2, permission: 'edit', addedAt: '2024-01-18T08:00:00Z' }
    ],
    comments: [],
    version: 1,
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z'
  }
]

export default mockDocuments