import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import SellingFilter from '../sidebar'
import likeIcon from '../../../../images/marketplace/Like.png'
import filterIcon from '../../../../images/marketplace/Filter.png'
import downArrow from '../../../../images/marketplace/downArrow.svg'

import "./style.sass"
import { isVideoFormat } from '../../../market/helper'
import ReactPlayer from 'react-player'
import { useHistory, useParams } from 'react-router-dom'
import { shortenAddress, getScrollPercent } from '../../../../utils'
import { useActiveWeb3React } from '../../../../hooks/web3'
// import { useMoralisWeb3Api } from 'react-moralis'
import { useIPFS } from '../../../../hooks/useIPFS'
import Modals from '../../../calendar/modal/Modal'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import axios from 'axios'
import { MORALIST_API_KEY, MORALIS_API_SERVER_URL } from '../../../../constants'
import { getCollectionDetailsAndStatsData } from '../../API/ApiCall'
import LoaderComp from '../../../../shared/components/LoaderComponent'
import { NetworkChainId } from '../../../../connectors'
import { useTokenLikes } from '../../../../hooks/tokens'

const sellingDropdown = [
    {
        label: 'Price: low to high',
        value: 1,
    }, {
        label: 'Price: high to low',
        value: 2,
    },
]

const links = [
    {
        label: "browser",
        link: '/images/liveproject/browser.svg'
    },
    {
        label: "telegram",
        link: '/images/liveproject/telegram.svg'
    },
    {
        label: "twitter",
        link: '/images/liveproject/twitter.svg'
    },
]

const shares = [
    {
        url: '/images/liveproject/rating.svg',
        link: ''
    },
    {
        url: '/images/liveproject/share.svg',
        link: ''
    },
    {
        url: '/images/liveproject/menu.svg',
        link: ''
    }
]

