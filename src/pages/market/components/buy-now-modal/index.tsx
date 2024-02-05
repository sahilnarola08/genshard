import React, { Component, useMemo, useState } from 'react'
import LoaderComp from '../../../../shared/components/LoaderComponent'
import Modal from '../../../../shared/components/modal'
import { Card as CardType } from '../../../../state/market/types'
import currentProject from '../current-project'
import Card from './modal-card'
import {CardFinal} from './modal-card'
import './style.sass'

export default function BuyNowModal({ isLoading, card, currentProject, showModal, closeModal, onBuyNow, isOnFinalPage, goToDashBoard, msg }: BuyNowModalProps) {

    return (
        <Modal isBlackClose={true} onClose={closeModal} isOpen={showModal} kycChanges={true} >
            <div className={'modal-bg'}>
                {isLoading ? 
                <LoaderComp isOpen={isLoading} msg={msg} onClose={() => console.log("closing")} />
                    // <div className="loading-wrapper">
                    //     <img
                    //         className="loading-icon"
                    //         src="/images/icons/loading.svg"
                    //         alt="loading"
                    //     />
                    // </div>
                : !isOnFinalPage 
                ? <Card {...card} currentProject={currentProject} onClick={onBuyNow} />
                : <CardFinal 
                    name={card.name}
                    src={card.src}
                    onClose={goToDashBoard}
                    />}
            </div>
        </Modal>
    )
}

interface BuyNowModalProps {
  card: CardType
  showModal: boolean
  currentProject? : any
  isOnFinalPage: boolean
  closeModal: () => void
  onBuyNow: () => void
  isLoading: boolean
  goToDashBoard: () => void
  msg: string
}
