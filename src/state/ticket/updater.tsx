import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '..'
import { useWeb3Contract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { useBlockNumber } from '../application/hooks'
import { abi as GEN_FACTORY_ABI } from '../../contracts/GenFactory.json'
import {
  FACTORY_ADDRESS,
  FROM_BLOCK,
  FROM_BLOCK_BSC,
  GEN_FACTORY_ADDRESS,
  GEN_FACTORY_ADDRESS_BSC
} from '../../constants'
import {
  genTicketSuccess,
  genTicketDateConfirmed,
  approveIssueConfirmed,
  approveDepositConfirmed,
  clearGenTicketData,
  updateCurrentProject
} from './actions'
import { useAllTransactions, isTransactionRecent } from '../transactions/hooks'
import { TransactionDetails } from '../transactions/reducer'
import _ from 'lodash'
import { TransactionStatus } from './types'

export default function Updater() {
  const { chainId, library } = useActiveWeb3React()
  const network = useSelector((state: AppState) => state.application.network)
  const getFactoryContract = useWeb3Contract(GEN_FACTORY_ABI)
  const contract = getFactoryContract(FACTORY_ADDRESS[network])

  const dispatch = useDispatch<AppDispatch>()

  const lastBlockNumber = useBlockNumber()

  const lockTicket = useSelector((state: AppState) => state.ticket.lockTicket)

  const genTicketHash = useSelector(
    (state: AppState) => state.ticket.genTicket?.hash
  )

  const approveDepositHash = useSelector(
    (state: AppState) => state.ticket.approveDeposit?.hash
  )

  const approveAndIssueHash = useSelector(
    (state: AppState) => state.ticket.approveAndIssue?.hash
  )

  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter(isTransactionRecent)
      .sort(
        (a: TransactionDetails, b: TransactionDetails) =>
          b.addedTime - a.addedTime
      )
  }, [allTransactions])
  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash)
  const isGenOccurring = _.includes(pending, genTicketHash ? genTicketHash : '')
  const isDepOccurring = _.includes(
    pending,
    approveDepositHash ? approveDepositHash : ''
  )
  const isIssueOccurring = _.includes(
    pending,
    approveAndIssueHash ? approveAndIssueHash : ''
  )

  useEffect(() => {
    dispatch(clearGenTicketData())
    dispatch(updateCurrentProject(network))
  }, [network])

  useEffect(() => {
    if (!isGenOccurring && genTicketHash !== undefined) {
      dispatch(genTicketDateConfirmed())
    }
  }, [isGenOccurring])

  useEffect(() => {
    if (!isDepOccurring && approveDepositHash !== undefined) {
      dispatch(approveDepositConfirmed())
    }
  }, [isDepOccurring])

  useEffect(() => {
    if (!isIssueOccurring && approveAndIssueHash !== undefined) {
      dispatch(approveIssueConfirmed())
    }
  }, [isIssueOccurring])

  // usecase:
  // + lockticket
  // + set gen date token
  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return
    if (lockTicket?.hash && !isNaN(lastBlockNumber!)) {
      contract
        .getPastEvents('TicketCreated', {
          fromBlock: lastBlockNumber! - 1000,
          toBlock: lastBlockNumber!
        })
        .then((events) => {
          for (let i = 0; i < events.length; i++) {
            if (events[i].transactionHash === lockTicket?.hash) {
              const genTicket = events[i].returnValues.genTicket
              // remove lockTicketHash & store the genTicket to store
              dispatch(genTicketSuccess({ genTicket }))
            }
          }
        })
        .catch((err) => {
          console.error(
            '[TicketUpdater] get error PastEvent TicketCreated',
            err
          )
        })
    }
  }, [chainId, library, lastBlockNumber, dispatch, lockTicket, network])

  return null
}
