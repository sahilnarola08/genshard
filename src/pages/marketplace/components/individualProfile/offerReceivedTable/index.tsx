import axios from 'axios';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { apiBaseUrl, GEN_NFT_MARKETPLACE_ADDRESS_DATA, MORALIST_API_KEY, MORALIS_API_SERVER_URL } from '../../../../../constants';
import { useActiveWeb3React } from '../../../../../hooks/web3';
import boughtIcon from '../../../../../images/marketplace/boughtIcon.svg'
import { AppState } from '../../../../../state';
import { calculateGasMargin, getContract, shortenAddress } from '../../../../../utils';
import "./style.sass";
import moment from "moment"
import LoaderComp from '../../../../../shared/components/LoaderComponent';
import { useTransactionAdder } from '../../../../../state/transactions/hooks';
import { useAddPopup } from '../../../../../state/application/hooks';
import useUserAuth from '../../../../../hooks/useUserAuth';
import { BigNumber } from 'ethers'
import { abi as GS_MARKETPLACE_ABI } from '../../../../../contracts/GSMarketPlace1.json';
import { TransactionResponse } from '@ethersproject/providers'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { postCreateNFTListingTransactionCallBack } from '../../../API/ApiCall';
import { abi as ERC1155_ABI } from '../../../../../contracts/IERC1155.json';
import { abi as ERC721_ABI } from '../../../../../contracts/IERC721.json';
import { useApproveForListPostingERC1155, useApproveForListPostingERC721 } from '../../../../../state/ticket/hooks';

// const data = [
//     {
//         mainItem: "Garden of Eden",
//         subItem: 'Created by Silver Lake',
//         price: "0.1 ETH",
//         unitPrice: 1,
//         floorDiff: '-',
//         from: "address1",
//         expiration: "address2",
//         received: "25th Sep '21",
//         icon: boughtIcon,
//     }
// ]

