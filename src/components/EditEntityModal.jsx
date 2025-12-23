import { useState, useEffect } from 'react'
import api from '../services/connect'
import '../styles/EntityModalWindow.css'

export function EditEntityModal({ 
  isOpen, 
  onClose, 
  onEntityUpdated,
  title = 'Edit Item',
  endpoint = '/items',
  fields = [],
  entityData = null
}) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form data when entityData changes
  useEffect(() => {
    if (entityData && isOpen) {
      const initial = {}
      fields.forEach(field => {
        initial[field.name] = entityData[field.jsonKey || field.name] || ''
      })
      setFormData(initial)
      setError(null)
    }
  }, [entityData, isOpen, fields])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Build the request payload based on field mappings
      const payload = {}
      fields.forEach(field => {
        const value = formData[field.name]
        const key = field.jsonKey || field.name
        
        if (field.type === 'number') {
          payload[key] = Number(value)
        } else if (field.type === 'checkbox') {
          payload[key] = value
        } else {
          payload[key] = value
        }
      })

      // Construct the endpoint with the ID
      const updateEndpoint = `${endpoint}/${entityData.id}`
      await api.put(updateEndpoint, payload)
      
      onEntityUpdated()
      onClose()
    } catch (err) {
      setError(err.message || `Failed to update item`)
      console.error('Error updating item:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          {fields.map(field => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  rows={field.rows || 4}
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}