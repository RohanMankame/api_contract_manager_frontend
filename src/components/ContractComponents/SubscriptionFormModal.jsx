// src/components/ContractComponents/SubscriptionFormModal.jsx
import React, { useState, useEffect } from 'react'
import '../../styles/EntityModalWindow.css'

export default function SubscriptionFormModal({ open, mode = 'add', initial = {}, products = [], onClose, onSave }) {
  const [form, setForm] = useState({
    product_id: '',
    pricing_type: 'Fixed',
    strategy: 'Pick',
    is_archived: false,
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setForm({
        product_id: initial.product_id || '',
        pricing_type: initial.pricing_type || 'Fixed',
        strategy: initial.strategy || 'Pick',
        is_archived: !!initial.is_archived,
      })
      setError(null)
    }
  }, [open, initial])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message || 'Failed to save')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add Subscription' : 'Edit Subscription'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Product</label>
            <select
              className="dropdown"
              required
              value={form.product_id}
              onChange={(e) => setForm(prev => ({ ...prev, product_id: e.target.value }))}
            >
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.api_name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Pricing Type</label>
            <select
              className="dropdown"
              value={form.pricing_type}
              onChange={(e) => setForm(prev => ({ ...prev, pricing_type: e.target.value }))}
            >
              <option value="Fixed">Fixed</option>
              <option value="Usage">Usage</option>
            </select>
          </div>

          <div className="form-group">
            <label>Strategy</label>
            <select
              className="dropdown"
              value={form.strategy}
              onChange={(e) => setForm(prev => ({ ...prev, strategy: e.target.value }))}
            >
              <option value="Pick">Pick</option>
              <option value="All">All</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <input
              id="archived"
              type="checkbox"
              checked={form.is_archived}
              onChange={(e) => setForm(prev => ({ ...prev, is_archived: e.target.checked }))}
            />
            <label htmlFor="archived">Archived</label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">{mode === 'add' ? 'Add' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}