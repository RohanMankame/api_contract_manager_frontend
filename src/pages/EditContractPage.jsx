// src/pages/EditContractPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks'
import api from '../services/connect'
import API_PATHS from '../services/apiPaths'
import '../styles/EntityModalWindow.css'
import SubscriptionModelView from '../components/ContractComponents/SubscriptionModelView'

export default function EditContractPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: contractData, loading: fetchLoading } = useFetch(`${API_PATHS.contracts}/${id}`)
  const { data: clientsData } = useFetch(API_PATHS.clients)
  
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clients = clientsData?.clients || []

  useEffect(() => {
    if (contractData) {
      setFormData({
        contract_name: contractData.contract_name || '',
        client_id: contractData.client_id || '',
        start_date: contractData.start_date ? contractData.start_date.split('T')[0] : '',
        end_date: contractData.end_date ? contractData.end_date.split('T')[0] : ''
      })
    }
  }, [contractData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`${API_PATHS.contracts}/${id}`, formData)
      navigate('/contracts')
    } catch (err) {
      setError(err.message || 'Failed to update contract')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <p>Loading contract...</p>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 12 }}>Edit Contract</h2>

      <div className="edit-contract-layout">
        {/* Left: Contract form */}
        <div className="contract-form-card">
          <form onSubmit={handleSubmit} className="modal-form contract-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Contract Name</label>
              <input name="contract_name" value={formData.contract_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Client</label>
              <select name="client_id" value={formData.client_id} onChange={handleChange} required className="dropdown">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button type="button" className="btn-cancel" onClick={() => navigate('/contracts')}>Cancel</button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Subscriptions panel */}
        <aside className="subscription-panel">
          <div className="panel-header">
            <h3 style={{ margin: 0 }}>Subscriptions</h3>
          </div>

          <div style={{ marginTop: 12 }}>
            <SubscriptionModelView contractId={id} />
          </div>
        </aside>
      </div>
    </div>
  )
}