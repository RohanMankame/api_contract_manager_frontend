import { useState } from 'react'
import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import { AddEntityModal } from '../components/AddEntityModal'
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
  },{
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEntityAdded = () => {
    refetch()
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
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#40aec2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + Add Client
        </button>
      </div>

      <DataTable rowData={clients} columnDefs={columnDefs} loading={loading} />

      <AddEntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEntityAdded={handleEntityAdded}
        title="Add New Client"
        endpoint="/clients"
        fields={CLIENT_FIELDS}
      />
    </div>
  )
}