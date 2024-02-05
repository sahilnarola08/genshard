import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const LevelsModal = ({ toggle, open, levelsData, setLevelsData }) => {

    const [tempLevelsData, setTempLevelsData] = useState(levelsData || [])

    const onSubmit = (e) => {
        e.preventDefault();
        let _ = tempLevelsData.length === 0 ? setTempLevelsData([{ id: 1, name: '', of: '', total: '' }]) : '';
        setLevelsData(tempLevelsData.length > 0 ? tempLevelsData : [{ id: 1, name: '', of: '', total: '' }]); 
        toggle();
}

    return (
        <div className="levels-modal">
            <Modal centered toggle={toggle} isOpen={open} className="modal_wrapper"
                id="modal_wrapper">
                <div className="modal_header_wrapper">
                    <ModalHeader className="modal_title" toggle={toggle}>
                        Add Levels
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
                        <p className="property-modal-detail">Levels show up underneath your item, are clickable, and can be filtered in your collection's sidebar.</p>
                        <div className="property-head-wrapper">
                            <div className="property-head">Type</div>
                            <div className="property-head">Name</div>
                        </div>
                        <div className="property-inputs-wrapper">
                            {
                                tempLevelsData.map((d) => <div className="property-input-wrapper">
                                    <div className='close' onClick={() => {
                                        // if (tempLevelsData.length > 1) {
                                            const filterInputs = tempLevelsData.filter(data => data.id !== d.id);
                                            setTempLevelsData(filterInputs);
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
                                        <input type="text"
                                            required
                                            value={d.name}
                                            onChange={(e) => {
                                                const updatedInput = tempLevelsData.map(({ name, ...rest }) => {

                                                    return {
                                                        ...rest,
                                                        name: rest?.id === d.id ? e.target.value : name
                                                    }
                                                })
                                                setTempLevelsData(updatedInput)
                                            }
                                            }
                                        />
                                    </div>
                                    <div className="property-input">
                                        <div className="levels-input-wrapper">
                                            <input
                                                type="number"
                                                required
                                                min={0}
                                                max={Number(d.total)}
                                                value={Number(d.of)}
                                                onChange={(e) => {
                                                    const updatedInput = tempLevelsData.map(({ of, ...rest }) => {

                                                        return {
                                                            ...rest,
                                                            of: rest?.id === d.id ? e.target.value : of
                                                        }
                                                    })
                                                    setTempLevelsData(updatedInput)
                                                }
                                                }
                                            />
                                            <div>of</div>
                                            <input
                                                type="number"
                                                required
                                                min={0}
                                                value={Number(d.total)}
                                                onChange={(e) => {
                                                    const updatedInput = tempLevelsData.map(({ total, ...rest }) => {

                                                        return {
                                                            ...rest,
                                                            total: rest?.id === d.id ? e.target.value : total
                                                        }
                                                    })
                                                    setTempLevelsData(updatedInput)
                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                        <button className='add-more' onClick={() => {
                            const newId = tempLevelsData.length > 0 ? tempLevelsData[tempLevelsData.length - 1].id + 1 : 1
                            setTempLevelsData([...tempLevelsData, { id: newId, name: '', of: '', total: '' }]);
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

export default LevelsModal