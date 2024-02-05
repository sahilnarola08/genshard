import { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { BigNumber } from 'ethers'
import "./style.min.css";

import "./style.sass";

import AddFundModal from "./addFundModal";
import BuyNowModal from "./successModal";
import { abi as GS_MARKETPLACE_ABI } from '../../../../../../contracts/GSMarketPlace1.json';
import asdds from '../../../../../../images/marketplace/you_belong_to_me_by_aquasixio-d799lr2 1.png'
import BuySuccess from '../../../../../../images/marketplace/buySuccess.png'
import { AppState } from "../../../../../../state";
import { useSelector } from "react-redux";
import { KYC_STATUS } from "../../../../../../state/application/reducer";
import { useAddPopup } from "../../../../../../state/application/hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { calculateGasMargin, getContract, getERC20Contract, shortenAddress } from "../../../../../../utils";
import { abi as GEN_MARKETPLACE_ABI } from '../../../../../../contracts/GenMarketPlace.json';
import { useActiveWeb3React } from "../../../../../../hooks/web3";
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
import { useTransactionAdder } from "../../../../../../state/transactions/hooks";
import ReactPlayer from "react-player";
import { isVideoFormat } from "../../../../../market/helper";

import { useApproveForBuyNowMarketPlace } from "../../../../../../state/ticket/hooks";
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA, GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA } from "../../../../../../constants";
import LoaderComp from "../../../../../../shared/components/LoaderComponent";
import moment from "moment";
import useUserAuth from "../../../../../../hooks/useUserAuth";
import { postCreateNFTListingTransactionCallBack } from "../../../../API/ApiCall";

interface DataProps {
    isOpen: boolean,
    toggle: () => void,
    currentProjectData: any,
    lowListingPriceObj: any,
    setIsRefreshListingData: any,
    wethtoUsd: number
}

