import { useMemo, useState, useEffect } from 'react'
import Button from '../../../../shared/components/buttons'
import './style.sass'
import { getUnixTime, fromUnixTime } from 'date-fns'
import {
  useApproveDeposit,
  useSetTokenGenDate,
  useIssue,
} from '../../../../state/ticket/hooks'
import { clearGenTicketData } from '../../../../state/ticket/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../../../state'
import { setGenDate } from '../../../../state/ticket/actions'
import { TicketType, TransactionStatus } from '../../../../state/ticket/types'
import Loader from '../../../../shared/components/Loader'
import TokenGenerationSection from '../token-generation-section'
import moment from 'moment'

interface ITokenGenerationDate {
  isLock: boolean
}

const TokenGenerationDate = ({ isLock }: ITokenGenerationDate) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const setTokenGenDate = useSetTokenGenDate()
  const approveDepositCallback = useApproveDeposit()
  const approveIssueCallback = useIssue()
  const dispatch = useDispatch<AppDispatch>()
  const [pending, setPending] = useState(false)

  const genTokenDate: number | undefined = useSelector<AppState>(
    (state) => state.ticket.genTokenDate
  ) as number | undefined

  const genTokenAddress: TicketType | undefined = useSelector<AppState>(
    (state) => state.ticket.genTicket
  ) as TicketType | undefined

  const approveIssue: TicketType | undefined = useSelector<AppState>(
    (state) => state.ticket.approveAndIssue
  ) as TicketType | undefined
  const approveDeposit: TicketType | undefined = useSelector<AppState>(
    (state) => state.ticket.approveDeposit
  ) as TicketType | undefined

  // update date value to state
  const handleChange = (dateInput: string) => {
    const date = moment(dateInput)
    setDate(date.toDate())
  }

  // update date value to state
  const onApprove = () => {
    // if (!genTokenDate) {
    //   throw new Error('Gen token date has not set yet!')
    // }

    if (
      approveDeposit !== undefined &&
      approveDeposit!.status === TransactionStatus.SUCCESS
    ) {
      approveIssueCallback(genTokenAddress!.hash)
    } else if (genTokenAddress) {
      // todo: call smartContract here
      approveDepositCallback(genTokenAddress!.hash)?.then(() => {
        // todo: add more handle here
      })
    }
  }

  // submit handler
  const handleClick = () => {
    // dont handle anything if this section has been locked
    if (isLock) return

    if (!date) {
      throw new Error('date invalid')
    }

    // convert to unixTime
    const unixTime = moment(date!).utc(true).unix()
    console.log(unixTime)
    setTokenGenDate(genTokenAddress!.hash, unixTime)?.then((res) => {
      // save the gen token date to store
      dispatch(
        setGenDate({
          genDate: unixTime,
        })
      )
    })
  }

  useEffect(() => {
    setPending(
      (approveDeposit !== undefined &&
        approveDeposit!.status === TransactionStatus.WAIT) ||
        (approveIssue !== undefined &&
          approveIssue!.status === TransactionStatus.WAIT) ||
        false
    )
  }, [approveIssue, approveDeposit])

  useEffect(() => {
    genTokenDate && setDate(fromUnixTime(genTokenDate))
  }, [genTokenDate])

  return useMemo(
    () => (
      <div style={{ position: 'relative' }}>
        <div className="token-date-deposit">
          <TokenGenerationSection 
            handleClick={handleClick}
            handleChange={handleChange}
            date={date}
            genTokenAddress={genTokenAddress}
          />

          {/* todo: move to another component */}
          <Button
            disabled={pending}
            onClick={onApprove}
            className="outline--highlight large token-date__btn deposit-gen-ticket-btn"
          >
            {pending
              ? 'Loading...'
              : approveDeposit === undefined ||
                (approveDeposit &&
                  approveDeposit!.status !== TransactionStatus.SUCCESS)
              ? 'Approve depositing'
              : 'Deposit & Issue'}
          </Button>
        </div>
      </div>
    ),
    [date, isLock, genTokenAddress, approveDeposit, pending]
  )
}

export default TokenGenerationDate
