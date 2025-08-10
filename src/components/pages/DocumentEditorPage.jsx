import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCollaboration } from '@/contexts/CollaborationContext'
import { documentService } from '@/services/api/documentService'
import DocumentEditor from '@/components/organisms/DocumentEditor'
import DocumentToolbar from '@/components/organisms/DocumentToolbar'
import CollaborationSidebar from '@/components/organisms/CollaborationSidebar'
import CommentSystem from '@/components/organisms/CommentSystem'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'

export default function DocumentEditorPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { joinDocument, leaveDocument, sendDocumentChange } = useCollaboration()
  
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  
  const editorRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    if (documentId) {
      loadDocument()
      joinDocument(documentId)
    }

    return () => {
      if (documentId) {
        leaveDocument(documentId)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [documentId])

  const loadDocument = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await documentService.getById(parseInt(documentId))
      setDocument(data)
      setTempTitle(data.title)
    } catch (err) {
      setError(err.message || 'Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  const debouncedSave = debounce(async (content) => {
    if (!document) return
    
    try {
      setSaving(true)
      await documentService.update(document.Id, { 
        ...document,
        content,
        updatedAt: new Date().toISOString()
      })
      
      // Send real-time update
      sendDocumentChange(documentId, {
        type: 'content-update',
        content,
        userId: user.Id
      })
      
    } catch (err) {
      toast.error('Failed to save document')
    } finally {
      setSaving(false)
    }
  }, 1000)

  const handleContentChange = (content) => {
    if (document) {
      setDocument(prev => ({ ...prev, content }))
      debouncedSave(content)
    }
  }

  const handleTitleSave = async () => {
    if (!tempTitle.trim() || tempTitle === document.title) {
      setIsEditingTitle(false)
      setTempTitle(document.title)
      return
    }

    try {
      await documentService.update(document.Id, {
        ...document,
        title: tempTitle.trim()
      })
      
      setDocument(prev => ({ ...prev, title: tempTitle.trim() }))
      setIsEditingTitle(false)
      toast.success('Title updated')
    } catch (err) {
      toast.error('Failed to update title')
      setTempTitle(document.title)
      setIsEditingTitle(false)
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/documents/${documentId}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy share link')
    }
  }

  const exportDocument = async (format) => {
    try {
      const blob = await documentService.export(document.Id, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${document.title}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Document exported as ${format.toUpperCase()}`)
    } catch (err) {
      toast.error('Failed to export document')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDocument} />
  if (!document) return <Error message="Document not found" />

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/documents')}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Documents
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave()
                  if (e.key === 'Escape') {
                    setTempTitle(document.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-lg font-semibold border-0 px-0 focus:ring-0"
                autoFocus
              />
              <Button size="sm" onClick={handleTitleSave}>
                <ApperIcon name="Check" size={14} />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {document.title}
            </button>
          )}
          
          {saving && (
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Loader2" size={14} className="animate-spin mr-1" />
              Saving...
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={showComments ? 'bg-primary-50 text-primary-600' : ''}
          >
            <ApperIcon name="MessageSquare" size={16} className="mr-2" />
            Comments
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCollaboration(!showCollaboration)}
            className={showCollaboration ? 'bg-primary-50 text-primary-600' : ''}
          >
            <ApperIcon name="Users" size={16} className="mr-2" />
            Share
          </Button>
          
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <ApperIcon name="Share" size={16} className="mr-2" />
              Share Link
            </Button>
          </div>

          <div className="relative group">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                <button
                  onClick={() => exportDocument('pdf')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center"
                >
                  <ApperIcon name="FileText" size={14} className="mr-2" />
                  Export as PDF
                </button>
                <button
                  onClick={() => exportDocument('docx')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center"
                >
                  <ApperIcon name="FileText" size={14} className="mr-2" />
                  Export as DOCX
                </button>
                <button
                  onClick={() => exportDocument('html')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center"
                >
                  <ApperIcon name="Code" size={14} className="mr-2" />
                  Export as HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor area */}
        <div className="flex-1 flex flex-col">
          <DocumentToolbar editorRef={editorRef} />
          <div className="flex-1 overflow-auto">
            <DocumentEditor
              ref={editorRef}
              content={document.content}
              onChange={handleContentChange}
              documentId={documentId}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex">
          {showComments && (
            <div className="w-80 border-l border-gray-200 bg-gray-50">
              <CommentSystem documentId={documentId} />
            </div>
          )}
          
          {showCollaboration && (
            <div className="w-80 border-l border-gray-200 bg-gray-50">
              <CollaborationSidebar document={document} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}