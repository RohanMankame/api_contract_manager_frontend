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
  onDeleteTier,    
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

    // Prefer nested tiers on subscription object (back-end may provide them)
    const nested = sub.tiers || sub.subscription_tiers
    if (nested && nested.length) {
      setTiersBySub(prev => ({ ...prev, [sub.id]: nested }))
      return
    }

    // Otherwise fetch all tiers and filter
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
    if (!onDeleteTier) return
    const ok = window.confirm('Delete this tier? This cannot be undone.')
    if (!ok) return
    await onDeleteTier(tierId, subId)
    // refresh the local tiers cache by removing the deleted tier if present
    setTiersBySub(prev => ({ ...prev, [subId]: (prev[subId] || []).filter(t => t.id !== tierId) }))
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

                      <div className="tier-summary-list">
                        {(loadingTiersId === s.id) ? <p>Loading tiers...</p> : (
                          tiers.length === 0 ? <p style={{ color: '#6b7280' }}>No tiers for this subscription.</p> : (
                            tiers.map(t => {
                              const start = t.start_date ? t.start_date.split('T')[0] : '—'
                              const end = t.end_date ? t.end_date.split('T')[0] : '—'
                              return (
                                <div key={t.id} className="tier-summary" onClick={(e) => e.stopPropagation()}>
                                <div className="tier-info">
                                  <div className="tier-range">
                                    <div className="tier-label">Calls</div>
                                    <div className="tier-value">{t.min_calls} — {t.max_calls}</div>
                                  </div>

                                  <div className="tier-dates">
                                    <div className="tier-label">Dates</div>
                                    <div className="tier-value">{start} → {end}</div>
                                  </div>
                                </div>

                                <div className="tier-numbers">
                                  <div className="tier-small">
                                    <div className="tier-label">Base</div>
                                    <div className="tier-value">${t.base_price}</div>
                                  </div>
                                  <div className="tier-small">
                                    <div className="tier-label">Per</div>
                                    <div className="tier-value">${t.price_per_tier}</div>
                                  </div>
                                </div>

                                <div className="tier-actions">
                                  <button className="btn-sm" onClick={() => onOpenTiers(s, t)}>Edit</button>
                                  <button className="btn-sm btn-delete" onClick={(e) => handleDeleteTier(e, t.id, s.id)}>Delete</button>
                                </div>
                              </div>
                              )
                            })
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