function TableModal({ isOpen, toggle, currentProjectData, lowListingPriceObj, setIsRefreshListingData, wethtoUsd }: DataProps) {
    const { account, chainId, library } = useActiveWeb3React()
    const network = useSelector((state: AppState) => state.application.network)
    const wethAddress = GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA[network]
    const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState("Please Wait")
    const checkUserApproveBuyNowForMarketPlace = useApproveForBuyNowMarketPlace()
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const [successModal, setSuccessModal] = useState(false);
    const toggleSuccessModal = () => {
        setSuccessModal(!successModal);
    };

    const kycStatus = useSelector((state: AppState) => state.application.kyc_status)
    const addErrorPopup = useAddPopup();
    const addTransaction = useTransactionAdder()
    const videoFormat = isVideoFormat(currentProjectData?.src);

    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const userId = useSelector((state: AppState) => state.user && state.user.userId)

    const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()

    const fetchAuthToken = async () => {
        try {
            if (account && account !== storedAddress && library) {
                await getUserAuthToken()
            }
        }
        catch (error: any) {
        }
    };

    const handleBuyNowListing = async (listingItem: any) => {

        console.log("Model handleBuyNowListing Fired", listingItem);
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

        try {
            setIsLoading(true)
            setMsg("Buy Now Listing")
            let estimate,
                method: (...args: any) => Promise<TransactionResponse>,
                args: Array<number | string | BigNumber | any>,
                value: BigNumber | null
            const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
            var itemIdsArray: any = [listingItem?.listingItemId!]
            var amountsPerItemArray: any = [listingItem?.listingActualRemainingQuantity!]
            method = market.buyFixedPriceItems
            estimate = market.estimateGas.buyFixedPriceItems
            args = [
                itemIdsArray,
                amountsPerItemArray
            ]

            console.log("Model buyFixedPriceItem data", args);

            await estimate(...args, {})
                .then(estimatedGasLimit =>
                    method(...args, {
                        ...({}),
                        gasLimit: calculateGasMargin(estimatedGasLimit)
                    })
                        .then(async (response: any) => {
                            const waitResponse = await response.wait();
                            console.log('Model buyFixedPriceItemRes', response);
                            setIsLoading(false)
                            setMsg("Please wait")
                            addTransaction(response, {
                                summary:
                                    'Buy Request Placed Successfully.'
                            });
                            //@ts-ignore
                            toggle();
                            toggleSuccessModal();
                            setIsRefreshListingData(e => !e);
                        })
                        .catch((err: any) => {
                            setIsLoading(false)
                            setMsg("Please wait")
                            console.log('error buy failed11', err);
                            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
                            if (err.code === -32603) { }
                            else if (err.code !== 4001) e = JSON.parse(e);
                            addErrorPopup({
                                txn: {
                                    hash: '',
                                    success: false,
                                    summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                                    description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                                    withExternalLink: false,
                                }
                            });
                        })
                )
                .catch((err: any) => {
                    setIsLoading(false)
                    setMsg("Please wait")
                    console.log('inner estimate error', err);
                    let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
                    if (err.code === -32603) { }
                    else if (err.code !== 4001) e = JSON.parse(e);
                    addErrorPopup({
                        txn: {
                            hash: '',
                            success: false,
                            summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                            description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                            withExternalLink: false,
                        }
                    });
                })
        } catch (err: any) {
            setIsLoading(false)
            setMsg("Please wait")
            console.log('Failed to Buy FiledPrice Item listing error', err.message);
            addErrorPopup({
                txn: {
                    hash: '',
                    success: false,
                    summary: err.message,
                    description: '',
                    withExternalLink: false,
                }
            });
        }
    }

    const handleApproveOfBuyNowListingExceptTheOwner = async (listingItem: any) => {

        console.log("Model BuyNowListingExceptTheOwner Clicked", listingItem);
        if ((Number(listingItem?.listingStartDate) >= Number(moment().unix()))) {
            addErrorPopup({
                txn: {
                    hash: '',
                    success: false,
                    summary: `You can't buy this item until ${moment.unix(listingItem?.listingStartDate).format("MMM DD, YYYY hh:mmA")}`,
                    description: '',
                    withExternalLink: false,
                }
            });
        }
        else {
            try {
                await fetchAuthToken()
                if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
                setIsLoading(true);
                setMsg("Please wait")
                await postCreateNFTListingTransactionCallBack(
                    listingItem?.recordId! + '', listingItem?.listingSeller, account!, listingItem?.listingPriceDetails, listingItem?.listingActualRemainingQuantity
                ).then(async (res: any) => {
                    if (res?.status === 200) {

                        const erc20 = getERC20Contract(wethAddress, chainId, library, account)
                        if (!erc20) throw new Error('No UNI Contract!')

                        console.log('erc20', erc20);

                        const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)

                        if (Number(formatEther(getAllowanceForWETHMarket)) >= (Number(listingItem?.listingPriceDetails) * Number(listingItem?.listingAmount))) {
                            console.log("Model Direct Buy Listing because of default approved done");
                            setMsg("Buy Listing")
                            await handleBuyNowListing(listingItem);
                        }
                        else {
                            setMsg("Approve")
                            console.log("Model checkUserApproveBuyNowForMarketPlace Request ====> ", listingItem, parseUnits(Number(listingItem?.listingPriceDetails) + ''));
                            const data = await checkUserApproveBuyNowForMarketPlace(wethAddress, genMarketPlaceContractAddress, parseUnits(Number(Number(listingItem?.listingPriceDetails) * Number(listingItem?.listingAmount)).toFixed(10) + ''))
                            console.log("is Success from Model checkUserApproveBuyNowForMarketPlace ====> ", data);
                            if (data.status) {
                                console.log("Model Successfully Approved");
                                setMsg("Buy Listing")
                                await handleBuyNowListing(listingItem);
                            }
                            else {
                                setIsLoading(false);
                                setMsg("Please wait")
                            }
                        }
                    }
                    else {
                        setIsLoading(false);
                        setMsg("Please wait")
                    }
                }).catch(err => {
                    setIsLoading(false);
                    setMsg("Please wait")
                    console.log(err.message || 'Error while creating NFT listing Transaction data ')
                })
            } catch (error: any) {
                setIsLoading(false);
                setMsg("Please wait")
                console.log(error || 'Error while validate check of creating NFT Listing Transaction data ')
            }
        }
    }

    const onBuyNow_Old = async (ticket: any) => {
        const { marketPlaceAddress } = ticket.currentProject;
        if (marketPlaceAddress === undefined) return

        let estimate,
            method: (...args: any) => Promise<TransactionResponse>,
            args: Array<number | string>,
            value: BigNumber | null

        const market = getContract(marketPlaceAddress, GEN_MARKETPLACE_ABI, library!, account!)
        method = market.buy
        estimate = market.estimateGas.buy
        args = [
            ticket?.index,
            1
        ]
        value = parseEther(ticket?.price)

        setIsLoading(true)
        await estimate(...args, value ? { value } : {})
            .then(estimatedGasLimit =>
                method(...args, {
                    ...(value ? { value } : {}),
                    gasLimit: calculateGasMargin(estimatedGasLimit)
                }).then(async (response) => {
                    const waitResponse = await response.wait()
                    addTransaction(response, {
                        summary:
                            'Purchased Gen Ticket'
                    })
                    setIsLoading(false)
                    toggleSuccessModal();

                    // setRefreshData((prev: boolean) => !prev);      need to check
                }).catch((err: any) => {
                    setIsLoading(false)
                    console.log('error buy failed', err);
                    let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
                    if (err.code === -32603) { }
                    else if (err.code !== 4001) e = JSON.parse(e);
                    addErrorPopup({
                        txn: {
                            hash: '',
                            success: false,
                            summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                            description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                            withExternalLink: false,
                        }
                    });
                })
            )
            .catch((err: any) => {
                setIsLoading(false)
                console.log('inner estimate error', err);
                let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
                if (err.code === -32603) { }
                else if (err.code !== 4001) e = JSON.parse(e);
                addErrorPopup({
                    txn: {
                        hash: '',
                        success: false,
                        summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                        description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                        withExternalLink: false,
                    }
                });
            })
    }

    console.log("Modal data are::::", currentProjectData);
    const handleClick = async (ticket: any) => {
        // if (kycStatus !== KYC_STATUS.VERIFIED) {
        //     addErrorPopup({
        //         txn: {
        //             hash: '',
        //             success: false,
        //             summary: "KYC Not Verified",
        //             description: '',
        //             withExternalLink: false,
        //         }
        //     });
        //     return
        // }
        // onBuyNow_Old(ticket);
        handleApproveOfBuyNowListingExceptTheOwner(lowListingPriceObj)
    }

    return (
        <>
            {isLoading && <LoaderComp msg={'Please Wait'} isOpen={isLoading} onClose={() => setIsLoading(!isLoading)} />}
            <Modal isOpen={isOpen} toggle={toggle} size='lg' funk={true} fade={false} className="table-modal-wrapper">
                <div className="modal_header_wrapper">
                    <ModalHeader tag='div' toggle={toggle}>
                        <div className='modal-header-title'>BUY NOW</div>
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
                    <div className="modal-table">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Item</th>
                                    <th scope="col">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                    <tr>
                                        <th className="logo_text_wrapper" data-label="LOGo">
                                            <div className="image-wrapper">
                                                <div className="tablegaren">
                                                    {/* <img src={asdds} alt="" /> */}
                                                    {
                                                        videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} muted={true} url={currentProjectData?.src} loop={true} />
                                                            : <img src={currentProjectData?.src} alt="" />
                                                    }
                                                </div>
                                                <div className="Logo_text">
                                                    <i>{currentProjectData?.name ?? ''}</i>
                                                    <br />
                                                    <span>Created by {currentProjectData?.nftContract ? shortenAddress(currentProjectData?.nftContract) : "Gen Shards"}</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th data-label="ITEM" className="item-wrapper">
                                            <div className="item-text">
                                                <small>{lowListingPriceObj?.listingPriceDetails} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</small>
                                            </div>
                                        </th>
                                    </tr>
                                    {/* <br /> */}
                                </>
                            </tbody>
                            <tfoot>
                                <tr className="table_total">
                                    <th>Total</th>
                                    <th>{lowListingPriceObj?.listingPriceDetails} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="modal_footer">
                        <Button className="dashboard_btn" onClick={toggleModal}>
                            Add Funds
                        </Button>
                        <Button className="marketplace_btn" onClick={(e) => {
                            e.stopPropagation();
                            handleClick(currentProjectData);
                            // toggle();
                        }}>
                            Buy Now
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
            <AddFundModal isOpen={modalOpen} toggle={toggleModal} />
            <BuyNowModal
                isOpen={successModal}
                toggle={toggleSuccessModal}
                title="buy now" img={BuySuccess}
                imgTitle="You successfully bought this NFT!"
                imgMsg="You can now see it in your Dashboard"
                dashbord="Go to NFT"
                marketplace="Return to Marketplace"
                nftContractAddress={currentProjectData?.nftContract!}
                nftTokenId={currentProjectData?.nftTokenId!}
            />
        </>
    )
}

export default TableModal;
