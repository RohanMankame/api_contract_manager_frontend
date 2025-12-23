// src/components/Sidebar.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DashboardIcon, ClientsIcon, ContractsIcon, ProductsIcon } from './SidebarIcons'
import '../styles/Sidebar.css'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', Icon: DashboardIcon },
    { path: '/clients', label: 'Clients', Icon: ClientsIcon },
    { path: '/contracts', label: 'Contracts', Icon: ContractsIcon },
    { path: '/products', label: 'Products', Icon: ProductsIcon },
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.Icon
          return (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
              title={item.label}
            >
              <span className="nav-icon">
                <Icon />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
