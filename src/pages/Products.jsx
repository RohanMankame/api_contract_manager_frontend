import { useState } from 'react'
import { useFetch } from '../hooks'
import { DataTable } from '../components/DataTable'
import { AddEntityModal } from '../components/AddEntityModal'
import { EditEntityModal } from '../components/EditEntityModal'
import { DeleteEntityModal } from '../components/DeleteEntityModal'
import API_PATHS from '../services/apiPaths'

const PRODUCT_FIELDS = [
  {
    name: 'api_name',
    label: 'API Name',
    type: 'text',
    required: true,
    placeholder: 'Enter API name',
    jsonKey: 'api_name'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    placeholder: 'Enter product description',
    jsonKey: 'description',
    rows: 4
  }
]

export default function ProductsPage() {
  const { data: products, loading, error, refetch } = useFetch(API_PATHS.products)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

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
    setSelectedProduct(event.data)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (entity) => {
    setSelectedProduct(entity)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const columnDefs = [
    { field: 'id', headerName: 'ID' },
    { field: 'api_name', headerName: 'API Name' },
    { field: 'description', headerName: 'Description' },
  ]

  if (error) return <p>Error: {error?.message || 'Failed to load products'}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Products</h2>
        <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        <div style={{ display: 'flex', gap: '10px' }}>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-add"
          >
            + Add Product
          </button>
        </div>
      </div>

      <DataTable 
        rowData={products} 
        columnDefs={columnDefs} 
        loading={loading}
        onRowClicked={handleRowDoubleClick}
        quickFilterText={searchTerm}
      />

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEntityAdded={handleEntityAdded}
        title="Add New Product"
        endpoint="/products"
        fields={PRODUCT_FIELDS}
      />

      <EditEntityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEntityUpdated={handleEntityUpdated}
        onDeleteClick={handleDeleteClick}
        title="Edit Product"
        endpoint="/products"
        fields={PRODUCT_FIELDS}
        entityData={selectedProduct}
      />

      <DeleteEntityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onEntityDeleted={handleEntityDeleted}
        title="Delete Product"
        endpoint="/products"
        entityData={selectedProduct}
      />
    </div>
  )
}