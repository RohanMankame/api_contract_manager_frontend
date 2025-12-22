import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import { isLoggedIn, logout } from './services/auth'
import { TopNav } from './components/TopNav'
import Dashboard from './pages/Dashboard'
import ClientsPage from './pages/Clients'
import ContractsPage from './pages/Contracts'
import ProductsPage from './pages/Products'

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function Home() {
  return (
    <div>
      <TopNav />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
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