import React from 'react';
import Modal from '../modal';
import "./style.sass"

interface LoaderProps {
    msg?: string,
    isOpen: boolean,
    onClose: () => any
}

const LoaderComp = ({ msg = '', isOpen, onClose }: LoaderProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBlackClose={true}>
            <div className={'loader-modal-bg'}>
                <div className="loading-wrapper">
                    <img
                        className="loading-icon"
                        src="/images/icons/loading.svg"
                        alt="loading"
                    />
                    <div className="loading-message">{msg && msg}</div>
                </div>
            </div>
        </Modal>
    )
}

export default LoaderComp