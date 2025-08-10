import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";

const CollaborationContext = createContext({})

export const useCollaboration = () => {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider')
  }
  return context
}

export const CollaborationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [documentUsers, setDocumentUsers] = useState({})
  const [userCursors, setUserCursors] = useState({})
  const socketRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeSocket()
    } else {
      disconnectSocket()
    }

    return () => {
      disconnectSocket()
    }
  }, [isAuthenticated, user])

const initializeSocket = () => {
    if (socketRef.current) return

    const socketInstance = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
      auth: {
        token: localStorage.getItem('authToken'),
        userId: user?.Id,
        userName: user?.name
      }
    })

    socketInstance.on('connect', () => {
      console.log('Connected to collaboration server')
      setSocket(socketInstance)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from collaboration server')
      setSocket(null)
    })

    socketInstance.on('user-joined', (userData) => {
      setConnectedUsers(prev => [...prev.filter(u => u.Id !== userData.Id), userData])
      toast.info(`${userData.name} joined the session`)
    })

    socketInstance.on('user-left', (userId) => {
      setConnectedUsers(prev => prev.filter(u => u.Id !== userId))
      setUserCursors(prev => {
        const newCursors = { ...prev }
        delete newCursors[userId]
        return newCursors
      })
    })

    socketInstance.on('document-users-updated', (users) => {
      setDocumentUsers(users)
    })

    socketInstance.on('cursor-position', ({ userId, position, userName }) => {
      if (userId !== user?.Id) {
        setUserCursors(prev => ({
          ...prev,
          [userId]: { position, userName, timestamp: Date.now() }
        }))
      }
    })

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error)
      toast.error('Connection error occurred')
    })

    socketRef.current = socketInstance
  }

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setSocket(null)
      setConnectedUsers([])
      setDocumentUsers({})
      setUserCursors({})
    }
  }

  const joinDocument = (documentId) => {
    if (socket) {
      socket.emit('join-document', { documentId, userId: user?.Id })
    }
  }

  const leaveDocument = (documentId) => {
    if (socket) {
      socket.emit('leave-document', { documentId, userId: user?.Id })
    }
  }

  const sendDocumentChange = (documentId, change) => {
    if (socket) {
      socket.emit('document-change', {
        documentId,
        change,
        userId: user?.Id,
        timestamp: Date.now()
      })
    }
  }

  const sendCursorPosition = (documentId, position) => {
    if (socket) {
      socket.emit('cursor-position', {
        documentId,
        position,
        userId: user?.Id,
        userName: user?.name
      })
    }
  }

  const addComment = (documentId, comment) => {
    if (socket) {
      socket.emit('add-comment', {
        documentId,
        comment: {
          ...comment,
          userId: user?.Id,
          userName: user?.name,
          timestamp: Date.now()
        }
      })
    }
  }

  const resolveComment = (documentId, commentId) => {
    if (socket) {
      socket.emit('resolve-comment', {
        documentId,
        commentId,
        userId: user?.Id
      })
    }
  }

  const value = {
    socket,
    connectedUsers,
    documentUsers,
    userCursors,
    isConnected: !!socket,
    joinDocument,
    leaveDocument,
    sendDocumentChange,
    sendCursorPosition,
    addComment,
    resolveComment
  }

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  )
}