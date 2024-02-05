import React from 'react'
import "./style.css";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useActiveWeb3React } from '../../../../../../../hooks/web3';
import { AppState } from '../../../../../../../state';
import { getEtherscanLink, shortenAddress } from '../../../../../../../utils';
import "./style.sass";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap"
import Itemimg from '../../../../../../../images/marketplace/hand.png';


interface detailsProps {
    isOpen: boolean,
    toggle: () => void,
    currentProjectData: any,
    creatorFeesForNFT: any
}

const DetailsModal = ({ isOpen, toggle, currentProjectData, creatorFeesForNFT }: detailsProps) => {
    const { account, chainId, library } = useActiveWeb3React()
    const location: any = useLocation();
    console.log("currentProjectDatacurrentProjectDatacurrentProjectData", currentProjectData);

    const network = useSelector((state: AppState) => state.application.network)
    return (
        <>
            <Modal className='add_fund_modal_container' funk={true} fade={false} isOpen={isOpen} toggle={toggle}>
                <div className="modal_header_wrapper">
                    <ModalHeader toggle={toggle}>
                        <div className='modal-header-title'>Details</div>
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
                    </ModalHeader>
                </div>
                <ModalBody>
                    <div className='details'>
                        <div className='wrapper'>
                            <div className='wrapper-label'>Contract Address</div>
                            <div className='value contract-address' onClick={() => window.open(currentProjectData?.networkChainIdValue && getEtherscanLink(currentProjectData?.networkChainIdValue, currentProjectData?.nftContract  || '', "address"), "_blank")}>{
                                currentProjectData?.nftContract && shortenAddress(currentProjectData?.nftContract || '')
                            }</div>
                        </div>

                        <div className='wrapper'>
                            <div className='wrapper-label'>Token ID</div>
                            <div className='value contract-address' onClick={() => window.open(currentProjectData?.tokenURIOfNFT, "_blank")}>{currentProjectData?.nftTokenId}</div>
                        </div>

                        <div className='wrapper'>
                            <div className='wrapper-label'>Token Standard</div>
                            <div className='value'>{currentProjectData?.nftContractType}</div>
                        </div>

                        <div className='wrapper'>
                            <div className='wrapper-label'>Blockchain</div>
                            <div className='value'>{currentProjectData?.networkChainName}</div>
                        </div>

                        <div className='wrapper'>
                            <div className='wrapper-label'>Creator Fees</div>
                            <div className='value'>{Number(creatorFeesForNFT).toFixed(2)}%</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            {/* <Modal funk={true} fade={false} isOpen={isOpen} toggle={toggle} className="Purchase-model" >
                <ModalHeader
                    toggle={toggle}>Approve Purchase</ModalHeader>
                <ModalBody>
                    <div className="model-text">
                        <div className="item-details">
                            <div><img className="item-img" src={Itemimg} /></div>
                            <div className="item-cotent">
                                <h6>2 items</h6>
                                <div>Chain: Goerli</div>
                            </div>
                        </div>
                        <div className="item-price">
                            <h6>0000000000000000002 ETH</h6>
                            <div>$0.01</div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="footer">
                    <h6>Go to your wallet</h6>
                    <div>You'll be asked to approve this purchase from your wallet.</div>
                </ModalFooter>
            </Modal> */}
        </>
    );
}

export default DetailsModal