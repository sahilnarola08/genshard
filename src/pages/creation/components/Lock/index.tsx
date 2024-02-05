import LockImage from '../../../../images/lock.svg'
import CheckingImage from '../../../../images/checking.svg'
import {
  DEFAULT_CHECKING_CONTENT,
  DEFAULT_LOCKED_CONTENT,
} from '../../creation.config'
import './style.sass'
import { useMemo } from 'react'

const Lock = ({
  isLock,
  isChecking,
  lockTitle,
  checkingTitle,
  className,
  children,
}: ILock) => {
  const title = useMemo(
    () =>
      isLock
        ? lockTitle || DEFAULT_LOCKED_CONTENT
        : isChecking
        ? checkingTitle || DEFAULT_CHECKING_CONTENT
        : '',
    [isLock, isChecking, checkingTitle, lockTitle]
  )

  return (
    <div
      className={`lock ${!!className ? className : ''} ${
        isLock ? 'locked' : ''
      } ${isChecking ? 'checking' : ''}`}
      title={title}
    >
      <div className="lock__overlay"></div>

      <div className="lock__content">
        {/* lock image */}
        {isLock && <img className="lock__img" src={LockImage} />}

        {isChecking && <img className="lock__img" src={CheckingImage} />}

        {/* title */}
        {!!title && <div className="lock__title">{title}</div>}
      </div>

      {/* child component */}
      {children}
    </div>
  )
}

interface ILock {
  isLock: boolean
  isChecking: boolean
  checkingTitle?: string
  lockTitle?: string
  children?: React.ReactNode
  className?: string
}

export default Lock
