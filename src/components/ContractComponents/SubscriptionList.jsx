// src/components/ContractComponents/SubscriptionList.jsx
import React, { useState } from 'react'
import api from '../../services/connect'
import API_PATHS from '../../services/apiPaths'

export default function SubscriptionsList({
  subscriptions = [],
  products = [],
  loading,
  onAdd,
  onEdit,
  onDelete,
  onOpenTiers,
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [tiersBySub, setTiersBySub] = useState({})
  const [loadingTiersId, setLoadingTiersId] = useState(null)

  async function toggleExpand(sub) {
    if (expandedId === sub.id) {
      setExpandedId(null)
      return
    }

    setExpandedId(sub.id)
    if (!tiersBySub[sub.id]) {
      setLoadingTiersId(sub.id)
      try {
        const res = await api.get(API_PATHS.subscription_tiers)
        const all = res?.subscription_tiers || res || []
        setTiersBySub(prev => ({ ...prev, [sub.id]: all.filter(t => t.subscription_id === sub.id) }))
      } catch (err) {
        console.error('Failed to load tiers', err)
        setTiersBySub(prev => ({ ...prev, [sub.id]: [] }))
      } finally {
        setLoadingTiersId(null)
      }
    }
  }

  async function handleDeleteTier(e, tierId, subId) {
    e.stopPropagation()
    const ok = window.confirm('Delete this tier? This cannot be undone.')
    if (!ok) return
    try {
      await api.delete(`${API_PATHS.subscription_tiers}/${tierId}`)
      const res = await api.get(API_PATHS.subscription_tiers)
      const all = res?.subscription_tiers || res || []
      setTiersBySub(prev => ({ ...prev, [subId]: all.filter(t => t.subscription_id === subId) }))
    } catch (err) {
      console.error('Failed to delete tier', err)
      alert('Failed to delete tier')
    }
  }

  return (
    <div className="subscription-section">
      <div className="panel-header" style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Subscriptions</h3>
        <button className="btn-add" onClick={onAdd}>Add Subscription</button>
      </div>

      {loading ? <p>Loading subscriptions...</p> : (
        subscriptions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No subscriptions for this contract.</p>
        ) : (
          <div className="subscription-accordion">
            {subscriptions.map(s => {
              const productName = s.product?.api_name || (products.find(p => p.id === s.product_id)?.api_name) || s.product_id
              const isExpanded = expandedId === s.id
              const tiers = tiersBySub[s.id] || []

              return (
                <div key={s.id} className={`subscription-card ${isExpanded ? 'expanded' : ''}`}>
                  <div
                    className="subscription-card-header"
                    onClick={() => toggleExpand(s)}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="subscription-title">{productName}</div>
                      <div className="subscription-meta">{s.pricing_type} • {s.strategy}</div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        className="btn-sm btn-ghost"
                        onClick={(e) => { e.stopPropagation(); onEdit(s) }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-sm"
                        onClick={(e) => { e.stopPropagation(); onOpenTiers(s) }}
                      >
                        Tiers
                      </button>

                      <button
                        className="btn-sm btn-delete"
                        onClick={(e) => { e.stopPropagation(); onDelete(s.id) }}
                      >
                        Delete
                      </button>

                      <div className="accordion-toggle" aria-hidden>{isExpanded ? '▲' : '▼'}</div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="subscription-card-body">
                      <div style={{ marginBottom: 12 }}>
                        <strong>Product:</strong> {productName} &nbsp;•&nbsp;
                        <strong>Pricing:</strong> {s.pricing_type} &nbsp;•&nbsp;
                        <strong>Strategy:</strong> {s.strategy} &nbsp;•&nbsp;
                        <strong>Archived:</strong> {s.is_archived ? 'Yes' : 'No'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0 }}>Tiers</h4>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn" onClick={(e) => { e.stopPropagation(); onOpenTiers(s) }}>Add / Manage Tiers</button>
                          </div>
                        </div>

                        {loadingTiersId === s.id ? <p>Loading tiers...</p> : (
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
                                      <button className="btn" onClick={(e) => { e.stopPropagation(); onOpenTiers(s) }}>Edit</button>
                                      <button className="btn-delete" onClick={(e) => handleDeleteTier(e, t.id, s.id)}>Delete</button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}