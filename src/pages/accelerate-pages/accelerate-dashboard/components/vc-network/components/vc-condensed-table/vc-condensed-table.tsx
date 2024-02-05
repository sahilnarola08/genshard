import React from 'react'
import "./vc-condensed-table.sass"
import ConnectionStatusTable from '../../../partner-network/components/connection-status-table/connection-status-table'

const VcCondensedTable = () => {
  return (
    <>
      <div className='Condensed-table-section'>
        <ConnectionStatusTable />
      </div>
    </>
  )
}

export default VcCondensedTable