import React, { useState } from 'react'
import "./update-symbioteScore-model.sass";
import { Modal, ModalHeader, ModalBody } from "reactstrap"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import DecrementIcon from '../../../../../../../images/vc/decrement-icon.svg'
import IncrementIcon from '../../../../../../../images/vc/increment-icon.svg'

interface detailsProps {
    isOpen: boolean,
    toggle: () => void,
    symbioteScore: any,
    setSymbioteScore: any
}

const UpdateSymbioteScoreModel = ({ isOpen, toggle, symbioteScore, setSymbioteScore }: detailsProps) => {
    const [updatePersentage, setUpdatePersentage] = useState(90);

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
                        <h3 className='heading-new-3 mb-4 text-center color-white-new'>Update SymbioteScore</h3>
                        <div className='form-slider'>
                            <div className='percentage-slider text-center m-auto d-flex'>
                                <CircularProgressbar value={Number(symbioteScore)} text={`${Number(symbioteScore).toFixed(0)}`} background
                                    backgroundPadding={0}
                                    styles={buildStyles({
                                        backgroundColor: "transparent",
                                        textColor: "#fff",
                                        pathColor: "#65DB6A",
                                        trailColor: "white"
                                    })} />
                                <p className='paragraph-new-small my-4 text-center'>Current Score</p>
                            </div>
                        </div>
                        <div className='form-slider integreted-slider mt-3 d-flex align-items-center'>
                            <div className='icrement-icon' role='button' onClick={() => updatePersentage > 0 && setUpdatePersentage(updatePersentage - 1)}>
                                <img src={DecrementIcon} className='img-fluid' alt="" />
                            </div>
                            <div className='percentage-slider text-center m-auto d-flex'>
                                <CircularProgressbar value={Number(updatePersentage)} text={`${Number(updatePersentage).toFixed(0)}`} background
                                    backgroundPadding={0}
                                    styles={buildStyles({
                                        backgroundColor: "transparent",
                                        textColor: "#fff",
                                        pathColor: "#65DB6A",
                                        trailColor: "white"
                                    })} />
                            </div>
                            <div className='icrement-icon' role='button' onClick={() => updatePersentage >= 0 && setUpdatePersentage(updatePersentage + 1)}>
                                <img src={IncrementIcon} className='img-fluid' alt="" />
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button className='new-primary-button' onClick={() => { setSymbioteScore(updatePersentage); toggle(); }}>Update</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default UpdateSymbioteScoreModel