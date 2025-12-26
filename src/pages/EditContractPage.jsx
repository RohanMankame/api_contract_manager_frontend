import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks'
import api from '../services/connect'
import API_PATHS from '../services/apiPaths'
import '../styles/EntityModalWindow.css'

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
        start_date: contractData.start_date || '',
        end_date: contractData.end_date || ''
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit Contract</h2>
      <form onSubmit={handleSubmit} className="modal-form" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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

        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" className="btn-cancel" onClick={() => navigate('/contracts')}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}