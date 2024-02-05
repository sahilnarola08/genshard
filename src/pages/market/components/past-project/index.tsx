import { useEffect, useState } from 'react'
import GridCard from '../grid-card'
import LiveUpWorks from '../liveup-works'
import SideBarLiveUp from '../sidebar-liveup'
import '../live-upcoming/style.sass'
import { Card, BaseProject, ExtendedProject } from '../../../../state/market/types'
import { createCardArray } from '../../helper'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { GEN_TICKET_ADDRESS, PROJECTS_DATA, PROJECTS_DATA_BSC, PROJECTS_DATA_MATIC, PROJECTS_DATA_IOTEX, PROJECTS_DATA_HARMONY, PROJECTS_DATA_AVALANCHE, PROJECTS_DATA_GOERLI, PROJECTS_DATA_MUMBAI, PROJECTS_DATA_IOTEX_NETWORK_TESTNET, PROJECTS_DATA_HARMONY_NETWORK_TESTNET, PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET, PROJECTS_DATA_BSC_NETWORK_TESTNET} from '../../../../constants'
import { getGenTicketUrl } from '../../../dashboard/dashboard.helpers'
import { getTicketMetadata } from '../../../../utils/genTicketMetadata'
import { asyncSleep } from '../../../../utils'
import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from '../../../../hooks/web3'
import LandingCard from '../landing-card'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changeCurrentProject } from '../../../../state/market/actions'
import moment from 'moment'
import { handleProjectData } from '../../helper'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import AccessPoolRedirect from '../../../../shared/components/AccessPoolRedirect'

export default function PastProjects() {
  const { account } = useActiveWeb3React()
  const [pastProjects, setPastProjects] = useState<Array<ExtendedProject>>()
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)
  const history = useHistory()
  const dispatch = useDispatch()
  const network = useSelector((state: AppState) => state.application.network)

  const getCardData = async () => {
    if (account === undefined || account === null) return
    setIsLoadingCards(true)
    
    const data = network == 'BSC' ? PROJECTS_DATA_BSC : network == 'MATIC' ? PROJECTS_DATA_MATIC : network == 'IOTEX' ? PROJECTS_DATA_IOTEX : network == 'HARMONY' ? PROJECTS_DATA_HARMONY : network == 'AVALANCHE' ? PROJECTS_DATA_AVALANCHE : network == 'GOERLI' ? PROJECTS_DATA_GOERLI : network == 'MUMBAI' ? PROJECTS_DATA_MUMBAI : network == 'T-IoTeX' ? PROJECTS_DATA_IOTEX_NETWORK_TESTNET : network == 'T-HRMNY' ? PROJECTS_DATA_HARMONY_NETWORK_TESTNET : network == 'T-AVALANCHE' ? PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET : network == 'T-BSC' ? PROJECTS_DATA_BSC_NETWORK_TESTNET : PROJECTS_DATA
    const pastData = _.filter(data, (e) => moment().unix() > parseInt(e.endDate))

    const pastPromises = pastData
      .map(async (i) => await handleProjectData(i, genMarket))

    const pastTickets = await Promise.all(pastPromises)
    setPastProjects(pastTickets)
    setIsLoadingCards(false)
  }

  useEffect(() => {
    getCardData()
  }, [])

  if (account === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div className="loading-wrapper">
          <div style={{ color: 'black', fontSize: '1.5rem', textAlign: 'center', minWidth: 300 }}>Please connect your wallet to access the marketplace</div>
        </div>
      </div>
    )
  }

  if (isLoadingCards || !pastProjects) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <div className="loading-wrapper">
          <img
            className="loading-icon"
            src="/images/icons/loading.svg"
            alt="loading"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="live-upcoming">
      <div>
        <SideBarLiveUp
          topName={'Past Projects'}
          firstSetProjects={pastProjects}
        />
      </div>
      <div className="cards-container">
        <AccessPoolRedirect />
        {pastProjects.length !== 0 ? _.map(pastProjects, (item) => {
          return (
            <LandingCard isPast={true} onClick={() => {
              dispatch(changeCurrentProject({ ...item, isPast: true }))
              history.push('/market/current-project')
            }} {...item} />
          )
        }) : <div className="non-available">No past projects available at the moment.</div>}
      </div>
    </div>
  )
}