// src/components/DataTable.jsx
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '../styles/DataTable.css'

ModuleRegistry.registerModules([AllCommunityModule])

export function DataTable({ 
  rowData, 
  columnDefs, 
  loading = false,
  onRowClicked,
  pagination = true,
  pageSize = 10
}) {
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  }

  if (loading) return <div className="loading">Loading...</div>
  
  let dataToDisplay = rowData
  if (rowData && typeof rowData === 'object' && !Array.isArray(rowData)) {
    const values = Object.values(rowData)
    dataToDisplay = values[0] && Array.isArray(values[0]) ? values[0] : []
  }

  if (!dataToDisplay || dataToDisplay.length === 0) return <div className="no-data">No data available</div>

  return (
    <div className="data-table-wrapper">
      <div className="ag-theme-quartz data-table-container">
        <AgGridReact
          rowData={dataToDisplay}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onRowClicked={onRowClicked}
          rowHeight={40}
          headerHeight={50}
        />
      </div>
    </div>
  )
}