import React, { useState } from 'react'
import "./provide-feedback-model.sass";
import { Modal, ModalHeader, ModalBody } from "reactstrap"

interface detailsProps {
    isOpen: boolean,
    toggle: () => void,
}

const ProvideFeedbackModel = ({ isOpen, toggle }: detailsProps) => {

    return (
        <>
            <Modal className='connection-request-model' funk={true} fade={false} isOpen={isOpen} toggle={toggle}>
                <div className="modal-wrapper">
                    <ModalHeader toggle={toggle} className='justify-content-center'>
                        <div className="close-btn" onClick={toggle}>
                            <svg
                                width="36"
                                height="36"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 3C9.705 3 3 9.705 3 18C3 26.295 9.705 33 18 33C26.295 33 33 26.295 33 18C33 9.705 26.295 3 18 3ZM18 30C11.385 30 6 24.615 6 18C6 11.385 11.385 6 18 6C24.615 6 30 11.385 30 18C30 24.615 24.615 30 18 30ZM23.385 10.5L18 15.885L12.615 10.5L10.5 12.615L15.885 18L10.5 23.385L12.615 25.5L18 20.115L23.385 25.5L25.5 23.385L20.115 18L25.5 12.615L23.385 10.5Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                    </ModalHeader>
                </div>
                <ModalBody>
                    <div className='connection-request-details'>
                        <h3 className='heading-new-3 mb-4 text-center color-white-new'>Connection Request</h3>
                        {/* <div className="partner-details d-flex justify-content-center align-items-center gap-3 mb-3">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhG_cZjxXIlwfsjseD7-LMSMzWI7txguoSLjCbwM85&s" className='img-fluid' alt="" />
                            <h5 className='heading-new-5 fw-lighter'>Partner X</h5>
                        </div> */}
                        <div className="paragraph-new mb-0 text-center fw-lighter">Write Message</div>
                        <div className="mt-4 connection-request-textarea">
                            <textarea className="form-control" rows={8}></textarea>
                        </div>
                        <div className="text-center mt-4">
                            <button className='new-primary-button'>Send</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ProvideFeedbackModel