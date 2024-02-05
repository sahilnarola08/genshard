import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const PropertyModal = ({ toggle, open, propertyData, setPropertyData }) => {
    const [tempPropertyData, setTempPropertyData] = useState(propertyData || [])

    const onSubmit = (e) => {
        e.preventDefault();
        let _ = tempPropertyData.length === 0 ? setTempPropertyData([{ id: 1, type: '', name: '' }]) : '';
        setPropertyData(tempPropertyData.length > 0 ? tempPropertyData : [{ id: 1, type: '', name: '' }]); 
        toggle();
    }
    return (
        <div className='property-modal'>
            <Modal
                centered
                toggle={toggle}
                isOpen={open}
                className="modal_wrapper"
                id="modal_wrapper">
                <div className="modal_header_wrapper">
                    <ModalHeader className="modal_title" toggle={toggle}>
                        Add Properties
                    </ModalHeader>
                    <div className="close_btn" onClick={toggle}>
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
                </div>
                <form onSubmit={onSubmit}>
                <ModalBody>
                    <section className="property-wrapper">
                        <p className="property-modal-detail">Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.</p>
                        <div className="property-head-wrapper">
                            <div className="property-head">Type</div>
                            <div className="property-head">Name</div>
                        </div>
                        <div className="property-inputs-wrapper">
                            {
                                tempPropertyData.map((d, ind) => <div className="property-input-wrapper">
                                    <div className='close' onClick={() => {
                                        // if (tempPropertyData.length > 1) {
                                            const filterInputs = tempPropertyData.filter(data => data.id !== d.id);
                                            setTempPropertyData(filterInputs);
                                        // }
                                    }
                                    }>
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
                                    <div className="property-input">
                                        <input type="text" required
                                            value={d.type}
                                            onChange={(e) => {
                                                const updatedInput = tempPropertyData.map(({ type, ...rest }) => {

                                                    return {
                                                        ...rest,
                                                        type: rest?.id === d.id ? e.target.value : type
                                                    }
                                                })
                                                setTempPropertyData(updatedInput)
                                            }
                                            }
                                        />
                                    </div>
                                    <div className="property-input-single">
                                        <input type="text" required
                                            value={d.name}
                                            onChange={(e) => {
                                                const updatedInput = tempPropertyData.map(({ name, ...rest }) => {

                                                    return {
                                                        ...rest,
                                                        name: rest?.id === d.id ? e.target.value : name
                                                    }
                                                })
                                                setTempPropertyData(updatedInput)
                                            }
                                            }
                                        />
                                    </div>
                                </div>)
                            }
                        </div>
                        <button className='add-more' onClick={() => {
                            const newId = tempPropertyData.length > 0 ? tempPropertyData[tempPropertyData.length - 1].id + 1 : 1
                            setTempPropertyData([...tempPropertyData, { id: newId, type: '', name: '' }]);
                        }}>Add More</button>
                    </section>
                </ModalBody>
                <ModalFooter>
                    <div className="save-btn-wrapper">
                        <button type='submit' className='save-btn'>Save</button>
                    </div>
                </ModalFooter>
                </form>
            </Modal>
        </div>
    )
}

export default PropertyModal