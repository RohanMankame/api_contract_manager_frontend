import { useState, useEffect } from 'react'
import api from '../../services/connect'
import '../../styles/EntityModalWindow.css'

export function EditEntityModalContract({ 
  isOpen, 
  onClose, 
  onEntityUpdated,
  onDeleteClick,
  title = 'Edit Contract',
  endpoint = '/contracts',
  fields = [],
  entityData = null
}) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {}
      fields.forEach(field => {
        const value = formData[field.name]
        const key = field.jsonKey || field.name
        payload[key] = field.type === 'number' ? Number(value) : value
      })

      await api.put(`${endpoint}/${entityData.id}`, payload)
      
      onEntityUpdated()
      onClose()
    } catch (err) {
      setError(err.message || `Failed to update contract`)
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
              
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className='dropdown'
                >
                  <option value="">Select {field.label}</option>
                  {Array.isArray(field.options) && field.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.company_name || option.api_name}
                    </option>
                  ))}
                </select>
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
              className="btn-delete"
              onClick={() => onDeleteClick(entityData)}
              disabled={loading}
            >
              Delete
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
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
          </div>
        </form>
      </div>
    </div>
  )
}