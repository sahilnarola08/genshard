import React from 'react'
import "./style.sass"

interface ICustomModal {
    open: Boolean
    onClose: Function
    title: String
    children: React.ReactNode,
    size?: 'xs' | 'sm' | 'md' 
}

function CustomModal(props: ICustomModal) {

    const { open, title, onClose, size = 'sm', children } = props

    if (!open) return null

    return (
        <div className="custom-backdrop-modal">
            <div className="universal-modal">
                <div className="modal-heading-item">
                    <h1 className="modal-heading">{title}</h1>
                    <div className="close-modal-item" onClick={() => onClose()}>
                        <img src="/images/icons/close.svg" alt="close" />
                    </div>
                </div>
                <div className="modal-content-item">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default CustomModal