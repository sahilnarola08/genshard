import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AppDispatch, AppState } from '../../state'
import { clearGenTicketData } from '../../state/ticket/actions'
import { TicketType, TransactionStatus } from '../../state/ticket/types'
import CardForm from './components/card-form'
import ImageBox from './components/image-box'
import Lock from './components/Lock'
import TokenGenerationDate from './components/token-generation-date'
import { LOCK_GENERATION_TITLE } from './creation.config'
import './style.sass'

type LockStatus = 'locked' | 'checking' | 'none'

const getLockProp = (lockStatus: LockStatus) => {
  let isChecking = false
  let isLock = false

  if (lockStatus === 'locked') {
    isLock = true
  } else if (lockStatus === 'checking') {
    isChecking = true
  }

  return {
    isLock,
    isChecking,
  }
}

export default function Home() {
  const lockTicket = useSelector((state: AppState) => state.ticket.lockTicket)

  const approveIssue: TicketType | undefined = useSelector<AppState>(
    (state) => state.ticket.approveAndIssue
  ) as TicketType | undefined

  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  
  const [lockCardFormStatus, setLockCardFormStatus] = useState<LockStatus>(
    'none'
  )
  const [lockGenDateStatus, setLockGenDateStatus] = useState<LockStatus>(
    'locked'
  )

  // get the lock status of cardForm and genDate section
  const {
    isLock: isLockCardForm,
    isChecking: isCheckingCardForm,
  } = useMemo(() => getLockProp(lockCardFormStatus), [lockCardFormStatus])

  const { isLock: isLockGenDate, isChecking: isCheckingGenDate } = useMemo(
    () => getLockProp(lockGenDateStatus),
    [lockGenDateStatus]
  )

  // effect set lock status according ticket status on redux store
  useEffect(() => {
    if (lockTicket) {
      if (lockTicket.status === TransactionStatus.WAIT) {
        setLockCardFormStatus('checking')
      }

      if (lockTicket.status === TransactionStatus.SUCCESS) {
        setLockCardFormStatus('locked')
        setLockGenDateStatus('none')
      }
    }
  }, [JSON.stringify(lockTicket)])

  useEffect(() => {
    if (approveIssue !== undefined && approveIssue.status === TransactionStatus.SUCCESS) {
      history.push('/')
      dispatch(clearGenTicketData())
    }
  }, [approveIssue])

  return (
    // <BaseLayout>
    <div className="home-page">
      <div className="home__content">
        <ImageBox />
        <div className="card-form-wrapper">
          <Lock isLock={isLockCardForm} isChecking={isCheckingCardForm}>
            <CardForm isLock={isLockCardForm} />
          </Lock>
        </div>
      </div>

      <Lock
        className="token-gen-locker"
        isLock={isLockGenDate}
        isChecking={isCheckingGenDate}
        lockTitle={LOCK_GENERATION_TITLE}
      >
        <TokenGenerationDate isLock={isLockGenDate} />
      </Lock>
    </div>
    // </BaseLayout>
  )
}