const IndividualCollection = () => {

    const itemsLimit = 50
    const itemLoadingRef = useRef(false)
    const totalItemsRef = useRef(0)
    const fetchedTotalItemsRef = useRef(0)
    const nextCursor = useRef(undefined)
    const [infiniteLoader, setInfiniteLoader] = useState(false)


    const { resolveLink } = useIPFS();
    const { account, chainId, library } = useActiveWeb3React()
    const params = useParams<{ platformChain: any, nftcontractaddress: string }>()
    const [tickets, setTickets] = useState<[]>([])
    const [ticketsToDisplay, setTicketsToDisplay] = useState<any>("");
    const [nftContractAddress, setNftContractAddress] = useState<any>("");
    const [winSize, setwinSize] = useState(window.innerWidth)
    const [isOpened, setIsOpened] = useState(true)
    const network = useSelector((state: AppState) => state.application.network)
    const tokenLikes = useSelector((state: AppState) => state.token.tokenLikes)
    const { getTokenLikes } = useTokenLikes()
    // const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
    const history = useHistory()
    // const Web3Api = useMoralisWeb3Api();
    const [moreNFTsDataSet, setMoreNFTsDataSet] = useState<any[]>([])
    const [collectionDet, setCollectionDet] = useState<any>({})
    const [collectionTokenIdsCursorValue, setCollectionTokenIdsCursorValue] = useState("")
    const [totalCollectionHistory, setTotalCollectionHistory] = useState(0)
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("Please Wait")
    const [isLoading, setIsLoading] = useState(false)
    const [totalNFTOwners, setTotalNFTOwners] = useState(0)
    const toggle = () => setOpen(!open)

    const isRealValue = (obj: any) => {
        return obj && obj !== 'null' && obj !== 'undefined';
    }

    const handleClick = async (ticket: any) => {
        // if (kycStatus !== KYC_STATUS.VERIFIED) {
        //   addErrorPopup({
        //     txn: {
        //       hash: '',
        //       success: false,
        //       summary: "KYC Not Verified",
        //       description: 'Complete your KYC to allow for buying an NFT',
        //       withExternalLink: false,
        //     }
        //   });
        //   return
        // }

        // onBuyNow(ticket);
    }

    const fetchCollectionMetadata = async (nftAddress: string, platformChain?: any) => {

        const networkName = (Number(platformChain) === 137 ? 'matic' : Number(platformChain) === 80001 ? 'matic testnet' : Number(platformChain) === 56 ? 'bsc' : Number(platformChain) === 97 ? 'bsc testnet' : Number(platformChain) === 5 ? 'goerli' : Number(platformChain) === 4690 ? 'iotx testnet' : Number(platformChain) === 4689 ? 'iotx' : Number(platformChain) === 1666700000 ? 'one testnet' : Number(platformChain) === 1666600000 ? 'one' : Number(platformChain) === 43113 ? 'avalanche testnet' : Number(platformChain) === 43114 ? 'avalanche' : String("eth").toLowerCase())
        const collectionMetadataOptions = {
            method: 'GET',
            url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/metadata`,
            params: { chain: networkName },
            headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
        };

        console.log("collectionMetadataOptions", collectionMetadataOptions);

        try {
            await axios
                .request(collectionMetadataOptions as any)
                .then(async function (response) {
                    console.log(response.data);
                    setIsLoading(false);
                    setMsg("Please wait")
                    const nftItem = await response.data //await Web3Api.token.getTokenIdMetadata(tokenIdMetadataOptions as any);
                    console.log("collectionMetadataOptionsRes", nftItem);
                    // {
                    //     "token_address": "0xcb5e19953032aafe92a4a7ee23f95bd5a0ccdbd1",
                    //     "name": "Duelist King",
                    //     "symbol": "DUELIST KING",
                    //     "contract_type": "ERC721",
                    //     "synced_at": "2022-11-08T00:00:00.000Z"
                    // }
                    let collectionDetObj = {
                        collectionAssetType: nftItem?.contract_type === "ERC721" ? 1 : nftItem?.contract_type === "ERC1155" ? 2 : 0,
                        collectionBannerImage: "",
                        collectionBaseUri: "",
                        collectionBlockNumber: "",
                        collectionCategory: "",
                        collectionChainId: "",
                        collectionAddress: nftItem?.token_address,
                        collectionId: "",
                        collectionCreatedDate: "",
                        collectionCreatorAddress: "",
                        collectionCreatorEarnings: "",
                        collectionCustomCollectionURL: "",
                        collectionDescription: "",
                        collectionFeaturedImage: "",
                        collectionIsConfirmed: "",
                        collectionIsExplicitSensitive: "",
                        collectionIsVerified: "",
                        collectionIsVisibleForPromotion: "",
                        collectionJsonURL: "",
                        collectionLinks: "",
                        collectionLogoImage: "",
                        collectionLowestPrice: 0,
                        collectionName: nftItem?.name,
                        collectionOwnerOf: "",
                        collectionPaymentTokens: "",
                        collectionSymbol: nftItem?.symbol,
                        collectionTopPrice: 0,
                        collectionTotalItems: 0,
                        collectionTotalOwners: 0,
                        collectionTotalVolume: 0,
                        collectionTotalSales: 0,
                        collectionUpdatedDate: "",
                        collectionURL: "",
                        collectionUser: "",
                        collectionRecordId: ""
                    }
                    setCollectionDet(collectionDetObj)
                })
                .catch(function (error) {
                    setIsLoading(false);
                    setMsg("Please wait")
                    console.error(error);
                });
        }
        catch (error: any) {
            setIsLoading(false);
            setMsg("Please wait")
        }
    };

    const fetchCollectionMetadataFromBackend = async (nftAddress: string, platformChain?: any) => {
        try {
            setIsLoading(true);
            setMsg("Retrieving Collection Details")
            await getCollectionDetailsAndStatsData(
                nftAddress
            ).then(async (res: any) => {
                if (res?.status === 200) {
                    const collectionDetailsData = await res.data
                    console.log('collectionDetailsData', collectionDetailsData);
                    if (collectionDetailsData) {
                        setIsLoading(false);
                        setMsg("Please wait")
                        let collectionDetObj = {
                            collectionAssetType: collectionDetailsData?.assetType,
                            collectionBannerImage: collectionDetailsData?.bannerImage,
                            collectionBaseUri: collectionDetailsData?.baseUri,
                            collectionBlockNumber: collectionDetailsData?.blockNumber,
                            collectionCategory: collectionDetailsData?.category,
                            collectionChainId: collectionDetailsData?.chainId,
                            collectionAddress: collectionDetailsData?.collectionAddress,
                            collectionId: collectionDetailsData?.collectionId,
                            collectionCreatedDate: collectionDetailsData?.createdDate,
                            collectionCreatorAddress: collectionDetailsData?.creatorAddress,
                            collectionCreatorEarnings: collectionDetailsData?.creatorEarnings,
                            collectionCustomCollectionURL: collectionDetailsData?.customCollectionUrl,
                            collectionDescription: collectionDetailsData?.description,
                            collectionFeaturedImage: collectionDetailsData?.featuredImage,
                            collectionIsConfirmed: collectionDetailsData?.isConfirmed,
                            collectionIsExplicitSensitive: collectionDetailsData?.isExplicitSensitive,
                            collectionIsVerified: collectionDetailsData?.isVerified,
                            collectionIsVisibleForPromotion: collectionDetailsData?.isVisibleforPromotion,
                            collectionJsonURL: collectionDetailsData?.jsonUrl,
                            collectionLinks: collectionDetailsData?.links,
                            collectionLogoImage: collectionDetailsData?.logoImage,
                            collectionLowestPrice: collectionDetailsData?.lowestPrice,
                            collectionName: collectionDetailsData?.name,
                            collectionOwnerOf: collectionDetailsData?.ownerOf,
                            collectionPaymentTokens: collectionDetailsData?.paymentTokens,
                            collectionSymbol: collectionDetailsData?.symbol,
                            collectionTopPrice: collectionDetailsData?.topPrice,
                            collectionTotalItems: collectionDetailsData?.totalItems,
                            collectionTotalOwners: collectionDetailsData?.totalOwners,
                            collectionTotalVolume: collectionDetailsData?.totalVolume,
                            collectionTotalSales: collectionDetailsData?.totalSales,
                            collectionUpdatedDate: collectionDetailsData?.updatedDate,
                            collectionURL: collectionDetailsData?.url,
                            collectionUser: collectionDetailsData?.user,
                            collectionRecordId: collectionDetailsData?._id
                        }
                        setCollectionDet(collectionDetObj)
                    }
                    else {
                        fetchCollectionMetadata(params.nftcontractaddress, params.platformChain)
                    }
                }
                else {
                    fetchCollectionMetadata(params.nftcontractaddress, params.platformChain)
                }
            }).catch(err => {
                console.log(err.message || 'Error while getting collection data ')
                fetchCollectionMetadata(params.nftcontractaddress, params.platformChain)
            })
        }
        catch (error: any) {
            fetchCollectionMetadata(params.nftcontractaddress, params.platformChain)
        }
    };

    const fetchNFTOwners = async (nftAddress: string, platformChain?: any) => {
        try {
            const networkName = (Number(platformChain) === 137 ? 'matic' : Number(platformChain) === 80001 ? 'matic testnet' : Number(platformChain) === 56 ? 'bsc' : Number(platformChain) === 97 ? 'bsc testnet' : Number(platformChain) === 5 ? 'goerli' : Number(platformChain) === 4690 ? 'iotx testnet' : Number(platformChain) === 4689 ? 'iotx' : Number(platformChain) === 1666700000 ? 'one testnet' : Number(platformChain) === 1666600000 ? 'one' : Number(platformChain) === 43113 ? 'avalanche testnet' : Number(platformChain) === 43114 ? 'avalanche' : String("eth").toLowerCase())
            const options = {
                method: 'GET',
                url: `${MORALIS_API_SERVER_URL}/nft/${nftAddress}/owners`,
                params: { chain: networkName, format: 'decimal', normalizeMetadata: 'true', limit: itemsLimit, cursor: null },
                headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
            };

            console.log('nftOwners options', options);

            await axios
                .request(options as any)
                .then(async function (response) {
                    console.log("nftOwnersnftOwnersnftOwnersnftOwners", response.data);
                    const nftOwners = await response.data; //await Web3Api.token.getTokenIdOwners(options as any);
                    setTotalNFTOwners(Number(nftOwners?.total) || 0)
                })
                .catch(function (error) {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log('paramsparams', params);
        onFetchInitialData()
        fetchNFTOwners(params.nftcontractaddress, params.platformChain)
        fetchCollectionMetadataFromBackend(params.nftcontractaddress, params.platformChain)
    }, [params])

    const onFetchInitialData = () => {
        setMoreNFTsDataSet([])
        nextCursor.current = undefined
        fetchedTotalItemsRef.current = 0
        totalItemsRef.current = 0
        setNftContractAddress(params.nftcontractaddress)
        fetchAllTokenIds(params.nftcontractaddress, undefined, params.platformChain)
    }

    const fetchAllTokenIds = async (nftcontractaddress: string, cursorValue?: string, platformChain?: any) => {
        try {
            // const options = {
            //     address: nftcontractaddress,
            //     chain: networkName,
            //     cursor: cursorValue ? cursorValue : null,
            //     limit: 10
            // };
            const networkName = (Number(platformChain) === 137 ? 'matic' : Number(platformChain) === 80001 ? 'matic testnet' : Number(platformChain) === 56 ? 'bsc' : Number(platformChain) === 97 ? 'bsc testnet' : Number(platformChain) === 5 ? 'goerli' : Number(platformChain) === 4690 ? 'iotx testnet' : Number(platformChain) === 4689 ? 'iotx' : Number(platformChain) === 1666700000 ? 'one testnet' : Number(platformChain) === 1666600000 ? 'one' : Number(platformChain) === 43113 ? 'avalanche testnet' : Number(platformChain) === 43114 ? 'avalanche' : String("eth").toLowerCase())
            const chainIdOfAPICallBack = platformChain //NetworkChainId[network]
            const options = {
                method: 'GET',
                url: `${MORALIS_API_SERVER_URL}/nft/${nftcontractaddress}`,
                params: { chain: networkName, format: 'decimal', cursor: cursorValue ? cursorValue : null, limit: itemsLimit },
                headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
            };

            await axios
                .request(options as any)
                .then(async function (response) {
                    console.log(response.data);
                    console.log("NFTsoptions", options);
                    const NFTs = await response.data //await Web3Api.token.getAllTokenIds(options as any);
                    console.log("NFTs", NFTs);
                    nextCursor.current = (NFTs as any).cursor
                    totalItemsRef.current = (NFTs as any).total

                    const cursorVal = (NFTs as any).cursor;
                    setTotalCollectionHistory(Number(NFTs?.total) || 0)
                    // setCollectionTokenIdsCursorValue(cursorVal)

                    const moreNFTs = NFTs?.result || []

                    const fetchMoreActiveItemsObjArray = moreNFTs && moreNFTs?.map(async (nftItem: any, index: number) => {

                        let nftMetaDataJson = JSON.parse(nftItem?.metadata)
                        let nftName = nftItem?.name ?? ''
                        let nftSymbol = nftItem?.symbol ?? ''
                        let tokenURIOfNFT = nftItem?.token_uri ?? ''
                        let nftImage = ''
                        let nftDescription = ''
                        let nftAttributes = ''

                        console.log("propro", nftItem?.metadata, nftItem?.tokenURIOfNFT);

                        if (isRealValue(nftItem?.metadata)) {
                            nftImage = resolveLink(nftMetaDataJson?.image)
                            nftName = nftMetaDataJson?.name
                            nftDescription = nftMetaDataJson?.description
                            nftAttributes = nftMetaDataJson?.attributes
                        } else if (nftItem?.token_uri) {
                            try {
                                await fetch(nftItem?.token_uri)
                                    .then((response) => response.json())
                                    .then((data) => {
                                        nftImage = resolveLink(data?.image ? data?.image : data?.image_url ? data?.image_url : '')
                                        nftName = data?.name
                                        nftDescription = data?.description
                                        nftAttributes = data?.attributes
                                    });
                            } catch (error) {
                                console.log('Failed to retried assets information from tokenURI');
                            }
                        }

                        return {
                            recordId: Number(index) + 1,
                            nftAmount: nftItem?.amount ?? '0',
                            nftBlockNumberMinted: nftItem?.block_number_minted,
                            nftContractType: nftItem?.contract_type ?? '',
                            nftMetaData: nftMetaDataJson,
                            nftName: nftName,
                            nftSymbol: nftSymbol,
                            nftTokenAddress: nftItem?.token_address ?? "",
                            nftTokenHash: nftItem?.token_hash ?? "",
                            nftTokenId: nftItem?.token_id,
                            nftTokenURI: tokenURIOfNFT,
                            nftImage: nftImage,
                            nftDescription: nftDescription,
                            networkChainIdValue: chainIdOfAPICallBack,
                            networkChainName: networkName.toUpperCase(),
                            nftAttributes: nftAttributes
                        };

                    }) || []
                    const fetchMoreActiveItemsDataArray = await Promise.all(fetchMoreActiveItemsObjArray)
                    console.log("fetchMoreActiveItemsDataArray", fetchMoreActiveItemsDataArray);
                    const tokens = fetchMoreActiveItemsDataArray.map((item: any) => ({ tokenAddress: item.nftTokenAddress, tokenId: item.nftTokenId }))
                    getTokenLikes(tokens)
                    setMoreNFTsDataSet((prev: any) => [...prev, ...fetchMoreActiveItemsDataArray])
                    console.log("fetchMoreActiveItemsDataArray11", moreNFTsDataSet);
                    fetchedTotalItemsRef.current = fetchedTotalItemsRef.current + fetchMoreActiveItemsDataArray.length
                    if (itemLoadingRef.current) setInfiniteLoader(prev => !prev)
                    itemLoadingRef.current = false
                })
                .catch(function (error) {
                    itemLoadingRef.current = false
                    setInfiniteLoader(prev => !prev)
                    console.error(error);
                });
        } catch (error) {
            itemLoadingRef.current = false
            setInfiniteLoader(prev => !prev)
            console.log("Failed to Load Owned NFT Error", error);
        }
    };

    useEffect(() => {
        console.log('datata', moreNFTsDataSet);
    }, [moreNFTsDataSet])

    const fetchMoreData = () => {
        setTimeout(() => {
            fetchAllTokenIds(params.nftcontractaddress, collectionTokenIdsCursorValue, params.platformChain)
        }, 1500);
    };

    const handleScroll = () => {
        // if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        // console.log('Fetch more list items!');
        // fetchMoreData()

        console.log("scrolled", nextCursor.current, getScrollPercent(), itemLoadingRef.current, totalItemsRef.current, fetchedTotalItemsRef.current)
        if (nextCursor.current && getScrollPercent() > 85 && !itemLoadingRef.current && totalItemsRef.current > fetchedTotalItemsRef.current) {
            console.log("scrolled above 85% of the page loading next items Wallet Page")
            itemLoadingRef.current = true
            setInfiniteLoader(prev => !prev)
            fetchAllTokenIds(params.nftcontractaddress, nextCursor.current, params.platformChain)
        }
        else {
            setInfiniteLoader(false)
        }
    }

    useEffect(() => {
        setCollectionTokenIdsCursorValue("")
        setMoreNFTsDataSet([])
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        // window.addEventListener('resize', () => setwinSize(window.innerWidth))
        // setIsOpened(winSize <= 768 ? false : true)
    }, []) //winSize

    return (
        <>
            {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
            <div className="individual-collection">
                <div className="individual-collection-wrapper">
                    {/* <SellingFilter
                    network={network}
                    collections={[]}
                    filters={{}}
                    onApplyFilter={() => { }}
                    setIsOpened={() => { }}
                    isOpened={isOpened}
                    winSize={winSize} /> */}
                    <div className="individual-collection-profile">
                        {/* <div className="nav">
                        <div className="filter-buynow">
                            <div className="filter_icon" onClick={() => { window.innerWidth < 1025 && setOpen(true) }}>
                                <div className="filter">FILTERS</div>
                                <img src={filterIcon} alt="filter icon" />
                            </div>
                        </div>
                        <div className="result-selling-wrapper">
                            <div className="sort">
                                <div className="select_selling">
                                    <select
                                        name="best selling"
                                        id="best_selling"
                                        className="currency"
                                        onChange={(e) => setTicketsToDisplay(e.target.value)}
                                    >
                                        <option value="test" style={{ display: 'none' }}>Default</option>
                                        {sellingDropdown.map((sellingData) => {
                                            return (
                                                <option value={sellingData.value}>{sellingData.label}</option>
                                            )
                                        })}
                                    </select>
                                    <div className="dropdown_arrow">
                                        <img src={downArrow} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                        <div className="individual-collection-profile-wrapper">
                            <div className="individual-collection-avtar-background">
                                <img className="avatar-background" src={collectionDet?.collectionFeaturedImage && collectionDet?.collectionFeaturedImage != "" ? collectionDet?.collectionFeaturedImage : `/images/individual-collection-background.png`} alt="avtar background" />
                                <img className="avatar-pic" src={collectionDet?.collectionLogoImage && collectionDet?.collectionLogoImage != "" ? collectionDet?.collectionLogoImage : `/images/liveproject/avtar.svg`} alt="avtar" />
                            </div>
                        </div>
                        <div className="individual-collection-profile-info-wrapper">
                            <div className="individual-collection-profile-title-links">
                                <div className="individual-collection-profile-title">{collectionDet?.collectionName && collectionDet?.collectionName != "" ? collectionDet?.collectionName : `Un-Identified Collection`}</div>
                                <div className="individual-collection-profile-by-links">
                                    <div className="individual-collection-profile-by-label">{collectionDet?.collectionUser && collectionDet?.collectionUser?.name.length > 0 ? `By ${collectionDet?.collectionUser?.name}` : collectionDet?.collectionUser?.walletAddress ? shortenAddress(collectionDet?.collectionUser?.walletAddress) : "By Unnamed"}</div>
                                    <div className="individual-collection-profile-links-share">
                                        <div className="individual-profile-links">
                                            {collectionDet?.collectionLinks && collectionDet?.collectionLinks[0].link.length >= 1 && <img className="individual-link" src='/images/liveproject/website.svg' alt={"website"} onClick={() => window.open(collectionDet?.collectionLinks[0].link, "_blank")} />}
                                            {collectionDet?.collectionLinks && collectionDet?.collectionLinks[1].link.length >= 20 && <img className="individual-link" src='/images/liveproject/discord.svg' alt={"discord"} onClick={() => window.open('https://discord.gg/' + collectionDet?.collectionLinks[1].link, "_blank")} />}
                                            {collectionDet?.collectionLinks && collectionDet?.collectionLinks[2].link.length >= 1 && <img className="individual-link" src='/images/liveproject/instagram.svg' alt={"instagram"} onClick={() => window.open(collectionDet?.collectionLinks[2].link, "_blank")} />}
                                            {collectionDet?.collectionLinks && collectionDet?.collectionLinks[3].link.length >= 25 && <img className="individual-link" src='/images/liveproject/medium.svg' alt={"medium"} onClick={() => window.open('https://www.medium.com/@' + collectionDet?.collectionLinks[3].link, "_blank")} />}
                                            {collectionDet?.collectionLinks && collectionDet?.collectionLinks[4].link.length >= 13 && <img className="individual-link" src='/images/liveproject/telegram_new.svg' alt={"telegram"} onClick={() => window.open('https://t.me/' + collectionDet?.collectionLinks[4].link, "_blank")} />}
                                        </div>
                                        {/* <div className="individual-profile-share">
                                        {
                                            shares?.map((shareData) => <img className="individual-share" src={shareData?.url} alt={"share icon"} />)
                                        }
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="individual-collection-profile-links-share-for-mobile">
                                <div className="individual-profile-links">
                                    {collectionDet?.collectionLinks && collectionDet?.collectionLinks[0].link.length >= 1 && <img className="individual-link" src='/images/liveproject/website.svg' alt={"website"} onClick={() => window.open(collectionDet?.collectionLinks[0].link, "_blank")} />}
                                    {collectionDet?.collectionLinks && collectionDet?.collectionLinks[1].link.length >= 20 && <img className="individual-link" src='/images/liveproject/discord.svg' alt={"discord"} onClick={() => window.open('https://discord.gg/' + collectionDet?.collectionLinks[1].link, "_blank")} />}
                                    {collectionDet?.collectionLinks && collectionDet?.collectionLinks[2].link.length >= 1 && <img className="individual-link" src='/images/liveproject/instagram.svg' alt={"instagram"} onClick={() => window.open(collectionDet?.collectionLinks[2].link, "_blank")} />}
                                    {collectionDet?.collectionLinks && collectionDet?.collectionLinks[3].link.length >= 25 && <img className="individual-link" src='/images/liveproject/medium.svg' alt={"medium"} onClick={() => window.open('https://www.medium.com/@' + collectionDet?.collectionLinks[3].link, "_blank")} />}
                                    {collectionDet?.collectionLinks && collectionDet?.collectionLinks[4].link.length >= 13 && <img className="individual-link" src='/images/liveproject/telegram_new.svg' alt={"telegram"} onClick={() => window.open('https://t.me/' + collectionDet?.collectionLinks[4].link, "_blank")} />}
                                </div>
                                {/* <div className="individual-profile-links">
                                {
                                    links?.map((shareLink) => <img className="individual-link" src={shareLink?.link} alt={shareLink?.label} />)
                                }
                            </div>
                            <div className="individual-profile-share">
                                {
                                    shares?.map((shareData) => <img className="individual-share" src={shareData?.url} alt={"share icon"} />)
                                }
                            </div> */}
                            </div>
                            <div className="individual-profile-description">
                                {collectionDet?.collectionDescription && collectionDet?.collectionDescription != "" ? collectionDet?.collectionDescription : `This collection has no description yet. Contact the owner of this collection about setting it up on GenShards!.`}
                            </div>
                            <div className='individual-collection-profile-all-details'>
                                <div className='individual-collection-details-wrapper'>
                                    <div className='individual-collection-detail-value'>{(collectionDet?.collectionTotalItems > 0 && collectionDet?.collectionTotalItems != "") ? Number(collectionDet?.collectionTotalItems || 0)?.toFixed(0) : totalCollectionHistory > 0 ? totalCollectionHistory : 0}</div>
                                    <div className='individual-collection-detail-label'>Items</div>
                                </div>
                                <div className='individual-collection-details-wrapper'>
                                    <div className='individual-collection-detail-value'>{totalNFTOwners || 0}</div>
                                    <div className='individual-collection-detail-label'>Owners</div>
                                </div>
                                <div className='individual-collection-details-wrapper with-eth'>
                                    <div className='individual-collection-detail-value'>{Number(collectionDet?.collectionTotalVolume || 0)?.toFixed(4) || 0}</div>
                                    <div className='individual-collection-detail-label'>Total Volume</div>
                                </div>
                                <div className='individual-collection-details-wrapper with-eth'>
                                    <div className='individual-collection-detail-value'>{Number(collectionDet?.collectionLowestPrice || 0)?.toFixed(4) || 0}</div>
                                    <div className='individual-collection-detail-label'>Floor Price</div>
                                </div>
                                <div className='individual-collection-details-wrapper with-eth'>
                                    <div className='individual-collection-detail-value'>{Number(collectionDet?.collectionTopPrice || 0)?.toFixed(4) || 0}</div>
                                    <div className='individual-collection-detail-label'>Best Offer</div>
                                </div>
                                <div className='individual-collection-details-wrapper with-eth'>
                                    <div className='individual-collection-detail-value'>{Number(collectionDet?.collectionTotalSales || 0)?.toFixed(0) || 0}</div>
                                    <div className='individual-collection-detail-label'>Total Sales</div>
                                </div>
                            </div>
                        </div>
                        <div className="garen_wraper row">
                            {moreNFTsDataSet.length > 0 ?
                                <>
                                    {moreNFTsDataSet?.map((ticket: any) => {
                                        const videoFormat = isVideoFormat(ticket.nftImage);
                                        const totalLikes = tokenLikes && tokenLikes[`${String(ticket.nftTokenAddress).toLowerCase()}_${ticket.nftTokenId}`] || 0
                                        return (
                                            <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-4 col-6" >
                                                <div className="px-1 py-3">
                                                    <div
                                                        className="garen"
                                                        onClick={() => history.push(`/assets/${ticket?.nftTokenAddress}/${ticket?.nftTokenId}`, ticket)}
                                                    >
                                                        <div className="garen_img">
                                                            {
                                                                videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={ticket.nftImage} loop={false} />
                                                                    : <img src={ticket?.nftImage && ticket?.nftImage.split('.').pop() !== "svg+xml" ? ticket?.nftImage : `/images/noimageavailable.png`} alt="" loading="lazy" />
                                                            }
                                                            {/* <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={true} muted={true} url={ticket.src} loop={true} /> */}
                                                            <div className="heart">
                                                                <div className="heart_img">
                                                                    <img src={likeIcon} alt="Heart" />
                                                                </div>
                                                                <div className="heart_text">{totalLikes}</div>
                                                            </div>
                                                        </div>
                                                        <div className="silver_section">
                                                            <div className="silver_lake">
                                                                <p className="lake">{`${shortenAddress(ticket?.nftTokenAddress)}`}</p>
                                                                {/* <p className="price">
                                                                PRICE <span>{ticket?.nftPrice} ETH</span>
                                                            </p> */}
                                                            </div>
                                                            <div className="eden">
                                                                <p className="eden_text">{ticket?.nftName}</p>
                                                                {/* <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClick(ticket);
                                                            }}>BUY NOW</button> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {infiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
                                </>
                                : (
                                    <div style={{ color: 'black', textAlign: 'center', height: '100%' }} className="no-data-found">No Projects Available!</div>
                                )}
                        </div>

                    </div>
                </div>
                <div className="filter-modal">
                    <Modal isOpen={open} centered>
                        <ModalBody>
                            <SellingFilter
                                network={network}
                                collections={[]}
                                filters={{}}
                                onApplyFilter={() => { }}
                                setIsOpened={() => { }}
                                isOpened={isOpened}
                                winSize={winSize} />
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={() => { toggle() }} style={{ color: 'black', backgroundColor: 'white' }}>
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                onClick={() => { toggle() }}
                            >
                                DONE
                            </button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default IndividualCollection