const OfferReceivedTable = () => {

    const { account, chainId, library } = useActiveWeb3React()
    const [isRefreshOfferListingData, setIsRefreshOfferListingData] = useState<boolean>(false)
    const history = useHistory()
    const { path } = useRouteMatch()

    const data = [
        {
            mainItem: "Garden of Eden",
            subItem: 'Created by Silver Lake',
            price: "0.1 ETH",
            unitPrice: 1,
            floorDiff: '-',
            from: "address1",
            made: "address2",
            status: "25th Sep '21",
            icon: boughtIcon,
        }
    ]

    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const userId = useSelector((state: AppState) => state.user && state.user.userId)
    const { getUserAuthToken, isLoading: isAuthLoader, loaderMsg: authLoaderMsg } = useUserAuth()
    const addErrorPopup = useAddPopup();
    const [offers, setOffers] = useState<any>([])
    const accessToken = useSelector((state: AppState) => state.user && state.user.access_token)
    const network = useSelector((state: AppState) => state.application.network)
    const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const [msg, setMsg] = useState("Please Wait")
    const addTransaction = useTransactionAdder()
    const [isLoading, setIsLoading] = useState(false)
    const checkUserApproveForListERC1155 = useApproveForListPostingERC1155()
    const checkUserApproveForListERC721 = useApproveForListPostingERC721()

    useEffect(() => {
        if (accessToken && chainId) {
            getUserOffers()
        }
    }, [accessToken, chainId, isRefreshOfferListingData])

    const getUserOffers = async () => {
        const requests = [] as any
        const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
        const options = {
            method: 'GET',
            url: `${MORALIS_API_SERVER_URL}/${account}/nft`,
            params: { chain: networkName, format: 'decimal', normalizeMetadata: true },
            headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
        } as any
        requests.push(axios.get(`${apiBaseUrl}/api/v1/marketplace/nftlisting/user/offers/received/chain_id/${chainId}`, { headers: { authorization: `Bearer ${accessToken}` } }).then(({ data }) => data.values || []))
        requests.push(axios(options).then(({ data }) => data.result || []))

        let [offerMade, userMoralisNfts] = await Promise.all(requests) as any
        const moralisNfts = offerMade.filter(nft => nft.nftIndex === null)
        moralisNfts.forEach(nft => {
            const moralisNft = userMoralisNfts.find(item => (item.token_address == nft.tokenAddress && item.token_id == nft.tokenId))
            if (moralisNft) {
                const { normalized_metadata = {}, name: collectionName = "", token_address = "", token_id = "" } = moralisNft
                const { name: nftName = "", image: nftAsset = "" } = normalized_metadata || {}
                const orderMadeIndex = offerMade.findIndex(item => (item.tokenAddress == token_address && item.tokenId == token_id))
                if (orderMadeIndex > -1) {
                    offerMade[orderMadeIndex] = {
                        ...offerMade[orderMadeIndex],
                        collection: { name: collectionName, collectionAddress: token_address },
                        nft: { name: nftName, nftAsset }
                    }
                }
            }
        })
        console.log(offerMade, "offerReceived")
        setOffers(offerMade)
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

    const handleAcceptOfferByNFTOwner = async (offerItem: any) => {
        console.log("handleAcceptOfferByNFTOwner Fired", offerItem);
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return

        try {
            let estimate,
                method: (...args: any) => Promise<TransactionResponse>,
                args: Array<number | string | BigNumber>,
                value: BigNumber | null
            const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
            method = market.acceptOffer
            estimate = market.estimateGas.acceptOffer
            args = [
                offerItem?.nftItemId!,
                offerItem?.actualRemainingQuantity!
            ]

            console.log("acceptOffer data", args);

            await estimate(...args, {})
                .then(estimatedGasLimit =>
                    method(...args, {
                        ...({}),
                        gasLimit: calculateGasMargin(estimatedGasLimit)
                    })
                        .then(async (response: any) => {
                            const waitResponse = await response.wait();
                            console.log('acceptOffer Response', response);
                            setIsLoading(false)
                            setMsg("Please wait")
                            addTransaction(response, {
                                summary:
                                    'Offer Accepted Successfully.'
                            });
                            setIsRefreshOfferListingData(true);
                        })
                        .catch((err: any) => {
                            setIsLoading(false)
                            setMsg("Please wait")
                            console.log('error buy failed11 acceptOffer', err);
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
                    console.log('inner estimate error acceptOffer', err);
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
            console.log('Failed to acceptOffer Item listing error', err.message);
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

    const handleApproveOfAcceptOfferByNFTOwner = async (offerItem: any) => {
        console.log("handleAcceptOfferByNFTOwner Clicked", offerItem);

        if ((Number(offerItem?.startTime) >= Number(moment().unix()))) {
            addErrorPopup({
                txn: {
                    hash: '',
                    success: false,
                    summary: `You can't accept this offer item until ${moment.unix(offerItem?.startTime).format("MMM DD, YYYY hh:mmA")}`,
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
                    offerItem?._id! + '', account!, offerItem?.fromAddress, offerItem?.listingStartPrice, offerItem?.actualRemainingQuantity
                ).then(async (res: any) => {
                    if (res?.status === 200) {
                        if (offerItem?.assetType === 1) {
                            // call getApproved to  
                            console.log("ERC721 Contract");
                            const nftContractAddress = getContract(offerItem?.tokenAddress, ERC721_ABI, library!, account!)
                            if (!nftContractAddress) throw new Error('No Contract!')

                            const isApprovedAddressOfERC721 = await nftContractAddress.getApproved(offerItem?.tokenId)
                            console.log("isApprovedAddressOfERC721 Address isApprovedOrNot handleAcceptOfferByNFTOwner", isApprovedAddressOfERC721);
                            setIsLoading(true)

                            if (isApprovedAddressOfERC721.toLowerCase() === genMarketPlaceContractAddress!.toLowerCase()) {
                                console.log("Direct AcceptOffer");
                                setMsg("Accepting Offer")
                                await handleAcceptOfferByNFTOwner(offerItem);
                            }
                            else {
                                setMsg("Approve")
                                const data = await checkUserApproveForListERC721(offerItem?.tokenAddress, genMarketPlaceContractAddress!, offerItem?.tokenId)
                                console.log("is Success====> ", data);
                                if (data.status) {
                                    console.log("Successfully Fired Approve");
                                    setMsg("Accepting Offer")
                                    await handleAcceptOfferByNFTOwner(offerItem);
                                }
                                else {
                                    setIsLoading(false);
                                    setMsg("Please wait")
                                }
                            }
                        }
                        else if (offerItem?.assetType === 2) {
                            console.log("ERC1155 Contract");
                            const nftContractAddress = getContract(offerItem?.tokenAddress, ERC1155_ABI, library!, account!)
                            if (!nftContractAddress) throw new Error('No Contract!')

                            const isApprovedOrNotERC1155 = await nftContractAddress.isApprovedForAll(account!, genMarketPlaceContractAddress!)
                            console.log("Direct AcceptOffer isApprovedOrNotERC1155", isApprovedOrNotERC1155);
                            setIsLoading(true)
                            if (Boolean(isApprovedOrNotERC1155)) {
                                console.log("Direct AcceptOffer");
                                setMsg("Accepting Offer")
                                await handleAcceptOfferByNFTOwner(offerItem);
                            }
                            else {
                                setMsg("Approve")
                                const data = await checkUserApproveForListERC1155(offerItem?.tokenAddress, genMarketPlaceContractAddress!)
                                console.log("is Success====> ", data);
                                if (data.status) {
                                    console.log("Successfully Fired setApprovalForAll");
                                    setMsg("Accepting Offer")
                                    await handleAcceptOfferByNFTOwner(offerItem);
                                }
                                else {
                                    setIsLoading(false);
                                    setMsg("Please wait")
                                }
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

    return (
        <>
            {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
            <div className="offer-received-table">
                <div className="offers-received-main-label">Offers Received</div>
                {offers.length > 0 ? <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">ITEM</th>
                                <th scope="col">PRICE</th>
                                <th scope="col">USD UNIT PRICE</th>
                                <th scope="col">FLOOR DIFFERENCE</th>
                                <th scope="col">FROM</th>
                                <th scope="col">EXPIRATION</th>
                                <th scope="col">RECEIVED</th>
                                <th scope="col">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((item, i) => {
                                const { listingStartPrice, startTime, endTime, fromAddress, quantity, tokenAddress, tokenId, collection = {}, nft = {}, status, chainId } = item
                                const { name: collectionName } = collection || {}
                                const { name: nftName = "", nftAsset = "" } = nft || {}
                                const currentStatus = status === 1 ? "Created" : status === 2 ? "Sale" : "Cancel"
                                return (
                                    <tr key={i}>
                                        <td>
                                            <div className='item-logo-text-wrapper' onClick={() => { history.push(`/assets/${tokenAddress}/${tokenId}`, item) }}>
                                                <img src={nftAsset} alt="" />
                                                <div className='text-wrapper'>
                                                    <div className="item-main-text">{nftName}</div>
                                                    <div className="item-sub-text">{fromAddress && shortenAddress(fromAddress)}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td data-label="PRICE">{`${Number(listingStartPrice).toFixed(4)} ${(Number(chainId) == 97 || Number(chainId) == 56 ? 'WBNB' : Number(chainId) == 5 || Number(chainId) == 1 ? 'WETH' : Number(chainId) == 4689 || Number(chainId) == 4690 ? 'WIOTX' : Number(chainId) == 1666600000 || Number(chainId) == 1666700000 ? 'WONE' : Number(chainId) == 43113 || Number(chainId) == 43114 ? 'WAVAX' : Number(chainId) == 137 || Number(chainId) == 80001 ? 'WMATIC' : "WETH")}`}</td>
                                        <td data-label="QTY">${Number(listingStartPrice * 1256.53).toFixed(2)} USD</td>
                                        <td data-label="FLOORDIFF">{quantity}</td>
                                        <td data-label="FROM">{fromAddress && shortenAddress(fromAddress)}</td>
                                        <td data-label="MADE">{moment(Number(endTime) * 1000).format("lll")}</td>
                                        <td data-label="STATUS">{currentStatus}</td>
                                        <td className="item-btn-wrapper">
                                            {status === 1 ? <button onClick={() => handleApproveOfAcceptOfferByNFTOwner(item)}>Accept</button> : "N/A"}
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
                    : <div className="no-offer-data">
                        <img src="/images/no-offer-data.svg" alt="no offers" />
                        <div className="description">No Offers Received Yet</div>
                    </div>}
            </div>
        </>
    )
}

export default OfferReceivedTable