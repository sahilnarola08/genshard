import React, { useState } from 'react'
import "./event-remider-modal.sass";
import { Modal, ModalHeader, ModalBody } from "reactstrap"
import ReminderIcon from '../../../../../../images/accelerate/pages/reminder-icon.svg';


interface detailsProps {
    isOpen: boolean,
    toggle: () => void,
}

const EventremiderModal = ({ isOpen, toggle }: detailsProps) => {

    const [reminderModal, setReminderModal] = useState<boolean>(false)
    const eventReminderModalToggal = () => setReminderModal(!reminderModal)

    return (
        <>
            <Modal className='connection-request-model' funk={true} fade={false} isOpen={isOpen} toggle={toggle}>
                {/* <div className="modal-wrapper">
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
                </div> */}
                <ModalBody>
                    <div className='connection-request-details'>
                        <div className='text-center'>
                            <img src={ReminderIcon} className='img-fluid' alt="" />
                        </div>
                        <div className="partner-details d-flex justify-content-between align-items-center mt-4 gap-3 mb-3">
                            <h4 className='heading-new-4 fw-lighter'>15 May 2023</h4>
                            <p className='paragraph-new mb-0'>3 Days to go</p>
                        </div>
                        <div className="heading-new-4 fw-lighter mt-lg-4 mt-md-3">Understanding Tokenomics</div>
                        <p className='paragraph-new mb-0'>with Gregory Peck</p>
                        <div className='d-flex mt-3'>
                            <p className='paragraph-new mb-0 me-2'>Guests:</p>
                            <p className='paragraph-new mb-0 mt-0'>Sundar Pichai, Jackie Chan, Priyanka Chopra Hema Malini</p>
                        </div>
                        <div className="mt-4 connection-request-textarea form-group d-flex align-items-center justify-content-between mt-3">
                            <label className='color-white-new me-4' htmlFor="exampleInputEmail1">Email</label>
                            <input className="form-control" type='email' id="exampleInputEmail1" />
                        </div>
                        <div className="mt-4 connection-request-textarea form-group d-flex align-items-center justify-content-between">
                            <label className='color-white-new me-4' htmlFor="exampleInputEmail1">Telegram</label>
                            <input className="form-control" type='email' id="exampleInputEmail1" />
                        </div>
                        <div className='text-center mt-4'>
                            <button className='new-primary-button'>Set Alert</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default EventremiderModal