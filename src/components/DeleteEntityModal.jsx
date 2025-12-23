import { useState } from 'react'
import api from '../services/connect'
import '../styles/EntityModalWindow.css'

export function DeleteEntityModal({ 
  isOpen, 
  onClose, 
  onEntityDeleted,
  title = 'Delete Item',
  endpoint = '/',
  entityData = null
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      const deleteEndpoint = `${endpoint}/${entityData.id}`
      await api.delete(deleteEndpoint)
      
      onEntityDeleted()
      onClose()
    } catch (err) {
      setError(err.message || `Failed to delete item`)
      console.error('Error deleting item:', err)
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

        <div className="delete-confirmation">
          {error && <div className="error-message">{error}</div>}
          <p>Are you sure you want to archive this item?</p>
        </div>

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
            type="button"
            className="btn-delete"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Archiving...' : 'Confirm Archive'}
          </button>
        </div>
      </div>
    </div>
  )
}