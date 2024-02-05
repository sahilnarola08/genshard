import React, { useEffect } from 'react'
import './style.sass'

export default function Modal({ children, isOpen, onClose, kycChanges, isBlackClose }: IModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    } else {
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <div className={`base-modal ${!!isOpen && 'show'}`}>
      <div style={{ display: 'flex', justifyContent: 'center' }} className="base-modal__wrapper">
        <div className="base-modal__content">
          {!kycChanges ? <button className="close-button" type="button" onClick={onClose}>
            {/* <img src={isBlackClose ? "/images/icons/close_dark.svg" : "/images/icons/close.svg"} alt="close" /> */}
          </button> : null}
          {/* feel free to add title and footer if you need it */}
          {children}
        </div>
      </div>

      <div className="overlay" onClick={onClose}></div>
    </div>
  )
}

interface IModalProps {
  children: React.ReactNode
  isOpen: boolean
  isBlackClose?: boolean
  onClose: () => any
  kycChanges?: boolean
}
