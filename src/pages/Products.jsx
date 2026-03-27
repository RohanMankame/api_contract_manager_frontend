// src/pages/Clients.jsx
import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import API_PATHS from '../services/apiPaths'

export default function ProductsPage() {
  const { data: products, loading } = useFetch(API_PATHS.products)

  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'api_name', headerName: 'API Name' },
    { field: 'description', headerName: 'Description' },
  ]

  return (
    <div>
      <h2>Products</h2>
      <DataTable rowData={products} columnDefs={columnDefs} loading={loading} />
    </div>
  )
}