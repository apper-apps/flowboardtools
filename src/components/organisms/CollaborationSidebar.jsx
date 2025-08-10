import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Settings, 
  Crown,
  Circle,
  X,
  Mail,
  Copy,
  Check
} from 'lucide-react'
import { useCollaboration } from '@/contexts/CollaborationContext'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const CollaborationSidebar = ({ 
  isOpen, 
  onClose,
  documentId,
  onUserInvite,
  onPermissionChange 
}) => {
  const { users, permissions, inviteUser } = useCollaboration()
  const { user: currentUser } = useAuth()
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePermission, setInvitePermission] = useState('editor')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    try {
      await inviteUser(documentId, inviteEmail, invitePermission)
      onUserInvite?.(inviteEmail, invitePermission)
      setInviteEmail('')
      setShowInviteForm(false)
      toast.success(`Invitation sent to ${inviteEmail}`)
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/documents/${documentId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Share link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy share link')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'away': return 'text-yellow-500'
      case 'offline': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getPermissionBadge = (permission) => {
    const badges = {
      owner: { text: 'Owner', color: 'bg-purple-100 text-purple-800', icon: Crown },
      editor: { text: 'Editor', color: 'bg-blue-100 text-blue-800', icon: null },
      viewer: { text: 'Viewer', color: 'bg-gray-100 text-gray-800', icon: null }
    }
    return badges[permission] || badges.viewer
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} />
          Collaboration
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Share Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Share Document</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInviteForm(!showInviteForm)}
            >
              <Mail size={16} />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
            className="w-full flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Share Link'}
          </Button>

          {showInviteForm && (
            <form onSubmit={handleInvite} className="mt-3 space-y-3">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <select
                value={invitePermission}
                onChange={(e) => setInvitePermission(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  Send Invite
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Active Users */}
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Active Users ({users?.length || 0})
          </h4>
          
          <div className="space-y-3">
            {users?.length > 0 ? users.map((user) => {
              const permission = permissions?.[user.id] || 'viewer'
              const badge = getPermissionBadge(permission)
              const isCurrentUser = user.id === currentUser?.id

              return (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="user-avatar"
                      style={{ backgroundColor: user.color || '#3B82F6' }}
                    >
                      {(user.name || 'U')[0].toUpperCase()}
                    </div>
                    <Circle 
                      size={8}
                      className={`absolute -bottom-0.5 -right-0.5 ${getStatusColor(user.status)} fill-current`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || 'Anonymous User'}
                      {isCurrentUser && ' (You)'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.icon && <badge.icon size={12} />}
                      {badge.text}
                    </span>
                    
                    {permission === 'owner' && permission !== 'owner' && (
                      <select
                        value={permission}
                        onChange={(e) => onPermissionChange?.(user.id, e.target.value)}
                        className="text-xs border-gray-300 rounded"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </select>
                    )}
                  </div>
                </div>
              )
            }) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No active users
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle size={16} />
            Recent Activity
          </h4>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Document shared with team</p>
            <p>• Table added by John Doe</p>
            <p>• Comment resolved by Jane Smith</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaborationSidebar