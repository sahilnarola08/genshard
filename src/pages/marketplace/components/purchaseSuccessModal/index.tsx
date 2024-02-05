import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap"
import Itemimg from '../../../../images/marketplace/hand.png';
import './style.css';

interface purchaseSuccessModalProps {
    isOpen: boolean,
    toggle: () => void,
    currentProjectData?: any,
    creatorFeesForNFT?: any
}

const PurchaseSuccessModal = ({ isOpen, toggle, currentProjectData, creatorFeesForNFT }: purchaseSuccessModalProps) => {

    const [modal, setModal] = React.useState(false);
    const [showTableData, setShowTableData] = React.useState(false);

    // Toggle for Modal

    const toggleTableDisplayData = () => setShowTableData(!showTableData);
    return (
        <div style={{
            display: 'block', width: 700, padding: 30
        }}>
            <Modal funk={true} fade={false} isOpen={isOpen} toggle={toggle} className="model-margin" >
                <ModalHeader toggle={toggle}></ModalHeader>
                <ModalBody>
                    <div className="">
                        <div className="modal-img">
                            <img src={Itemimg} />
                        </div>
                        <div className="modal-cotent">
                            <div className="content-details">
                                <h3>Your purchase is complete</h3>
                            </div>
                            <div className="content-details">
                                <a>View on Etherscan</a>
                                <a onClick={toggleTableDisplayData}>{!showTableData ? "Show details" : "Hide details"}</a>
                            </div>
                        </div>

                        {/* table */}
                        {showTableData && <div >
                            <h5>2 items</h5>
                            <div className="item-table">
                                <div className="model-content">
                                    <div className="item-details col-xl-8">
                                        <div className="item-img"><img className="" src={Itemimg} /></div>
                                        <div className="item-cotent">
                                            <h6>stone</h6>
                                            <div>Unidentified contract - BsY3A2UYNd</div>
                                        </div>
                                    </div>
                                    <div className="item-price col-xl-4">
                                        <h6>1E-18 ETH</h6>
                                        <div>$0.01</div>
                                    </div>
                                </div>
                                <div className="model-content">
                                    <div className="item-details col-xl-8">
                                        <div className="item-img"><img className="" src={Itemimg} /></div>
                                        <div className="item-cotent">
                                            <h6>scissors</h6>
                                            <div>Unidentified contract - z6IHtKVQNZ</div>
                                        </div>
                                    </div>
                                    <div className="item-price col-xl-4">
                                        <h6>1E-15 ETH</h6>
                                        <div>$0.01</div>
                                    </div>
                                </div>
                                <div className="model-content">
                                    <div className="item-details col-xl-8">
                                        <div className="item-img"><img className="" src={Itemimg} /></div>
                                        <div className="item-cotent">
                                            <h6>scissors</h6>
                                            <div>Unidentified contract - z6IHtKVQNZ</div>
                                        </div>
                                    </div>
                                    <div className="item-price col-xl-4">
                                        <h6>1E-15 ETH</h6>
                                        <div>$0.01</div>
                                    </div>
                                </div>
                                <div className="model-content">
                                    <div className="item-details col-xl-8">
                                        <div className="item-img"><img className="" src={Itemimg} /></div>
                                        <div className="item-cotent">
                                            <h6>scissors</h6>
                                            <div>Unidentified contract - z6IHtKVQNZ</div>
                                        </div>
                                    </div>
                                    <div className="item-price col-xl-4">
                                        <h6>1E-15 ETH</h6>
                                        <div>$0.01</div>
                                    </div>
                                </div>

                            </div>
                        </div>}
                        {/* table */}

                        <div className="content-price-detail">
                            <div className="">
                                <h6>Subtotal</h6>
                                <div>Gas fees</div>
                            </div>
                            <div className="content-price">
                                <h6>0000000000000000002 ETH</h6>
                                <div>0.0002 ETH</div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="footer">
                    <div className="content-price-detail">
                        <div className="">
                            <h6>Total price</h6>
                        </div>
                        <div className="content-price">
                            <h6>0.0002 ETH</h6>
                            <div>$0.26</div>
                        </div>
                    </div>
                    <Button className="purchasemodal" onClick={toggle}>View purchase</Button>
                </ModalFooter>
            </Modal>
        </div >
    );
}

export default PurchaseSuccessModal;
