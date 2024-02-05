import {useState, useEffect, useMemo} from 'react'
import TicketCreated from '../ticket-created'
import '../../../creation/components/token-generation-date/style.sass'
import './style.sass'
import TokenGenerationSection from '../../../creation/components/token-generation-section'
import { Project, TicketType, TransactionStatus } from '../../../../state/ticket/types'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../../../state'
import { useAllTransactions, isTransactionRecent, useTransactionAdder } from '../../../../state/transactions/hooks'
import { TransactionDetails } from '../../../../state/transactions/reducer'
import _ from 'lodash'
import { useWeb3Contract } from '../../../../hooks/useContract'
import { abi as GEN_TICKET_ABI } from '../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../contracts/GenTickets_v1.json'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useWalletModalToggle } from '../../../../state/application/hooks'
import { calculateGasMargin, getGenTicketContract } from '../../../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { addGenTicket } from '../../../../state/ticket/actions'
import moment from 'moment'

const ListTicketCreated = () => {
  const [date, setDate] = useState<Date | undefined>()
  const [dateTemp, setTempDate] = useState<Date | undefined>()
  const [genTokenAddress, setGenTokenAddress] = useState<TicketType | undefined>()
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const genTicket = useWeb3Contract(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);

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
  const isTransOccurring = _.includes(pending, genTokenAddress ? genTokenAddress.hash : '')
  
  useEffect(() => {
    if (!isTransOccurring) {
      setGenTokenAddress({hash: genTokenAddress?.hash!, status: TransactionStatus.SUCCESS})
    }
  }, [isTransOccurring])

  useEffect(() => {
    const findDate = async () => {
      const TGE = await genTicket(currentProject!.address).methods.TGE().call()
      console.log(moment(TGE*1000).utc().unix())
      if (TGE.length < 13) {
        setDate(moment(TGE*1000).utc().toDate())
      } else {
        setDate(moment(TGE*1).utc().toDate())
      }
    }
    if (currentProject !== undefined) {
      findDate()
    }
  }, [currentProject])

  const handleChange = (dateInput: string) => {
    const date = moment(dateInput)
    setTempDate(date.toDate())
  }

  const handleClick = async () => {
    if (!library || !chainId || !account) {
      alert('Connect metamask')
      return
    }

    if (currentProject === undefined) {
      return
    }

    const genTicket = getGenTicketContract(currentProject?.projectDuration!, currentProject?.address!, chainId, library, account)

    const args = [
      moment(dateTemp!).utc(true).unix()
    ]

    return genTicket.estimateGas
      .updateTGE(...args, {})
      .then((estimatedGasLimit) => {
        return genTicket
          .updateTGE(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            // add the transaction to store and show the popup
            addTransaction(response, {
              summary: `Update Gen Ticket TGE`,
            })

            setGenTokenAddress({
              hash: response.hash,
              status: TransactionStatus.WAIT
            })

            return response.hash
          })
      })
  }

  return (
    <div>
      <TicketCreated date={date}/>
      <div style={{marginTop: 20}} className="token-date-deposit">
        <TokenGenerationSection 
          date={dateTemp}
          handleChange={handleChange}
          handleClick={handleClick}
          genTokenAddress={genTokenAddress}
        />
      </div>
    </div>
  )
}

export default ListTicketCreated
