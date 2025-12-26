// src/components/ContractComponents/SubscriptionsList.jsx
import React from 'react'

export default function SubscriptionsList({ subscriptions = [], products = [], loading, onAdd, onEdit, onDelete, onOpenTiers }) {
  return (
    <div className="subscription-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Subscriptions</h3>
        <button className="btn-add" onClick={onAdd}>Add Subscription</button>
      </div>

      {loading ? <p>Loading subscriptions...</p> : (
        subscriptions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No subscriptions for this contract.</p>
        ) : (
          <table className="subscription-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Pricing</th>
                <th>Strategy</th>
                <th>Archived</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(s => (
                <tr key={s.id}>
                  <td>{s.product?.api_name || (products.find(p => p.id === s.product_id)?.api_name) || s.product_id}</td>
                  <td>{s.pricing_type}</td>
                  <td>{s.strategy}</td>
                  <td>{s.is_archived ? 'Yes' : 'No'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => onEdit(s)}>Edit</button>
                    <button className="btn" onClick={() => onOpenTiers(s)}>Tiers</button>
                    <button className="btn-delete" onClick={() => onDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  )
}