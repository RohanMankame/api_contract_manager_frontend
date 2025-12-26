import { useNavigate } from 'react-router-dom'
import '../../styles/EntityModalWindow.css'

export function ViewContractModal({ 
  isOpen, 
  onClose, 
  onDeleteClick,
  title = 'Contract Details',
  fields = [],
  entityData = null
}) {
  const navigate = useNavigate()

  if (!isOpen || !entityData) return null

  const handleEditClick = () => {
    onClose()
    navigate(`/contracts/${entityData.id}/edit`)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="view-modal-body" style={{ padding: '20px' }}>
          <div className="view-details-grid" style={{ display: 'grid', gap: '15px' }}>
            {fields.map(field => {
              let value = entityData[field.jsonKey || field.name] || 'N/A'
              
              // Handle select/dropdown display labels if needed
              if (field.type === 'select' && field.options) {
                const option = field.options.find(opt => opt.id === value)
                if (option) value = option.company_name || option.api_name || value
              }
              return (
                <div key={field.name} className="view-detail-item">
                  <label style={{ fontWeight: 'bold', display: 'block', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
                    {field.label}
                  </label>
                  <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px', marginTop: '4px' }}>
                    {value}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-delete"
            onClick={() => onDeleteClick(entityData)}
          >
            Delete
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn-save" onClick={handleEditClick}>
              Edit Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}