import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { documentService } from '@/services/api/documentService'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'
import { formatDistance } from 'date-fns'

export default function DocumentsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, owned, shared
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [filter])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await documentService.getAll(filter, user.Id)
      setDocuments(data)
    } catch (err) {
      setError(err.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const createDocument = async () => {
    try {
      setIsCreating(true)
      const newDoc = await documentService.create({
        title: 'Untitled Document',
        content: '',
        ownerId: user.Id,
        collaborators: []
      })
      navigate(`/documents/${newDoc.Id}`)
    } catch (err) {
      toast.error('Failed to create document')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await documentService.delete(documentId)
      await loadDocuments()
      toast.success('Document deleted successfully')
    } catch (err) {
      toast.error('Failed to delete document')
    }
  }

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDocuments} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Create and collaborate on documents</p>
          </div>
          <Button
            onClick={createDocument}
            disabled={isCreating}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            {isCreating ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Document
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All Documents
            </Button>
            <Button
              variant={filter === 'owned' ? 'default' : 'outline'}
              onClick={() => setFilter('owned')}
              size="sm"
            >
              My Documents
            </Button>
            <Button
              variant={filter === 'shared' ? 'default' : 'outline'}
              onClick={() => setFilter('shared')}
              size="sm"
            >
              Shared with Me
            </Button>
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No documents found"
          description={searchTerm ? "Try adjusting your search terms" : "Create your first document to get started"}
          action={searchTerm ? null : (
            <Button onClick={createDocument} className="bg-primary-500 hover:bg-primary-600 text-white">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Document
            </Button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div
              key={document.Id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
            >
              <Link to={`/documents/${document.Id}`} className="block p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="FileText" size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {document.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {document.owner?.name === user?.name ? 'Owned by you' : `Owned by ${document.owner?.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deleteDocument(document.Id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={document.ownerId !== user?.Id}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {document.content.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Updated {formatDistance(new Date(document.updatedAt), new Date(), { addSuffix: true })}
                  </span>
                  {document.collaborators?.length > 0 && (
                    <div className="flex items-center">
                      <ApperIcon name="Users" size={12} className="mr-1" />
                      {document.collaborators.length + 1}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}