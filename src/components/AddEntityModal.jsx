import { useState } from 'react'
import api from '../services/connect'
import '../styles/AddEntityModal.css'

export function AddEntityModal({ 
  isOpen, 
  onClose, 
  onEntityAdded,
  title = 'Add New Item',
  endpoint = '/items',
  fields = [] // Array of field definitions
}) {
  const [formData, setFormData] = useState(() => {
    const initial = {}
    fields.forEach(field => {
      initial[field.name] = ''
    })
    return initial
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

      await api.post(endpoint, payload)
      
      // Reset form
      const newFormData = {}
      fields.forEach(field => {
        newFormData[field.name] = ''
      })
      setFormData(newFormData)
      
      onEntityAdded()
      onClose()
    } catch (err) {
      setError(err.message || `Failed to create item`)
      console.error('Error creating item:', err)
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
                  value={formData[field.name]}
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
                  checked={formData[field.name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
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
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}