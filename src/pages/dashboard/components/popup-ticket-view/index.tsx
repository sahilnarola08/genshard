import { Form, Formik } from 'formik'
import React, { useRef } from 'react'
import Modal from '../../../../shared/components/modal'
import './style.sass'
import * as Yup from 'yup'
import { ICardFormState } from '../../../creation/components/card-form/types'
import { createCardArray } from '../../../creation/components/card-form/helper'
import CardsView from '../cards'
interface ITicketViewModal {
  isOpen: boolean
  onClose: () => any
}
const TicketViewModal = ({ isOpen, onClose }: ITicketViewModal) => {
  const handleSubmit = () => {
    console.log()
  }
  const FormInitialValue: ICardFormState = {
    modalIndex: 0,
    token: undefined,
    numberOfTypes: 2,
    designable: false,
    designUri: '',
    cards: createCardArray(1),
    totalNumberOfTranches: 0
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-view-ticket">
          <div className="title">Ticket View</div>
          <div className="ticket">
            <div className="ticket__title">Token Name</div>
            <div className="ticket__value">{`{token}`}</div>
          </div>
          <div className="cards">
            <Formik
              initialValues={FormInitialValue}
              onSubmit={handleSubmit}
              enableReinitialize
              render={() => (
                <div>
                  <Form>
                    <CardsView />
                  </Form>
                </div>
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TicketViewModal
