import { useEffect, useState } from 'react'
import SideBarLiveUp from '../sidebar-liveup'
import './style.sass'
import { BaseProject, ExtendedProject } from '../../../../state/market/types'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_MARKET_ABI } from '../../../../contracts/GenMarket.json'
import { useActiveWeb3React } from '../../../../hooks/web3'
import LandingCard from '../landing-card'
import _ from 'lodash'
import { changeCurrentProject } from '../../../../state/market/actions'
import { AppDispatch } from '../../../../state'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { GEN_TICKET_ADDRESS, PROJECTS_DATA, PROJECTS_DATA_BSC, PROJECTS_DATA_MATIC, PROJECTS_DATA_IOTEX, PROJECTS_DATA_HARMONY, PROJECTS_DATA_AVALANCHE, PROJECTS_DATA_GOERLI, PROJECTS_DATA_MUMBAI, PROJECTS_DATA_IOTEX_NETWORK_TESTNET, PROJECTS_DATA_HARMONY_NETWORK_TESTNET, PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET, PROJECTS_DATA_BSC_NETWORK_TESTNET } from '../../../../constants'
import moment from 'moment'
import { handleProjectData } from '../../helper'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import AccessPoolRedirect from '../../../../shared/components/AccessPoolRedirect'

export default function LiveUpComing() {
  const { account } = useActiveWeb3React()
  const [liveProjects, setLiveProjects] = useState<Array<ExtendedProject>>()
  const [upcomingProjects, setUpcomingProjects] = useState<Array<ExtendedProject>>()
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const genMarket = useWeb3Contract(GEN_MARKET_ABI)
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const network = useSelector((state: AppState) => state.application.network)
  const { selectedProjectType = '' }: any = useSelector<AppState>((state) => state.dashboard)

  useEffect(() => {
    getCardData()
  }, [account, selectedProjectType])


  const getCardData = async () => {
    setIsLoadingCards(true)
    if (account === undefined || account === null) {
      setIsLoadingCards(false)
      return
    }

    // console.log('network URL --> ', network);

    let data = network == 'BSC' ? PROJECTS_DATA_BSC : network == 'MATIC' ? PROJECTS_DATA_MATIC : network == 'IOTEX' ? PROJECTS_DATA_IOTEX : network == 'HARMONY' ? PROJECTS_DATA_HARMONY : network == 'AVALANCHE' ? PROJECTS_DATA_AVALANCHE : network == 'GOERLI' ? PROJECTS_DATA_GOERLI : network == 'MUMBAI' ? PROJECTS_DATA_MUMBAI : network == 'T-IoTeX' ? PROJECTS_DATA_IOTEX_NETWORK_TESTNET : network == 'T-HRMNY' ? PROJECTS_DATA_HARMONY_NETWORK_TESTNET : network == 'T-AVALANCHE' ? PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET : network == 'T-BSC' ? PROJECTS_DATA_BSC_NETWORK_TESTNET : PROJECTS_DATA
    if (selectedProjectType === 'nftCollection') {
      data = data.filter((project: any) => project && project.projectType === "nftCollection")
    } else {
      data = data.filter((project: any) => project && project.projectType ? project.projectType !== "nftCollection" : true)
    }
    // console.log(selectedProjectType, "data=====================================")
    console.log(data, "data=====================================")
    const liveData = _.filter(data, (e) => moment().unix() < parseInt(e.endDate) && moment().unix() > e.timeline[0].date)
    const upcomingData = _.filter(data, (e) => moment().unix() < e.timeline[0].date)

    const livePromises = liveData
      .map(async (i) => await handleProjectData(i, genMarket))

    const upcomingPromises = upcomingData
      .map(async (i) => await handleProjectData(i, genMarket))

    const liveTickets = await Promise.all(livePromises)
    const upcomingTickets = await Promise.all(upcomingPromises)

    setLiveProjects(liveTickets)
    setUpcomingProjects(upcomingTickets)
    setIsLoadingCards(false)
  }

  if (isLoadingCards) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
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

  if (account === null || !liveProjects || !upcomingProjects) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div className="loading-wrapper">
          <div style={{ color: 'black', fontSize: '1.5rem', textAlign: 'center', minWidth: 300 }}>Please connect your wallet to access the marketplace</div>
        </div>
      </div>
    )
  }

  return (
    <div className="live-upcoming">
      <div>
        <SideBarLiveUp
          topName={'Live'}
          firstSetProjects={liveProjects!}
          secondSetProjects={upcomingProjects!}
        />
      </div>
      <div className="cards-container">
        <AccessPoolRedirect />
        {[...liveProjects!, ...upcomingProjects!].length !== 0 ? _.map([...liveProjects!, ...upcomingProjects!], (item) => {
          return (
            <LandingCard {...item} onClick={() => {
              dispatch(changeCurrentProject(item))
              if (item.name.toLowerCase() !== "ACKNOLEDGER NFT COLLECTION".toLowerCase() && item.name.toLowerCase() !== "POLKER INO".toLowerCase()) {
                history.push('/market/current-project')
              }
              else {
                history.push('/market/buy-nfts')
              }
            }} />
          )
        }) : <div className="non-available">No live/upcoming projects available at the moment.</div>}
      </div>
    </div>
  )
}
