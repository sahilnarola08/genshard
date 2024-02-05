import React, { useCallback, useMemo, useState } from 'react'
import Modal from '../../../../shared/components/modal'
import { InforContent } from '../../creation.config'
import './style.sass'

export default function ImageBox() {
  const [isShowInfoModal, setIsShowInfoModal] = useState<boolean>(false)

  const updateInfoModalStatus = useCallback(
    (value: boolean) => () => {
      setIsShowInfoModal(value)
    },
    []
  )

  const TitleBox = (
    <div className="title">
      <div className="info-button" onClick={updateInfoModalStatus(true)}>
        <img src="/images/icons/info.svg" alt="info" />
      </div>
      <h5>
        CREATE GEN <br /> TICKETS
      </h5>
    </div>
  )

  // Info modal
  const InfoModal = (
    <Modal isOpen={isShowInfoModal} onClose={updateInfoModalStatus(false)}>
      <div className="modal-content">
        <p>{InforContent}</p>
      </div>
    </Modal>
  )

  return useMemo(
    () => (
      <div className="image-box">
        {TitleBox}

        {InfoModal}

        <img src="/images/gen-ticket.svg" alt="gen ticket" />
      </div>
    ),
    [isShowInfoModal]
  )
}
