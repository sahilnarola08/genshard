import { useCallback, useEffect, useState } from 'react'
import AccountDetail from './components/account-detail'
import DashboardOption from './components/dashboard-select'
import ListTicketCreated from './components/list-ticket-created'
import Inventory from './components/inventory'
import './style.sass'
import { clearGenTicketData } from '../../state/ticket/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { TicketType, TransactionStatus } from '../../state/ticket/types'
import Access from './components/access'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { calculateGasMargin, getGenTelegramContract } from '../../utils'
import { GEN_TELEGRAM_ADDRESS, TG_ADDRESS } from '../../constants'
import { BigNumber } from 'ethers/lib/ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { network } from "../../connectors";
import { useHistory } from 'react-router-dom'


const Dashboard = () => {
  const approveIssue: TicketType | undefined = useSelector<AppState>(
    (state) => state.ticket.approveAndIssue
  ) as TicketType | undefined
  const network = useSelector((state: AppState) => state.application.network)

  // conditional render tab content
  const [tab, setTab] = useState(0)
  const setOptionDashboard = useCallback((tabNum: number) => {
    setTab(tabNum)
  }, [tab])

  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()

  const onAccessHook = async (values: { username: string }) => {
    const username = values.username
    let telegram = keccak256(toUtf8Bytes(username))

    if (account === undefined || account === null) {
      toggleWalletModal()
      return
    }

    if (!library || !chainId) {
      toggleWalletModal()
      return
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<BigNumber | number | string>,
      value: BigNumber | null
    console.log(network, 'netwoek')
    console.log(TG_ADDRESS[network], 'tg network')
    const genTelegram = getGenTelegramContract(TG_ADDRESS[network], chainId, library, account)
    method = genTelegram.setTelegram
    estimate = genTelegram.estimateGas.setTelegram
    args = [
      telegram
    ]
    value = null

    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {

          addTransaction(response, {
            summary:
              'Set Telegram'
          })

          /*ReactGA.event({
              category: 'Access',
              action: 'Set Telegram',
              label: 'Set Telegram'
          })*/
        })
      )
      .catch(error => {
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  /*const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    if (approveIssue && approveIssue.status === TransactionStatus.SUCCESS) {
      dispatch(clearGenTicketData())
    }
  }, [approveIssue])*/
  const history = useHistory()

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__content">
        <DashboardOption
          tab={tab}
          setOptionDashboard={setOptionDashboard}
        />

        <div className="dashboard-page__content--layout">
          {tab === 0
            ? <Inventory />
            : tab === 1
              ? <Access onSubmit={onAccessHook} />
              : <ListTicketCreated />
          }
          <AccountDetail />
        </div>
      </div>
      <div className="applyNowForms">
        <button onClick={() => window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdEc1TiM3r5N1R7Xc5gAFadcGCfNEWK-hDQrGA3jPPxcXlYCQ/viewform`, '_blink')}>
          <span className='buttonName'>Apply for NFTO (For Projects)</span>
          <span className='applyWrapper'>
            <span className='applyNow'>Apply Now</span>
            <img src="/images/icons/applyArrow.svg" />
          </span>
        </button>
        <button onClick={() => window.open(`https://docs.google.com/forms/d/e/1FAIpQLScQ3Jt7OqcZ3N6eFnojgkfHwE8C64LwWhBvXv2oPYuc3l7Png/viewform`, '_blink')}>
          <span className='buttonName'>Become a GenShards Partner</span>
          <span className='applyWrapper'>
            <span className='applyNow'>Apply Now</span>
            <img src="/images/icons/applyArrow.svg" />
          </span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard