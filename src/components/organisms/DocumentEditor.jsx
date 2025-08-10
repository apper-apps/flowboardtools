import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { useCollaboration } from '@/contexts/CollaborationContext'

const DocumentEditor = ({ 
  content, 
  onChange, 
  editable = true,
  className = "" 
}) => {
  const { socket, documentId, users } = useCollaboration()
  const editorRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight,
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        spellcheck: 'false',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  useEffect(() => {
    if (editor && socket && documentId) {
      // Handle collaborative editing events
      const handleContentUpdate = (data) => {
        if (data.documentId === documentId && data.content !== editor.getHTML()) {
          editor.commands.setContent(data.content, false)
        }
      }

      socket.on('document-updated', handleContentUpdate)
      
      return () => {
        socket.off('document-updated', handleContentUpdate)
      }
    }
  }, [editor, socket, documentId])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`document-editor ${className}`}>
      <EditorContent 
        editor={editor} 
        ref={editorRef}
        className="min-h-[500px] bg-white rounded-lg border border-gray-200"
      />
      
      {/* User presence indicators */}
      {users && users.length > 0 && (
        <div className="fixed bottom-4 right-4 flex -space-x-2">
          {users.slice(0, 5).map((user, index) => (
            <div
              key={user.id || index}
              className="user-avatar online"
              style={{ backgroundColor: user.color || '#3B82F6' }}
              title={user.name || 'Anonymous User'}
            >
              {(user.name || 'A')[0].toUpperCase()}
            </div>
          ))}
          {users.length > 5 && (
            <div className="user-avatar" style={{ backgroundColor: '#6B7280' }}>
              +{users.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentEditor