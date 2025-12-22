// src/pages/Clients.jsx
import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import API_PATHS from '../services/apiPaths'

export default function ClientsPage() {
  const { data: clients, loading, error } = useFetch(API_PATHS.clients)


  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ]

  if (error) return <p>Error: {error?.message || 'Failed to load clients'}</p>
  return (
    <div>
      <h2>Clients</h2>
      <DataTable rowData={clients} columnDefs={columnDefs} loading={loading} />
    </div>
  )
}