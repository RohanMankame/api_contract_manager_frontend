import { useState } from 'react'
import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import { AddEntityModal } from '../components/AddEntityModal'
import { EditEntityModal } from '../components/EditEntityModal'
import { DeleteEntityModal } from '../components/DeleteEntityModal'
import API_PATHS from '../services/apiPaths'

const CLIENT_FIELDS = [
  {
    name: 'company_name',
    label: 'Client Name',
    type: 'text',
    required: true,
    placeholder: 'Enter client name',
    jsonKey: 'company_name'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter email address',
    jsonKey: 'email'
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    required: true,
    placeholder: 'Enter phone number',
    jsonKey: 'phone_number'
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    placeholder: 'Enter address',
    jsonKey: 'address'
  }
]

export default function ClientsPage() {
  const { data: clients, loading, error, refetch } = useFetch(API_PATHS.clients)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleEntityAdded = () => {
    refetch()
  }

  const handleEntityUpdated = () => {
    refetch()
  }

  const handleEntityDeleted = () => {
    refetch()
  }

  const handleRowDoubleClick = (event) => {
    setSelectedClient(event.data)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (entity) => {
    setSelectedClient(entity)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'company_name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ]

  if (error) return <p>Error: {error?.message || 'Failed to load clients'}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Clients</h2>
        <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              width: '250px'
            }}
          />
        <div style={{ display: 'flex-start', gap: '10px' }}>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-add"
          >
            + Add Client
          </button>
        </div>
      </div>

      <DataTable 
        rowData={clients} 
        columnDefs={columnDefs} 
        loading={loading}
        onRowClicked={handleRowDoubleClick}
        quickFilterText={searchTerm}
      />

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEntityAdded={handleEntityAdded}
        title="Add New Client"
        endpoint="/clients"
        fields={CLIENT_FIELDS}
      />

      <EditEntityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEntityUpdated={handleEntityUpdated}
        onDeleteClick={handleDeleteClick}
        title="Edit Client"
        endpoint="/clients"
        fields={CLIENT_FIELDS}
        entityData={selectedClient}
      />

      <DeleteEntityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onEntityDeleted={handleEntityDeleted}
        title="Delete Client"
        endpoint="/clients"
        entityData={selectedClient}
      />
    </div>
  )
}