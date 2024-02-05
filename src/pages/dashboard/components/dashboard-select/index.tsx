import { Token } from '@uniswap/sdk'
import React, { useEffect, useState } from 'react'
import Button from '../../../../shared/components/buttons'
import SelectProject from '../select-project'
import './style.sass'
import {useSelector} from 'react-redux'
import {AppState} from '../../../../state'
import { Project } from '../../../../state/ticket/types'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'
import { useActiveWeb3React } from '../../../../hooks/web3'

interface IDashboardOptionProps {
  tab: number
  setOptionDashboard: (tabNum: number) => any
}
const DashboardOption = ({
  tab,
  setOptionDashboard,
}: IDashboardOptionProps) => {
  const [showGenCreated, setShowGenCreated] = useState(false)
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);
  const { account } = useActiveWeb3React()
  useEffect(() => {
    const checkIsIssuer = async () => {
        const issuer = await genTicket(currentProject!.address).methods.issuer().call()
        setShowGenCreated(account == issuer)
    }
    if (currentProject !== undefined) {
      checkIsIssuer()
    }
  }, [currentProject])

  return (
    <div className="dashboard-select">
      {/* dashboard label */}
      <div className="dashboard-select__title">dashboard</div>
      <div className="dashboard-select__btn--container">
        <div>
        <SelectProject/>
        </div>
      </div>
      
      {/* dashboard line */}
      <div className="dashboard-select__line">
        <hr />
      </div>
      
      {/* dashboard button */}
      <Button
        onClick={() => setOptionDashboard(0)}
        className={`outline--highlight btn--select ${
          tab === 0 ? 'active' : ''
        }`}
      >
        Inventory
      </Button>
      <Button
        onClick={() => setOptionDashboard(1)}
        className={`outline--highlight btn--select ${
          tab === 1 ? 'active' : ''
        }`}
      >
        Gen Access
      </Button>
      {showGenCreated ? <Button
        onClick={() => setOptionDashboard(2)}
        className={`outline--highlight btn--select ${
          tab === 2 ? 'active' : ''
        }`}
      >
        GenTickets Created
      </Button> : null}

    </div>
  )
}

export default DashboardOption
