import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { Project } from '../../../../state/ticket/types'
import moment from 'moment'
import './style.sass'

const TicketCreated = (props: {date?: Date}) => {
  const currentProject: Project | undefined = useSelector<AppState>(
    (state) => state.dashboard.currentProject
  ) as Project | undefined

  return (
    <div className="ticket-created">
      {/* ticket created logo */}
      <div className="ticket-created__logo">
        <span></span>
      </div>

      {/* ticket created detail */}
      <div className="ticket-name ticket-info">
        <div className="ticket-info__label">Ticket Name</div>
        <div className="ticket-info__value">{currentProject === undefined ? 'No Tickets Available' : currentProject.name}</div>
      </div>

      <div className="token-generation ticket-info">
        <div className="ticket-info__label">Token Generation Date</div>
        <div className="ticket-info__value">{props.date ? moment(props.date).utc().format("MMMM Do YYYY, h:mm A") : ''}</div>
      </div>

      {/* ticket created button */}
      {/*<div className="ticket-btn">
        <Button className="outline--highlight btn--genticket">edit</Button>
      </div>

      <div className="ticket-btn">
        <Button
          className="outline--highlight btn--genticket"
          onClick={() => setOpenPopup(true)}
        >
          view
        </Button>
      </div>
      <div>
        <TicketViewModal isOpen={isOpen} onClose={onClose} />
    </div>*/}
    </div>
  )
}

export default TicketCreated
