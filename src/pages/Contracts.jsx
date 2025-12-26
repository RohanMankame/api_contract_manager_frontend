import { useState } from 'react'
import { useFetch } from '../hooks'
import { DataTable } from "../components/DataTable";
import { AddEntityModal } from "../components/AddEntityModal";
import { DeleteEntityModal } from "../components/DeleteEntityModal";
//import { EditEntityModalContract } from '../components/ContractComponents/EditEntityModalContract';
//import {ViewEntityModalContract} from '../components/ContractComponents/ViewEntityModalContract';
import { ViewContractModal } from '../components/ContractComponents/ViewContractModal';
import API_PATHS from '../services/apiPaths'

export default function ContractsPage() {
  // Fetch contracts and clients (for the dropdown)
  const { data: contractsData, loading, error, refetch } = useFetch(API_PATHS.contracts)
  const { data: clientsData } = useFetch(API_PATHS.clients)
  

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  const contracts = contractsData?.contracts || []
  const clients = clientsData?.clients || []

  // Define fields dynamically to include client options
  const CONTRACT_FIELDS = [
    {
      name: 'contract_name',
      label: 'Contract Name',
      type: 'text',
      required: true,
      placeholder: 'Enter contract name',
      jsonKey: 'contract_name'
    },
    {
      name: 'client_id',
      label: 'Client',
      type: 'select',
      required: true,
      options: clients,
      jsonKey: 'client_id'
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: true,
      jsonKey: 'start_date'
    },
    {
      name: 'end_date',
      label: 'End Date',
      type: 'date',
      required: true,
      jsonKey: 'end_date'
    }
    

    
  ]

  const handleRowClick = (event) => {
    setSelectedContract(event.data)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (entity) => {
    setSelectedContract(entity)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'contract_name', headerName: 'Contract Name', flex: 1 },
    { field: 'client_id', headerName: 'Client ID', width: 100 },
    { field: 'created_at', headerName: 'Created At', flex: 1 },
    {field: 'updated_at', headerName: 'Updated At', flex: 1 },
    {field: 'start_date', headerName: 'Start Date', flex: 1 },
    {field: 'end_date', headerName: 'End Date', flex: 1 }
  ]

  if (error) return <p>Error: {error?.message || 'Failed to load contracts'}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Contracts</h2>
        <input
            type="text"
            placeholder="Search contracts..."
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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-add"
        >
          + Add Contract
        </button>
      </div>

      <DataTable 
        rowData={contracts} 
        columnDefs={columnDefs} 
        loading={loading}
        onRowClicked={handleRowClick}
        quickFilterText={searchTerm}
      />

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEntityAdded={refetch}
        title="Add New Contract"
        endpoint={API_PATHS.contracts}
        fields={CONTRACT_FIELDS}
      />

      {/* <EditEntityModalContract
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEntityUpdated={refetch}
        onDeleteClick={handleDeleteClick}
        title="Edit Contract"
        endpoint={API_PATHS.contracts}
        fields={CONTRACT_FIELDS}
        entityData={selectedContract}
      /> */}
      <ViewContractModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDeleteClick={handleDeleteClick}
        title="Edit Contract"
        endpoint={API_PATHS.contracts}
        fields={CONTRACT_FIELDS}
        entityData={selectedContract}
      />

      <DeleteEntityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onEntityDeleted={refetch}
        title="Delete Contract"
        endpoint={API_PATHS.contracts}
        entityData={selectedContract}
      />
    </div>
  )
}