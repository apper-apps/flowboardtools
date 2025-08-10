import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  Send, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Reply
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCollaboration } from '@/contexts/CollaborationContext'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'

const CommentSystem = ({ 
  documentId,
  selectedText,
  onCommentAdd,
  onCommentResolve,
  onCommentDelete,
  className = ""
}) => {
  const { user } = useAuth()
  const { socket, comments = [] } = useCollaboration()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')
  const commentInputRef = useRef(null)

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      documentId,
      text: newComment,
      author: user,
      selectedText: selectedText || '',
      timestamp: new Date(),
      resolved: false,
      replies: []
    }

    try {
      // Add comment via socket or API
      socket?.emit('comment-add', comment)
      onCommentAdd?.(comment)
      setNewComment('')
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleReplyComment = async (parentId, replyText) => {
    if (!replyText.trim()) return

    const reply = {
      id: Date.now().toString(),
      text: replyText,
      author: user,
      timestamp: new Date()
    }

    try {
      socket?.emit('comment-reply', { parentId, reply })
      setReplyingTo(null)
      toast.success('Reply added')
    } catch (error) {
      toast.error('Failed to add reply')
    }
  }

  const handleEditComment = async (commentId, newText) => {
    if (!newText.trim()) return

    try {
      socket?.emit('comment-edit', { commentId, text: newText })
      setEditingComment(null)
      setEditText('')
      toast.success('Comment updated')
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      socket?.emit('comment-delete', { commentId })
      onCommentDelete?.(commentId)
      toast.success('Comment deleted')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const handleResolveComment = async (commentId) => {
    try {
      socket?.emit('comment-resolve', { commentId })
      onCommentResolve?.(commentId)
      toast.success('Comment resolved')
    } catch (error) {
      toast.error('Failed to resolve comment')
    }
  }

  const CommentItem = ({ comment, isReply = false }) => {
    const [showReplies, setShowReplies] = useState(true)
    const [replyText, setReplyText] = useState('')
    const isAuthor = comment.author?.id === user?.id
    const canEdit = isAuthor && !comment.resolved

    return (
      <div className={`comment-thread ${comment.resolved ? 'comment-resolved' : ''} ${isReply ? 'ml-6 mt-2' : ''}`}>
        <div className="flex items-start gap-3">
          <div
            className="user-avatar flex-shrink-0"
            style={{ backgroundColor: comment.author?.color || '#3B82F6' }}
          >
            {(comment.author?.name || 'U')[0].toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.author?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
              </span>
              {comment.resolved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  <Check size={10} />
                  Resolved
                </span>
              )}
            </div>
            
            {comment.selectedText && (
              <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1 mb-2">
                <p className="text-xs text-gray-600 italic">"{comment.selectedText}"</p>
              </div>
            )}
            
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id, editText)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(null)
                      setEditText('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.text}
              </p>
            )}
            
            {!isReply && !comment.resolved && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs"
                >
                  <Reply size={12} className="mr-1" />
                  Reply
                </Button>
                
                {canEdit && (
                  <>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditText(comment.text)
                      }}
                      className="text-xs"
                    >
                      <Edit2 size={12} className="mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Delete
                    </Button>
                  </>
                )}
                
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleResolveComment(comment.id)}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  <Check size={12} className="mr-1" />
                  Resolve
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-3 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
        
        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-3 ml-6">
            <div className="flex gap-2">
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleReplyComment(comment.id, replyText)
                    setReplyText('')
                  }
                }}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  handleReplyComment(comment.id, replyText)
                  setReplyText('')
                }}
                disabled={!replyText.trim()}
              >
                <Send size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null)
                  setReplyText('')
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`comment-system ${className}`}>
      {/* New Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-2">
          <Input
            ref={commentInputRef}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4"
          >
            <Send size={16} />
          </Button>
        </div>
        
        {selectedText && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
            <p className="text-xs text-gray-600">
              Commenting on: <span className="italic">"{selectedText}"</span>
            </p>
          </div>
        )}
      </form>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments
            .filter(comment => !comment.resolved)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p>No comments yet</p>
            <p className="text-sm">Select text and add the first comment</p>
          </div>
        )}
        
        {/* Resolved Comments */}
        {comments.some(c => c.resolved) && (
          <details className="mt-6">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer">
              Resolved Comments ({comments.filter(c => c.resolved).length})
            </summary>
            <div className="mt-3 space-y-4">
              {comments
                .filter(comment => comment.resolved)
                .map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

export default CommentSystem