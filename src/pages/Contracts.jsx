import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import API_PATHS from '../services/apiPaths'


export default function ContractsPage() {
  const { data: contracts, loading } = useFetch(API_PATHS.contracts)

  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'client_id', headerName: 'Client ID' },
    { field: 'contract_name', headerName: 'Contract Name' },
  ]

  return (
    <div>
      <h2>Contracts</h2>
      <DataTable rowData={contracts} columnDefs={columnDefs} loading={loading} />
    </div>
  )
}