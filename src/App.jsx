import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "@/contexts/AuthContext"
import { CollaborationProvider } from "@/contexts/CollaborationContext"
import Layout from "@/components/organisms/Layout"
import PipelinePage from "@/components/pages/PipelinePage"
import LoginPage from "@/components/pages/LoginPage"
import RegisterPage from "@/components/pages/RegisterPage"
import DocumentsPage from "@/components/pages/DocumentsPage"
import DocumentEditorPage from "@/components/pages/DocumentEditorPage"
import ProfilePage from "@/components/pages/ProfilePage"
import ProtectedRoute from "@/components/organisms/ProtectedRoute"

function App() {
return (
    <AuthProvider>
      <CollaborationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
                <Route path="/documents/:documentId" element={<ProtectedRoute><DocumentEditorPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              className="z-[9999]"
            />
          </div>
        </BrowserRouter>
      </CollaborationProvider>
    </AuthProvider>
  )
}

export default App