// src/components/ContractComponents/SubscriptionModelView.jsx
import { useEffect, useState } from 'react'
import api from '../../services/connect'
import API_PATHS from '../../services/apiPaths'
import SubscriptionList from './SubscriptionList'
import SubscriptionFormModal from './SubscriptionFormModal'
import TierManager from './TierManager'

export default function SubscriptionModelView({ contractId }) {
  const [subscriptions, setSubscriptions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // subscription modal
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [editing, setEditing] = useState(null)

  // tiers modal (subscription and optional initialTierId)
  const [tierSub, setTierSub] = useState(null)
  const [initialTierId, setInitialTierId] = useState(null)

  async function fetchProducts() {
    try {
      const res = await api.get(API_PATHS.products)
      setProducts(res?.products || res || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchSubscriptions() {
    setLoading(true)
    try {
      const res = await api.get(API_PATHS.subscriptions)
      const list = res?.subscriptions || res || []
      setSubscriptions(list.filter(s => s.contract_id === contractId))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId])

  function openAdd() {
    setFormMode('add')
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(sub) {
    setFormMode('edit')
    setEditing(sub)
    setFormOpen(true)
  }

  async function handleSaveSubscription(payload) {
    if (formMode === 'add') {
      await api.post(API_PATHS.subscriptions, { ...payload, contract_id: contractId })
    } else {
      await api.put(`${API_PATHS.subscriptions}/${editing.id}`, payload)
    }
    setFormOpen(false)
    await fetchSubscriptions()
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this subscription? This cannot be undone.')
    if (!ok) return
    await api.delete(`${API_PATHS.subscriptions}/${id}`)
    await fetchSubscriptions()
  }

  function openTiers(sub, tier = null) {
    setTierSub(sub)
    setInitialTierId(tier ? tier.id : null)
  }

  async function handleDeleteTier(tierId, subId) {
    const ok = window.confirm('Delete this tier? This cannot be undone.')
    if (!ok) return
    try {
      await api.delete(`${API_PATHS.subscription_tiers}/${tierId}`)
      await fetchSubscriptions()
    } catch (err) {
      console.error('Failed to delete tier', err)
      alert('Failed to delete tier')
    }
  }

  return (
    <div>
      <SubscriptionList
        subscriptions={subscriptions}
        products={products}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        onOpenTiers={openTiers}
        onDeleteTier={handleDeleteTier}
      />

      <SubscriptionFormModal
        open={formOpen}
        mode={formMode}
        initial={editing || {}}
        products={products}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveSubscription}
      />

      {tierSub && (
        <TierManager
          subscription={tierSub}
          initialEditTierId={initialTierId}
          onClose={() => { setTierSub(null); setInitialTierId(null); fetchSubscriptions(); }}
        />
      )}
    </div>
  )
}