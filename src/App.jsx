// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import { isLoggedIn, logout } from './services/auth'
import Dashboard from './pages/Dashboard'
import ClientsPage from './pages/Clients'
import ContractsPage from './pages/Contracts'
import ProductsPage from './pages/Products'

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>API Contract Management System</h1>
        <button onClick={handleLogout}>Sign out</button>
      </header>
      
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => navigate('/')}>Dashboard</button>
        <button onClick={() => navigate('/clients')} style={{ marginLeft: 10 }}>Clients</button>
        <button onClick={() => navigate('/contracts')} style={{ marginLeft: 10 }}>Contracts</button>
        <button onClick={() => navigate('/products')} style={{ marginLeft: 10 }}>Products</button>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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