import { useCallback, useMemo, useState, useEffect } from 'react'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { useActiveWeb3React } from '../../../../hooks/web3'
import {
  useGetNumberOfTicketTypes,
  useGetRedeemableToken,
  useGetTicketBalance,
  useGetTicketInfo,
  useGetVestingData,
  usePolling,
} from '../../../../state/ticket/hooks'
import { asyncSleep } from '../../../../utils'
import { getTicketMetadata } from '../../../../utils/genTicketMetadata'
import { INTERVAL_FETCH_TIME } from '../../dashboard.config'
import { getGenTicketUrl } from '../../dashboard.helpers'
import ModalTicketView from '../modal-ticket-view'
import TokenInventory from '../token-inventory'
import './style.sass'
import { InventoryTicketDto } from './types'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { Project } from '../../../../state/ticket/types'
import _ from 'lodash'
import moment from 'moment'

const Inventory = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const [tickets, setTickets] = useState<InventoryTicketDto[]>([])
  const [isOpenModal, setOpenModal] = useState(false)
  const [showNoOwned, setShowNoOwned] = useState(false)
  const [refreshData, setRefreshData] = useState(false)
  const [refundLoader, setRefundLoader] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<
    InventoryTicketDto | undefined
  >(undefined)

  const handleView = (ticket: InventoryTicketDto) => {
    setCurrentTicket(ticket)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setCurrentTicket(undefined)
  }

  const getTicketBalance = useGetTicketBalance()
  const getTicketInfo = useGetTicketInfo()
  const getNumberOfTicketTypes = useGetNumberOfTicketTypes()
  const getVestingData = useGetVestingData()
  const getRedeemableToken = useGetRedeemableToken()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);

  useEffect(() => {
    setTickets([])
    setShowNoOwned(false)
  }, [currentProject])

  useEffect(() => {
    handleFetchTicket()
  }, [currentProject, account, refreshData])

  const handleFetchTicket = useCallback(async () => {
    try {
      const numTicketTypes = await getNumberOfTicketTypes();  
      if (currentProject !== undefined && account !== undefined) {
        const [vestData, tge] = await Promise.all([
          getVestingData(0, currentProject?.projectDuration!),
          genTicket(currentProject!.address).methods.TGE().call()
        ])

        // let numTranchesDeep;
        // if (vestData?.lengthOfTranche! >= 1)
        // {
        //   const numberOfEligibleTranches = Math.floor((moment().unix() - ((vestData?.lengthOfTranche! * vestData?.lengthOfCliff!) + tge)) / (vestData?.lengthOfTranche!));
        //   console.log('numberOfEligibleTranches11111111', numTranchesDeep);
        //   if (numberOfEligibleTranches <= 0 && vestData?.lengthOfCliff! == 0) {
        //     numTranchesDeep = 1
        //   }else if (numberOfEligibleTranches >= vestData?.totalTranches!) {
        //     numTranchesDeep = vestData?.totalTranches!
        //   } else{
        //     numTranchesDeep = numberOfEligibleTranches + 1
        //   }
        // } else {
        //   numTranchesDeep = 1
        // }

        // const numberOfEligibleTranches = Math.floor(((moment().unix() - ((Number(vestData?.lengthOfTranche!) * Number(vestData?.lengthOfCliff!)) + Number(tge))) / Number(vestData?.lengthOfTranche!)))
        // let numTranchesDeep;
        // if (numberOfEligibleTranches > vestData?.totalTranches!) {
        //   numTranchesDeep = vestData?.totalTranches!
        // } else if (numberOfEligibleTranches <= 0 && vestData?.lengthOfCliff! == 0) {
        //   numTranchesDeep = 2
        // } else {
        //   numTranchesDeep = numberOfEligibleTranches + 2
        // }
        console.log('vestData-->', vestData);
        const totalTix = numTicketTypes * (Number(vestData?.totalTranches!) + 1);
        console.log('totalTix-->', totalTix, vestData?.totalTranches!);
        const uris = await Promise.all(_.map(_.range(0, numTicketTypes), (i) => genTicket(currentProject!.address).methods.uri(i).call()))
        console.log('URIs', uris);

        const ticketMetas = await Promise.all(_.map(_.range(0, numTicketTypes), (i) => getTicketMetadata(getGenTicketUrl(uris[i], i)).catch(
          (err) => {
            console.error('[Inventory][handleFetchTicket]', err)
            return {}
          }
        )
        ))

        const balances = await Promise.all(_.map(_.range(0, totalTix), (i) => getTicketBalance(i)))
        console.log('balances-->', balances);
        const remainingTix = _.filter(_.range(0, totalTix), (i) => balances[i] !== 0)
        console.log('remainingTix-->', remainingTix);
        const ticketPromises = new Array(remainingTix.length)
          .fill(undefined)
          .map(async (item, index) => {
            // debugger;
            try {
              const balance = balances[remainingTix[index]]
              
              if (parseInt(balance) === 0) {
                return
              }
 
              const [
                vestingData,
                redeemableToken,
              ] = await Promise.all([
                getVestingData(remainingTix[index], currentProject?.projectDuration!),
                getRedeemableToken(remainingTix[index], currentProject?.projectDuration!),
              ])
              
              return new InventoryTicketDto(
                ticketMetas[index % numTicketTypes],
                balance,
                vestingData,
                redeemableToken,
                index
              )
            } catch (error) {
              return;
            }
          })

        let ticketsFinal = await Promise.all(ticketPromises)
        ticketsFinal = _.without(ticketsFinal, undefined)
        
        // @ts-ignore
        setTickets(ticketsFinal)
        if (ticketsFinal.length === 0) {
          setShowNoOwned(true)
        } else {
          setShowNoOwned(false)
        }
      }
    } catch (err) {
      setShowNoOwned(true)
    }
  }, [getTicketBalance, getTicketInfo, getRedeemableToken, currentProject])


  return useMemo(
    () => {
      if (currentProject === undefined) {
        return (
          <div className="inventory_non_available">
            No Gen Tickets Are Available Yet
          </div>
        )
      }

      return (<div className="inventory">
        <div className={`inventory__list ${showNoOwned ? 'dont-own-display' : ''}`}>
          {showNoOwned ?
            <div className="show-no-owned">You do not own any of these tickets</div>
            : (!!tickets.length && !refundLoader) ? (
              tickets?.map((ticket, index) => (
                <div key={index} className="ticket-item">
                  <TokenInventory onView={handleView} ticket={ticket} setRefreshData={setRefreshData} setRefundLoader={setRefundLoader}/>
                </div>
              ))
            ) : (
              <img
                className="loading-icon"
                src="/images/icons/loading.svg"
                alt="loading"
              />
            )}

          <ModalTicketView
            ticket={currentTicket}
            isOpen={isOpenModal}
            onClose={closeModal}
          />
        </div>
      </div>)
    },
    [JSON.stringify(tickets), isOpenModal, currentProject, showNoOwned, refundLoader]
  )
}

export default Inventory
