import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA, GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA } from '../../../../../../../constants';
import { useActiveWeb3React } from '../../../../../../../hooks/web3';
import { AppState } from '../../../../../../../state';
import { useApproveForBuyNowMarketPlace } from '../../../../../../../state/ticket/hooks';
import { useTransactionAdder } from '../../../../../../../state/transactions/hooks';
import { calculateGasMargin, getContract, getERC20Contract } from '../../../../../../../utils';
import "./style.sass"
import { abi as GS_MARKETPLACE_ABI } from '../../../../../../../contracts/GSMarketPlace1.json';
import { useAddPopup } from '../../../../../../../state/application/hooks';
import BuyNowModal from '../successModal';
import bidSuccess from '../../../../../../../images/marketplace/bidSuccess.png'
import LoaderComp from '../../../../../../../shared/components/LoaderComponent';
import useUserAuth from '../../../../../../../hooks/useUserAuth';
import { postCreateNFTListingTransactionCallBack } from '../../../../../API/ApiCall';

const BidaModal = ({ isOpen, toggle, auctionItem, setIsRefreshListingData, wethtoUsd, nftContractAddress, nftTokenId }) => {
    console.log('auctionItemauctionItem', auctionItem);

    const [amount, setAmount] = useState(0)
    const addErrorPopup = useAddPopup();
    const { account, chainId, library } = useActiveWeb3React()
    const network = useSelector((state: AppState) => state.application.network)
    const wethAddress = GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA[network]
    const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const [msg, setMsg] = useState("Please Wait")
    const addTransaction = useTransactionAdder()
    const [isLoading, setIsLoading] = useState(false)
    const [wethBalance, setWethBalance] = useState(0.0)
    const checkUserApproveBuyNowForMarketPlace = useApproveForBuyNowMarketPlace()
    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const userId = useSelector((state: AppState) => state.user && state.user.userId)

    const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()

    const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false)
    const toggleBuyNowModal = () => {
        setOpenBuyNowModal(!openBuyNowModal)
    }

    const fetchAuthToken = async () => {
        try {
            if (account && account !== storedAddress && library) {
                await getUserAuthToken()
            }
        }
        catch (error: any) {
        }
    };

    useEffect(() => {
        console.log("highlyBidListedItemhighlyBidListedItem", auctionItem);
        getCommonData()
    }, [])

    const getCommonData = async () => {
        try {
            if (!library || !chainId || !account) return
            const erc20 = getERC20Contract(wethAddress, chainId, library, account)
            if (!erc20) throw new Error('No UNI Contract!')

            const getBalanceOfAccountWeth = await erc20.balanceOf(account!)
            setWethBalance(getBalanceOfAccountWeth && formatEther(getBalanceOfAccountWeth))
        }
        catch (error: any) {
            console.log("Unable to fetch weth balance");
            setWethBalance(0)
        }
    }

    useEffect(() => {
        console.log("highlyBidListedItemhighlyBidListedItem1", auctionItem);
        setAmount((Number(auctionItem?.highlyBidListedItem?.bidPrice) >= Number(auctionItem?.auctionPriceDetails)) ? Number(auctionItem?.highlyBidListedItem?.bidPrice || 0.00) : Number(auctionItem?.auctionPriceDetails || 0.00))
    }, [auctionItem])

    const handleMakeBidOnAuction = async (auctionItem: any) => {
        console.log("handleMadeBidOnAuction Fired");
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

        try {

            let estimate,
                method: (...args: any) => Promise<TransactionResponse>,
                args: Array<number | string | BigNumber>,
                value: BigNumber | null
            const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)

            method = market.makeBid
            estimate = market.estimateGas.makeBid
            args = [
                auctionItem?.auctionItemId!,
                parseUnits(Number(amount) + '')
            ]

            console.log("handleMakeBidOnAuction data", args);

            await estimate(...args, {})
                .then(estimatedGasLimit =>
                    method(...args, {
                        ...({}),
                        gasLimit: calculateGasMargin(estimatedGasLimit)
                    })
                        .then(async (response: any) => {
                            const waitResponse = await response.wait();
                            console.log('handleMakeBidOnAuctionRes', response);
                            setIsLoading(false)
                            setMsg("Please wait")
                            addTransaction(response, {
                                summary:
                                    'Auction Bid Request Placed Successfully.'
                            });
                            //@ts-ignore
                            toggle()
                            toggleBuyNowModal()
                            setIsRefreshListingData(true);
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

    const handleApproveOfMakeBidOnAuctionListingExceptTheOwner = async (auctionItem: any) => {
        console.log("handleApproveOfMakeBidOnAuctionListingExceptTheOwner Clicked", auctionItem, auctionItem?.recordId! + '', auctionItem?.auctionSeller, account!, Number(amount), auctionItem?.auctionActualRemainingQuantity);

        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

        const isError = {
            msg: '',
            error: false
        }

        if (Number(amount) <= 0 || amount === undefined) {
            isError.msg = `Please enter the valid price to make bid on this auction listing.`;
            isError.error = true;
        }
        else
        { 
            console.log("datadata", auctionItem, Number(amount), Number(auctionItem?.auctionPriceDetails || 0));
            
            if (auctionItem?.highlyBidListedItem === undefined && Number(amount) < Number(auctionItem?.auctionPriceDetails || 0)) {
                console.log("Case 1");
                isError.msg = `Bid Price must be at least the minimum price of ${auctionItem?.auctionPriceDetails} ${network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}.`;
                isError.error = true;
            }else if (Number(amount) <= Number(auctionItem?.highlyBidListedItem?.bidPrice || 0)) {
                console.log("Case 2");
                isError.msg = `Bid Price must be greater than the last bid of ${auctionItem?.highlyBidListedItem?.bidPrice} ${network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}.`;
                isError.error = true;
            }
        }
        

        isError.error && addErrorPopup({
            txn: {
                hash: '',
                success: false,
                summary: isError.msg,
                description: '',
                withExternalLink: false,
            }
        });

        if (!isError.error) {
            try {
                await fetchAuthToken()
                setIsLoading(true);
                setMsg("Please wait")
                await postCreateNFTListingTransactionCallBack(
                    auctionItem?.recordId! + '', auctionItem?.auctionSeller, account!, Number(amount), auctionItem?.auctionActualRemainingQuantity
                ).then(async (res: any) => {
                    if (res?.status === 200) {
                        console.log('------->All are good to go for proceeding approve before make bids on auction listing');
                        const erc20 = getERC20Contract(wethAddress, chainId, library, account)
                        if (!erc20) throw new Error('No UNI Contract!')

                        const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)

                        console.log("handleApproveOfMakeBidOnAuctionListingExceptTheOwner Clicked", formatEther(getAllowanceForWETHMarket), Number(Number(amount) * Number(auctionItem?.auctionAmount)));

                        if (Number(formatEther(getAllowanceForWETHMarket)) >= Number(Number(amount) * Number(auctionItem?.auctionAmount))) {
                            console.log("Direct Buy Listing because of default approved done");
                            setMsg("Posting Bid On Auction Listing")
                            await handleMakeBidOnAuction(auctionItem);
                        }
                        else {
                            setMsg("Approve")
                            console.log("checkUserApproveBuyNowForMarketPlace Request ====> ", auctionItem, parseUnits(Number(auctionItem?.auctionPriceDetails) + ''));
                            const data = await checkUserApproveBuyNowForMarketPlace(wethAddress, genMarketPlaceContractAddress, parseUnits((Number(amount) * Number(auctionItem?.auctionAmount)) + ''))
                            console.log("is Success from checkUserApproveBuyNowForMarketPlace ====> ", data);
                            if (data.status) {
                                console.log("Successfully Approved");
                                setMsg("Posting Bid On Auction Listing")
                                await handleMakeBidOnAuction(auctionItem);
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
                    console.log(err.message || 'Error while creating NFT bidding data ')
                })
            } catch (error: any) {
                setIsLoading(false);
                setMsg("Please wait")
                console.log(error || 'Error while validate check of creating NFT bidding data ')
            }
        }
    }

    return (
        <>
            {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
            <Modal className='bid_modal_container add_fund_modal_container' funk={true} fade={false} isOpen={isOpen} toggle={toggle}>
                <div className="modal_header_wrapper">
                    <ModalHeader toggle={toggle}>
                        <div className='modal-header-title'>Place a bid</div>
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
                    <div className="bid-modal">
                        <div className="amount-balance-wrapper">
                            <div className="amount-balance">Offer amount</div>
                            <div className='balance'>Balance: {wethBalance} {network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}</div>
                        </div>
                        <div className="chain-and-input-wrapper">
                            <div className="chain-wrapper">
                                <select name="chain" id="chain">
                                    <option value="WETH">{network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase()}</option>
                                </select>
                            </div>
                            <div className="amount-wrapper">
                                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="total-wrapper">
                            Total offer amount: {Number(Number(amount) * Number(auctionItem?.auctionAmount)).toFixed(10)} WETH (${Number(amount) * Number(wethtoUsd)}) - ({Number(auctionItem?.auctionAmount)} Quantity)
                        </div>
                        <div className="place-bid-btn-wrapper">
                            <button onClick={() => handleApproveOfMakeBidOnAuctionListingExceptTheOwner(auctionItem)}>Place bid</button>
                        </div>
                    </div>

                </ModalBody>
            </Modal>
            <BuyNowModal
                title={"buy now"}
                img={bidSuccess}
                imgTitle={"You've successfully placed a bid for this NFT Auction!"}
                imgMsg={"We'll let you know when auction owner will accept your bid offer on this auction item."}
                dashbord={'Go to NFT'}
                marketplace={'Return to Marketplace'}
                nftContractAddress={nftContractAddress}
                nftTokenId={nftTokenId}
                isOpen={openBuyNowModal}
                toggle={toggleBuyNowModal}
            />
        </>
    )
}

export default BidaModal