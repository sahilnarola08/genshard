import { useEffect, useState } from 'react'
import './style.sass'
import { ExtendedProject } from '../../../../state/market/types'
import moment from 'moment'
import MainData from './maindata'

interface LiveUpComingProps extends ExtendedProject {
  onClick: () => void
  isPast?: boolean
}

export default function LiveUpComing(props: LiveUpComingProps) {
  const {isPast} = props
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    setIsLive(moment().diff(moment.unix(parseInt(props.startDate!))) > 0)
  }, [])
  return (
    <div className="landing-card-container" id={props.id} style={{
        maxHeight: !isPast || (!props.openSeaURL && !props.nfTradeURL) ? '400px': '',
      }}
    >
        <div 
          style={{
            backgroundColor: isPast ? '#117DCC' : isLive ? '#00CF6C' : '#FF9900',
          }} 
          className="landing-card-badge"
        >
          {isPast ? 'Done' : isLive ? 'Live' : 'Soon'}
        </div>
        <div className="landing-card-red-border">
          <MainData {...props} onClick={props.onClick} isLive={isLive} />
        </div>
    </div>
  )
}
