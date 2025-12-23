import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useThemeContext } from '../contexts/ThemeContext'
import { useMemo } from 'react'
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
  const { isDarkMode } = useThemeContext()

  const theme = useMemo(() => {
    return isDarkMode ? themeQuartz
      .withParams({
          backgroundColor: "#1f2836",
          browserColorScheme: "dark",
          chromeBackgroundColor: {
              ref: "foregroundColor",
              mix: 0.07,
              onto: "backgroundColor"
          },
          foregroundColor: "#FFF",
          headerFontSize: 14
      }) : themeQuartz
      .withParams({
          browserColorScheme: "light",
          headerFontSize: 14
      });
  }, [isDarkMode])

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
      <div className="data-table-container">
        <AgGridReact
          theme={theme}
          rowData={dataToDisplay}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[5,10, 20, 50, 100]}
          onRowClicked={onRowClicked}
          rowHeight={40}
          headerHeight={50}
          domLayout="autoHeight"
        />
      </div>
    </div>
  )
}