import React from 'react'
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap'
import './style.sass'

const NftOwnerModal = ({ nftOwnerModal, nftOwnerModalToggle, nftOwnerModalData, handleScrollOfNFTOwners, infiniteLoader = false }) => {
    console.log("nftOwnerModalData => ", nftOwnerModalData);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> => ", nftOwnerModalData.length);

    const data = [
        {
            name: 'xyz',
            address: '012345789',
            items: 48
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 2
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 4
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 18
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 8
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 48
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 2
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 4
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 18
        },
        {
            name: 'xyz',
            address: '012345789',
            items: 8
        },
    ]
    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    return (
        <div className="nft-owner-modal">
            <Modal
                className="modal_wrapper"
                id="modal_wrapper"
                funk={true}
                fade={false}
                isOpen={nftOwnerModal}
                toggle={nftOwnerModalToggle}
            >
                <div className="modal_header_wrapper">
                    <ModalHeader className="modal_title" toggle={nftOwnerModalToggle}>
                        NFT Owners
                    </ModalHeader>
                    <div className="close_btn" onClick={nftOwnerModalToggle}>
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
                <ModalBody>
                    <div className='nft-owner-info' onScroll={(e)=>handleScrollOfNFTOwners(e)}>
                        {
                            nftOwnerModalData?.map((nftInfo, ind) => <div className='owner-info'>
                                <div className='profile-name-address'>
                                    <div className='profile-pic' style={{ backgroundColor: getRandomColor() }} ></div>
                                    <div className='name-address'>
                                        <div className='name'>{nftInfo?.name ? nftInfo?.name : 'unNamed'}</div>
                                        <div className='address'>{nftInfo?.owner_of}</div>
                                    </div>
                                </div>
                                <div className='no-items'>{nftInfo?.amount} items</div>
                            </div>)
                        }
                        {infiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default NftOwnerModal

