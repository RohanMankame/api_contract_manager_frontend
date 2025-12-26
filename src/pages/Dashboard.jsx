// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks'
import API_PATHS from '../services/apiPaths'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()

  // optional counts - useFetch is a wrapper over SWR in your project
  const { data: contractsData } = useFetch(API_PATHS.contracts)
  const { data: clientsData } = useFetch(API_PATHS.clients)
  const { data: productsData } = useFetch(API_PATHS.products)

  const contractsCount = (contractsData?.contracts || contractsData || []).length
  const clientsCount = (clientsData?.clients || clientsData || []).length
  const productsCount = (productsData?.products || productsData || []).length

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="muted">Quick links to manage key resources</p>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn dashboard-card"
          onClick={() => navigate('/contracts')}
          aria-label="Go to contracts"
        >
          <div className="card-title">Contracts</div>
          <div className="card-count">{contractsCount}</div>
          <div className="card-sub">Manage contracts and subscriptions</div>
        </button>

        <button
          className="btn dashboard-card"
          onClick={() => navigate('/clients')}
          aria-label="Go to clients"
        >
          <div className="card-title">Clients</div>
          <div className="card-count">{clientsCount}</div>
          <div className="card-sub">View and manage clients</div>
        </button>

        <button
          className="btn dashboard-card"
          onClick={() => navigate('/products')}
          aria-label="Go to products"
        >
          <div className="card-title">Products</div>
          <div className="card-count">{productsCount}</div>
          <div className="card-sub">Manage API products</div>
        </button>
      </div>
    </div>
  )
}