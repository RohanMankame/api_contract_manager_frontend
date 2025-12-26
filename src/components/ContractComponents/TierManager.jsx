// src/components/ContractComponents/TierManager.jsx
import React, { useEffect, useState } from 'react'
import api from '../../services/connect'
import API_PATHS from '../../services/apiPaths'
import '../../styles/EntityModalWindow.css'

export default function TierManager({ subscription, onClose }) {
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('view') // 'view' | 'add' | 'edit'
  const [form, setForm] = useState({
    id: '',
    min_calls: 0,
    max_calls: 0,
    start_date: '',
    end_date: '',
    base_price: 0,
    price_per_tier: 0,
    is_archived: false,
  })
  const [error, setError] = useState(null)

  async function fetchTiers() {
    setLoading(true)
    try {
      const res = await api.get(API_PATHS.subscription_tiers)
      const all = res?.subscription_tiers || res || []
      setTiers(all.filter(t => t.subscription_id === subscription.id))
    } catch (err) {
      console.error(err)
      setTiers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subscription) fetchTiers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription])

  function openAdd() {
    setMode('add')
    setForm({ id: '', min_calls: 0, max_calls: 0, start_date: '', end_date: '', base_price: 0, price_per_tier: 0, is_archived: false })
    setError(null)
  }

  function openEdit(t) {
    setMode('edit')
    setForm({
      id: t.id,
      min_calls: t.min_calls || 0,
      max_calls: t.max_calls || 0,
      start_date: t.start_date ? t.start_date.split('T')[0] : '',
      end_date: t.end_date ? t.end_date.split('T')[0] : '',
      base_price: t.base_price || 0,
      price_per_tier: t.price_per_tier || 0,
      is_archived: !!t.is_archived,
    })
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (mode === 'add') {
        await api.post(API_PATHS.subscription_tiers, {
          subscription_id: subscription.id,
          min_calls: Number(form.min_calls),
          max_calls: Number(form.max_calls),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          base_price: Number(form.base_price),
          price_per_tier: Number(form.price_per_tier),
          is_archived: !!form.is_archived,
        })
      } else {
        await api.put(`${API_PATHS.subscription_tiers}/${form.id}`, {
          min_calls: Number(form.min_calls),
          max_calls: Number(form.max_calls),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          base_price: Number(form.base_price),
          price_per_tier: Number(form.price_per_tier),
          is_archived: !!form.is_archived,
        })
      }
      setMode('view')
      await fetchTiers()
    } catch (err) {
      setError(err.message || 'Failed to save tier')
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this tier? This cannot be undone.')
    if (!ok) return
    try {
      await api.delete(`${API_PATHS.subscription_tiers}/${id}`)
      await fetchTiers()
    } catch (err) {
      console.error(err)
      alert('Failed to delete tier')
    }
  }

  if (!subscription) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 760 }}>
        <div className="modal-header">
          <h2>Tiers — {subscription.product?.api_name || subscription.product_id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>Subscription Tiers</h4>
            <div>
              <button className="btn-add" onClick={openAdd}>Add Tier</button>
              <button className="btn-cancel" onClick={onClose}>Close</button>
            </div>
          </div>

          {loading ? <p>Loading tiers...</p> : (
            tiers.length === 0 ? <p style={{ color: '#6b7280' }}>No tiers for this subscription.</p> : (
              <table className="tier-table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Dates</th>
                    <th>Base Price</th>
                    <th>Per Tier</th>
                    <th>Archived</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map(t => (
                    <tr key={t.id}>
                      <td>{t.min_calls}</td>
                      <td>{t.max_calls}</td>
                      <td>{(t.start_date || '').split('T')[0]} - {(t.end_date || '').split('T')[0]}</td>
                      <td>{t.base_price}</td>
                      <td>{t.price_per_tier}</td>
                      <td>{t.is_archived ? 'Yes' : 'No'}</td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="btn" onClick={() => openEdit(t)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {mode !== 'view' && (
            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              {error && <div className="error-message">{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Min Calls</label>
                  <input type="number" value={form.min_calls} onChange={(e) => setForm(prev => ({ ...prev, min_calls: e.target.value }))} required />
                </div>

                <div className="form-group">
                  <label>Max Calls</label>
                  <input type="number" value={form.max_calls} onChange={(e) => setForm(prev => ({ ...prev, max_calls: e.target.value }))} required />
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label>Base Price</label>
                  <input type="number" value={form.base_price} onChange={(e) => setForm(prev => ({ ...prev, base_price: e.target.value }))} required />
                </div>

                <div className="form-group">
                  <label>Price per Tier</label>
                  <input type="number" value={form.price_per_tier} onChange={(e) => setForm(prev => ({ ...prev, price_per_tier: e.target.value }))} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <input id="tier-archived" type="checkbox" checked={form.is_archived} onChange={(e) => setForm(prev => ({ ...prev, is_archived: e.target.checked }))} />
                <label htmlFor="tier-archived">Archived</label>
              </div>

              <div className="modal-footer" style={{ marginTop: 12 }}>
                <button type="button" className="btn-cancel" onClick={() => setMode('view')}>Cancel</button>
                <button type="submit" className="btn-save">{mode === 'add' ? 'Add Tier' : 'Save Tier'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}