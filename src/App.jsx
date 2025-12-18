// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import { isLoggedIn, logout } from './services/auth'

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function Home() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login', { replace: true })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }




  return (
    <div style={{ padding: 20 }}>
        <h1>API Contract Management System</h1>
        <p>This is the APP (protected)</p>
        <button onClick={handleLogout}>Sign out</button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}