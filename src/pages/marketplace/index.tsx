import { useEffect, useState, useRef } from 'react'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import WhyGenshards from './components/aboutGeneshards'
import BrowseByCategory from './components/browseByCategory'
import SellingPlace, { sellingDropdown } from './components/collectionPage'
import FeatureComponent from './components/fetured'
import Footers from './components/footer'
import FreshComponent from './components/freshComponent'
import MarketPlaceHeader from './components/header'
import GardenofEden from './components/individualProfile/individualProject'
import JustInOthersWorlds from './components/jusyInComponent'
import SellingFilter from './components/sidebar'
import TrendingProjects from './components/trendinProjects'
import { useIPFS } from '../../hooks/useIPFS'
import { useSelector } from 'react-redux';
import { AppState } from '../../state'
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA, PROJECTS_DATA, PROJECTS_DATA_BSC, PROJECTS_DATA_MATIC, PROJECTS_DATA_IOTEX, PROJECTS_DATA_HARMONY, PROJECTS_DATA_AVALANCHE, PROJECTS_DATA_GOERLI, PROJECTS_DATA_MUMBAI, PROJECTS_DATA_IOTEX_NETWORK_TESTNET, PROJECTS_DATA_HARMONY_NETWORK_TESTNET, PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET, PROJECTS_DATA_BSC_NETWORK_TESTNET, MORALIS_API_SERVER_URL, MORALIST_API_KEY, GET_ALL_NFTS_DATA } from '../../constants'
import { abi as GEN_TICKET_ABI_v1 } from '../../contracts/GenTickets_v1.json'
import { abi as GEN_TICKET_ABI } from '../../contracts/GenTickets.json';
import { abi as GEN_MARKETPLACE_ABI } from '../../contracts/GenMarketPlace.json';
import GEN_NFT_MARKETPLACE_ABI from '../../contracts/GenNFTMarketPlace.json';
import { abi as GENNFT_ABI } from '../../contracts/GenNFT.json'

import './style.sass'
import { useWeb3Contract } from '../../hooks/useContract'
import { useGetNumberOfTicketTypes } from '../../state/ticket/hooks'
import { getGenTicketUrl } from '../dashboard/dashboard.helpers'
import { getTicketMetadata } from '../../utils/genTicketMetadata'
import { Card } from '../../state/market/types'
import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from '../../hooks/web3'
import { flatten, get } from 'lodash'
import Web3 from 'web3'
import { NetworkChainId, NetworkURL } from '../../connectors'
import { getContract, getScrollPercent } from '../../utils'
import LoaderComp from '../../shared/components/LoaderComponent'
// import { useMoralisWeb3Api } from "react-moralis";
import IndividualCollection from './components/individualCollection'
import Cart from './components/cart'
import axios from 'axios'
import { getNftVotesByTokens } from './API/ApiCall'
import { useTokenLikes } from '../../hooks/tokens'

// export interface IUserNFT {
//     _id: string
//     name: string
//     nftAsset: string
//     description: string
//     user: {
//         walletAddress: string
//         _id: string
//     }
//     nftCollection: {
//         collectionAddress: string
//         customCollectionUrl: string
//         name: string
//         _id: string
//     }
// }

export interface IUserNFT {
    _id: string,
    tokenAddress: string,
    chainId: number,
    tokenId: string,
    listingPrice: number,
    lastSoldPrice: number,
    offerPrice?: number,
    auctionPrice?: number,
    user: {
        _id: string,
        name: string,
        walletAddress: string,
        username: string,
        profileImage: string,
    },
    nft: {
        name: string,
        nftAsset: string,
        description: string
    },
    collection: {
        name: string,
        assetType: number,
        logoImage: string,
    },
    nftListings?: {
        _id: string,
        listingStartPrice: number,
        quantity: number,
        actualRemainingQuantity: number,
        startTime: number,
        endTime: number,
        assetType: number,
        nftItemId: number,
        fromAddress: string,
    }[],
}
export interface INftCollection {
    _id: string
    name: string
    logoImage: string
    chainId: number,
    bannerImage: string
    description: string
    collectionAddress: string
    user: {
        username: string
        name: string
        profileImage: string
        walletAddress: string
        _id: string
    }
    topPrice?: number
    totalItems?: number
    totalOwners?: number
    totalVolume?: number
    totalSales?: number
    lowestPrice?: number
}

export interface INftCategory {
    _id: string
    name: string
    icon: string
    image: string
}

const MarketPage = () => {
    return (
        <div className="marketplace">
            <FeatureComponent />
            <FreshComponent />
            <TrendingProjects />
            <BrowseByCategory />
            <JustInOthersWorlds />
            <WhyGenshards />
            <Footers />
        </div>
    )
}

const CollectionPage = ({ searchedText }) => {
    const { resolveLink } = useIPFS();
    const [winSize, setwinSize] = useState(window.innerWidth)
    const [isOpened, setIsOpened] = useState(true)
    const [refreshData, setRefreshData] = useState(false)
    const [data, setData] = useState<any[] | IUserNFT[]>([])
    const [nftsData, setNftsData] = useState<any[] | IUserNFT[]>([])
    const [tickets, setTickets] = useState<any[]>([]);
    const [ticketsToDisplay, setTicketsToDisplay] = useState<any[]>([]);
    const genMarketPlace = useWeb3Contract(GEN_MARKETPLACE_ABI)
    const getNumberOfTicketTypes = useGetNumberOfTicketTypes()
    const network = useSelector((state: AppState) => state.application.network)
    const genNFTMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const { account, chainId, library } = useActiveWeb3React()
    const [filters, setFilters] = useState({ categoryId: "", chainId: Number(chainId || 0), listingType: "" });
    const [isLoading, setIsLoading] = useState(false)
    const [infiniteLoader, setInfiniteLoader] = useState(false)
    const [selectedSortBy, setSelectedSortBy] = useState(sellingDropdown[0] && sellingDropdown[0].value)
    const [priceRange, setPriceRange] = useState<string>("")
    const [msg, setMsg] = useState("Please Wait")
    // let dataArrayRes: any = {};

    const [totalNumberOfResults, setTotalNumberOfResults] = useState(0)
    const isRealValue = (obj: any) => {
        return obj && obj !== 'null' && obj !== 'undefined';
    }
    const { getTokenLikes } = useTokenLikes()

    const itemsLimit = 50
    const itemLoadingRef = useRef(false)
    const totalItemsRef = useRef(0)
    const fetchedTotalItemsRef = useRef(0)
    const nextCursor = useRef(undefined)

    // const Web3Api = useMoralisWeb3Api();

    // const fetchSearchNFTs = async () => {
    //     const options = { q: "", chain: "goerli", filter: "global" };
    //     const NFTs = await Web3Api.token.searchNFTs(options as any);
    //     console.log(NFTs);
    // };

    useEffect(() => {
        window.addEventListener('resize', () => setwinSize(window.innerWidth))
        setIsOpened(winSize <= 768 ? false : true)
    }, [winSize])

    useEffect(() => {
        console.log("ppppp");
        if (network) {
            onFetchInitialData()
            // //let collections = const array3 = [...PROJECTS_DATA_BSC, ...PROJECTS_DATA_MATIC];
            // let collections = network == 'BSC' ? PROJECTS_DATA_BSC : network == 'MATIC' ? PROJECTS_DATA_MATIC : network == 'IOTEX' ? PROJECTS_DATA_IOTEX : network == 'HARMONY' ? PROJECTS_DATA_HARMONY : network == 'AVALANCHE' ? PROJECTS_DATA_AVALANCHE : network == 'GOERLI' ? PROJECTS_DATA_GOERLI : network == 'MUMBAI' ? PROJECTS_DATA_MUMBAI : network == 'T-IoTeX' ? PROJECTS_DATA_IOTEX_NETWORK_TESTNET : network == 'T-HRMNY' ? PROJECTS_DATA_HARMONY_NETWORK_TESTNET : network == 'T-AVALANCHE' ? PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET : network == 'T-BSC' ? PROJECTS_DATA_BSC_NETWORK_TESTNET : PROJECTS_DATA;
            // collections = collections.filter(({ marketPlaceAddress }) => marketPlaceAddress);
            // setData(collections);
        }
        setFilters({ categoryId: "", listingType: "", chainId: Number(chainId) })
    }, [network, account, chainId])

    useEffect(() => {
        if (searchedText.length) {
            onFetchInitialData(searchedText)
        }
    }, [searchedText])

    useEffect(() => {
        const [minPrice = 0, maxPrice = 0] = priceRange.split("_")
        setIsLoading(true)

        axios.get(GET_ALL_NFTS_DATA.concat("/all"), { params: { sortBy: selectedSortBy, minPrice, maxPrice, ...filters } }).then(async ({ data }) => {
            console.log("All Filter Option Data", data);
            const getAllDBNFTDataArray = data?.values || []
            const getDBNFTResultsArray = getAllDBNFTDataArray && getAllDBNFTDataArray?.map(async (item, index) => {
                let nftImage = item?.nft?.nftAsset ?? ""
                let nftName = item?.nft?.name ?? ""
                let nftDescription = item?.nft?.description ?? ""
                if (nftName == "" || nftImage == "") {
                    try {
                        await fetch(item?.nft?.token_uri)
                            .then((response) => response.json())
                            .then((dataObject) => {
                                console.log('dataObject', dataObject);
                                nftImage = resolveLink(dataObject?.image ? dataObject?.image : dataObject?.image_url ? dataObject?.image_url : '')
                                nftName = dataObject?.name
                                nftDescription = dataObject?.description
                            });

                    } catch (error) {
                        console.log('Failed to retried assets information from tokenURI');
                    }
                }
                return { id: index + 1, auctionPrice: item?.auctionPrice, chainId: item?.chainId ?? {}, collection: item?.collection, lastSoldPrice: item?.lastSoldPrice, listingPrice: item?.listingPrice, nftListings: item?.nftListings, offerPrice: item?.offerPrice, tokenAddress: item?.tokenAddress, tokenId: item?.tokenId, user: item?.user, _id: item?._id, nft: item?.nft, nftName: nftName, nftDescription: nftDescription, nftImage: nftImage};
            }) || []
            let dbDataArrayResults = await Promise.all(getDBNFTResultsArray)
            console.log('dbDataArrayResultsdbDataArrayResults', dbDataArrayResults);
            
            setNftsData(dbDataArrayResults || [])
            const tokens = dbDataArrayResults.map((item: any) => ({ tokenAddress: item.tokenAddress, tokenId: item.tokenId }))
            getTokenLikes(tokens)
            setIsLoading(false)
        }).catch(err => setIsLoading(false))
    }, [selectedSortBy, priceRange, filters])

    const onFetchInitialData = (searchedText = "") => {

        // // moralis data
        setData([])
        nextCursor.current = undefined
        fetchedTotalItemsRef.current = 0
        totalItemsRef.current = 0
        getInitialFetchActiveItemsData(undefined, searchedText)
    }

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    const handleScroll = () => {
        if (nextCursor.current && getScrollPercent() > 85 && !itemLoadingRef.current && totalItemsRef.current > fetchedTotalItemsRef.current) {
            console.log("scrolled above 85% of the page loading next items")
            itemLoadingRef.current = true
            setInfiniteLoader(prev => !prev)
            getInitialFetchActiveItemsData(nextCursor.current)
        }
        else {
            setInfiniteLoader(false)
        }
    }

    const getInitialFetchActiveItemsData = async (cursorValue?: string, queryString?: string) => {
        try {

            const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
            // const options = { q: queryString ? queryString : "top", chain: networkName, filter: "name", limit: 100, cursor: cursorValue ? cursorValue : null };
            const chainIdOfAPICallBack = NetworkChainId[network]

            const options = {
                method: 'GET',
                url: `${MORALIS_API_SERVER_URL}/nft/search`,
                params: { chain: networkName, format: 'decimal', q: queryString ? queryString : "top", filter: 'name', limit: itemsLimit, cursor: cursorValue ? cursorValue : null },
                headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
            };
            console.log("NFTDataArray options", options);
            console.log("ppppp2");
            await axios
                .request(options as any)
                .then(async function (response) {
                    console.log(response.data);
                    console.log("ppppp3");
                    const NFTDataArray = await response.data //await Web3Api.token.searchNFTs(options as any);
                    console.log("NFTDataArray", NFTDataArray);
                    nextCursor.current = NFTDataArray.cursor
                    totalItemsRef.current = NFTDataArray.total
                    // dataArrayRes = NFTDataArray
                    // const genNFTMarketPlace = getContract(genNFTMarketPlaceContractAddress, GEN_NFT_MARKETPLACE_ABI, library!, account!)
                    // if (!genNFTMarketPlace) throw new Error('No NFT MarketPlace Contract Found!')

                    // fetchActiveItems
                    /*const fetchActiveItemsDetails = await genNFTMarketPlace.fetchActiveItems()
                    const fetchActiveItemsObjArray = fetchActiveItemsDetails && fetchActiveItemsDetails?.map(async (item, index) => {
                       
                        const genNFTContract = getContract(item?.nftContract, GENNFT_ABI, library!, account!)
                        if (!genNFTContract) throw new Error('No NFT Contract Found!')
        
                        const balanceOfNFT = await genNFTContract.balanceOf(account!)
                        const baseURIOfNFT = await genNFTContract.baseURI()
                        const nameOfNFT = await genNFTContract.name()
                        const nameOfNFTProject = await genNFTContract.projectName()
                        const symbolOfNFT = await genNFTContract.symbol()
                        const symbolOfNFTProject = await genNFTContract.projectSymbol()
                        const tokenURIOfNFT = await genNFTContract.tokenURI(parseInt(item?.tokenId ?? 0, 16))
        
                        return { recordId: parseInt(item?.id ?? 0, 16), nftBuyer: item?.buyer ?? "", nftContract: item?.nftContract ?? "", nftState: item?.state ?? 0, nftSeller: item?.seller ?? "", nftTokenId: parseInt(item?.tokenId ?? 0, 16), nftPrice: item?.price && Number(formatEther(item?.price)), numberOfNFTHolding:  parseInt(balanceOfNFT ?? 0, 16), baseURIOfNFT: baseURIOfNFT, nameOfNFT: nameOfNFT, nameOfNFTProject: nameOfNFTProject, symbolOfNFT: symbolOfNFT, symbolOfNFTProject: symbolOfNFTProject, tokenURIOfNFT: tokenURIOfNFT};
                      
                    }) || []*/

                    // fetchActiveItems             
                    setTotalNumberOfResults(Number(NFTDataArray?.total))
                    const fetchActiveItemsDetails = NFTDataArray?.result
                    const fetchActiveItemsObjArray = fetchActiveItemsDetails && fetchActiveItemsDetails?.map(async (nftItem: any, index: number) => {

                        // console.log("Data", item);

                        //Get metadata for one nft.
                        // const nft_collection_metadata_options = {
                        //     chain: networkName,
                        //     address: nftItem?.token_address
                        // };
                        const nftCollectionMetadata = {} //await Web3Api.token.getNFTMetadata(nft_collection_metadata_options as any);
                        // // console.log("nftCollectionMetadata", nftCollectionMetadata);

                        // //Get owners of NFT.
                        // const nft_owner_metadata_options = {
                        //     chain: networkName,
                        //     address: item?.token_address
                        // };
                        // const nftOwnerData = await Web3Api.token.getNFTOwners(nft_owner_metadata_options as any);
                        // console.log("nftOwnerData", nftOwnerData);

                        const nftMetaDataJson = JSON.parse(nftItem?.metadata)

                        const balanceOfNFT = nftItem?.amount ?? '1'
                        const baseURIOfNFT = ''
                        const nameOfNFT = nftMetaDataJson?.name ?? ''
                        const nameOfNFTProject = '' //nftCollectionMetadata?.name ?? ''
                        const symbolOfNFT = ''
                        const symbolOfNFTProject = '' //nftCollectionMetadata?.symbol ?? ''
                        const tokenURIOfNFT = nftItem?.token_uri ?? ''
                        const lastUpdatedAtNFT = nftItem?.updatedAt
                        const lastCreatedAtNFT = nftItem?.createdAt
                        const nftContractType = nftItem?.contract_type ?? ''

                        return {
                            recordId: Number(index) + 1,
                            nftBuyer: "0x0000000000000000000000000000000000000000",
                            nftContract: nftItem?.token_address ?? "",
                            nftState: 0,
                            nftSeller: nftItem?.minter_address ?? "",
                            nftTokenId: nftItem?.token_id,
                            nftPrice: 0,
                            numberOfNFTHolding: balanceOfNFT,
                            baseURIOfNFT: baseURIOfNFT,
                            nameOfNFT: nameOfNFT,
                            nameOfNFTProject: nameOfNFTProject,
                            symbolOfNFT: symbolOfNFT,
                            symbolOfNFTProject: symbolOfNFTProject,
                            tokenURIOfNFT: tokenURIOfNFT,
                            nftContractType: nftContractType,
                            lastCreatedAtNFT: lastCreatedAtNFT,
                            lastUpdatedAtNFT: lastUpdatedAtNFT,
                            nftMetaData: nftMetaDataJson,
                            networkChainName: networkName.toUpperCase(),
                            networkChainIdValue: chainIdOfAPICallBack,
                            nftCollectionMetaData: nftCollectionMetadata,
                            nftImage: ''
                        };

                    }) || []
                    const fetchActiveItemsDataArray = await Promise.all(fetchActiveItemsObjArray)
                    // console.log('fetchActiveItemsDataArray', fetchActiveItemsDataArray);
                    const tokens = fetchActiveItemsDataArray.map((item: any) => ({ tokenAddress: item.nftContract, tokenId: item.nftTokenId }))
                    getTokenLikes(tokens)
                    setData((prev: any) => [...prev, ...fetchActiveItemsDataArray])
                    fetchedTotalItemsRef.current = fetchedTotalItemsRef.current + fetchActiveItemsDataArray.length
                    if (itemLoadingRef.current) setInfiniteLoader(prev => !prev)
                    itemLoadingRef.current = false
                    // setData(fetchActiveItemsDataArray);
                })
                .catch(function (error) {
                    itemLoadingRef.current = false
                    setInfiniteLoader(prev => !prev)
                    console.error(error);
                });

        } catch (error) {
            itemLoadingRef.current = false
            setInfiniteLoader(prev => !prev)
            console.log("TGGGG Error", error);
        }
    }

    const web3Custom = (ABI: any) => {
        return (address: string) => {
            let web3 = new Web3(NetworkURL[network])
            const contract = new web3.eth.Contract(ABI, address)
            return contract
        }
    }

    // const ticketPromises = (numTicketTypes: any, currentProject: any) =>
    //     new Array(numTicketTypes)
    //         .fill(undefined)
    //         .map(async (item, index) => {
    //             // get the meta data
    //             const genTicket = web3Custom(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);
    //             const uri = await genTicket(currentProject?.ticketAddress).methods.uri(index).call()
    //             const ticketUrl = getGenTicketUrl(uri, index)
    //             const ticketMetaPromise = await getTicketMetadata(ticketUrl).catch(
    //                 (err: any) => {
    //                     console.error('[Inventory][handleFetchTicket]', err)
    //                     return {}
    //                 }
    //             )

    //             const ticketMeta = await ticketMetaPromise;

    //             let numTickets
    //             let ticketsPurchased
    //             let price

    //             try {
    //                 if (currentProject?.marketPlaceAddress !== undefined) {
    //                     [
    //                         numTickets,
    //                         ticketsPurchased,
    //                         // price
    //                     ] = await Promise.all([
    //                         genMarketPlace(currentProject?.marketPlaceAddress!).methods.numTicketsTransferable(index).call(),
    //                         genMarketPlace(currentProject?.marketPlaceAddress!).methods.ticketsPurchased(index).call(),
    //                         // genMarketPlace(currentProject?.marketPlaceAddress!).methods.prices(index).call(),
    //                     ])
    //                     try {
    //                         price = await Promise.resolve(genMarketPlace(currentProject?.marketPlaceAddress!).methods.prices(index).call())
    //                     } catch (err) {
    //                         price = 0
    //                     }
    //                     price = formatEther(price)

    //                 } else if (currentProject?.ticketData !== undefined) {
    //                     numTickets = currentProject?.ticketData[index].numTickets
    //                     ticketsPurchased = currentProject?.ticketData[index].ticketsPurchased
    //                     price = currentProject?.ticketData[index].price
    //                 } else {
    //                     numTickets = 0
    //                     ticketsPurchased = 0
    //                     price = 0
    //                 }

    //                 return {
    //                     index: index,
    //                     src: ticketMeta.image,
    //                     name: ticketMeta.name,
    //                     balance: '',
    //                     description: ticketMeta.description,
    //                     total: numTickets,
    //                     remain: '' + (parseInt(numTickets) - parseInt(ticketsPurchased)),
    //                     price: price,
    //                     currentProject: currentProject,
    //                 } as Card
    //             } catch (err) {
    //                 return {} as Card;
    //             }
    //     })

    const ticketPromises = async (item: any) => {
        // get the nft meta data

        let nftImage = ''
        let nftName = item?.nameOfNFT ?? ""
        let nftDescription = ''
        let nftAttributes = ''

        if (isRealValue(item?.nftMetaData)) {
            nftImage = resolveLink(item?.nftMetaData?.image)
            nftName = item?.nftMetaData?.name
            nftDescription = item?.nftMetaData?.description
            nftAttributes = item?.nftMetaData?.attributes
        } else if (item?.tokenURIOfNFT) {
            try {
                await fetch(item?.tokenURIOfNFT)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('datadata', data);
                        nftImage = resolveLink(data?.image ? data?.image : data?.image_url ? data?.image_url : '')
                        nftName = data?.name
                        nftDescription = data?.description
                        nftAttributes = data?.attributes
                    });
            } catch (error) {
                console.log('Failed to retried assets information from tokenURI');
            }
        }

        // const ticketUrl = item?.tokenURIOfNFT ?? ''
        // const ticketMetaPromise = await getTicketMetadata(ticketUrl).catch(
        //     (err: any) => {
        //         console.error('[GenNFT][getTicketMetadata]', err)
        //         return {}
        //     }
        // )

        // const ticketMeta = ticketMetaPromise;
        // console.log('ticketMeta', ticketUrl, ticketMeta, item);

        try {
            return {
                networkChainIdValue: item?.networkChainIdValue,
                networkChainName: item?.networkChainName,
                recordId: item?.recordId,
                nftBuyer: item?.nftBuyer,
                nftContract: item?.nftContract,
                nftState: item?.nftState,
                nftSeller: item?.nftSeller,
                nftTokenId: item?.nftTokenId,
                nftPrice: item?.nftPrice,
                numberOfNFTHolding: item?.numberOfNFTHolding,
                baseURIOfNFT: item?.baseURIOfNFT,
                nameOfNFT: nftName,
                nameOfNFTProject: item?.nameOfNFTProject,
                symbolOfNFT: item?.symbolOfNFT,
                symbolOfNFTProject: item?.symbolOfNFTProject,
                tokenURIOfNFT: item?.tokenURIOfNFT,
                nftContractType: item?.nftContractType,
                lastCreatedAtNFT: item?.lastCreatedAtNFT,
                lastUpdatedAtNFT: item?.lastUpdatedAtNFT,
                nftMetaData: item?.nftMetaDataJson,
                nftCollectionMetaData: item?.nftCollectionMetadata,
                nftMetaDataImageURL: nftImage, //ticketMeta?.image,
                nftMetaDataName: nftName, //ticketMeta?.name,
                nftMetaDataDescription: nftDescription, //ticketMeta?.description,
                nftAttributes: nftAttributes, //ticketMeta?.attributes,
                src: nftImage, //ticketMeta?.image,
                name: nftName,
                total: "0",
                remain: "0",
                balance: "0",
                description: nftDescription, //ticketMeta?.description,
                price: item?.nftPrice,
                index: item?.nftTokenId
            } as Card
        } catch (err) {
            return {} as Card;
        }
    }

    // const getTicketByProject = async (currentProject: any) => {
    //     const numTicketTypes = await getNumberOfTicketTypes(currentProject?.ticketAddress);
    //     const tickets = await Promise.all(ticketPromises(numTicketTypes, currentProject));
    //     return tickets;
    // }

    const fetchTickets = async () => {
        const allTickets = await Promise.all(data?.map(ticketPromises));
        setTickets(allTickets);
        setTicketsToDisplay(allTickets);

        // Older Code
        // const allTickets = await Promise.all(data?.map(getTicketByProject));

        // const filteredTickets = flatten(allTickets).filter((dataObj: any) =>
        //     Object.values(dataObj).length && dataObj?.remain !== '0'
        // );

        // setTickets(filteredTickets);
        // setTicketsToDisplay(filteredTickets);
    }

    const handleApplyfilter = (newFilters: object) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }

    useEffect(() => {
        if (filters) {
            console.log('filters', filters);
            const finalTicktes = tickets.filter((ticket) => {
                return Object.entries(filters).reduce((isTrue: boolean, [key, value]: any) => {
                    if (value === null) {
                        return isTrue;
                    }

                    if (key === 'minPrice') {
                        return isTrue && Number(get(ticket, 'price')) >= Number(value);
                    }

                    if (key === 'maxPrice') {
                        return isTrue && Number(get(ticket, 'price')) <= Number(value);
                    }

                    return isTrue && get(ticket, key) === value;
                }, true);
            });
            setTicketsToDisplay(finalTicktes);
        }
    }, [filters]);

    useEffect(() => {
        if (data?.length) {
            fetchTickets();
        } else {
            setTicketsToDisplay([]);
        }
    }, [data, refreshData]);

    const handleDataSort = (type: number) => {
        setTicketsToDisplay(type === 1 ? [...ticketsToDisplay.sort((a, b) => a.price - b.price)] : type === 2 ? [...ticketsToDisplay.sort((a, b) => b.price - a.price)] : [])
    }

    return (
        <div className="pages-wrapper">
            {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
            <SellingFilter
                network={network}
                collections={data}
                filters={filters}
                onApplyFilter={handleApplyfilter}
                setIsOpened={setIsOpened}
                isOpened={isOpened}
                setPriceRange={setPriceRange}
                winSize={winSize}
            />
            <SellingPlace
                // tickets={ticketsToDisplay.filter(({ total }) => total !== '0')}
                nftsData={nftsData} // genshards nfts
                tickets={ticketsToDisplay} // moralis nfts
                setIsOpened={setIsOpened}
                filters={filters}
                setIsLoading={setIsLoading}
                setRefreshData={setRefreshData}
                selectedSortBy={selectedSortBy}
                setSelectedSortBy={setSelectedSortBy}
                onSort={handleDataSort}
                infiniteLoader={infiniteLoader}
                totalNumberOfResults={totalNumberOfResults}
                getInitialFetchActiveItemsData={getInitialFetchActiveItemsData}
            />
        </div>
    )
}

// const ActivityPage = () => {
//     return (
//         <div className="pages-wrapper">
//             <SideBar />
//             <ActivityTable />
//         </div>
//     )
// }

const MarketPlace = () => {
    const [searchedText, setSearchedText] = useState("");
    const { path } = useRouteMatch()
    const { pathname } = useLocation()

    const getSearchText = (text: string) => {
        setSearchedText(text)
        console.log("getSearchText => ", text);

    }

    const isHideHeader = pathname === "/marketplace/cart"

    return (
        <div className="marketplace">
            {isHideHeader ? null : <MarketPlaceHeader getSearchText={getSearchText} />}
            <Switch>
                <Route exact path={`${path}`}>
                    <MarketPage />
                </Route>
                <Route exact path={`${path}/projects`}>
                    <CollectionPage searchedText={searchedText} />
                </Route>
                <Route exact path={`${path}/projects/project-detail`}>
                    <GardenofEden />
                </Route>
                <Route exact path={`${path}/cart`}>
                    <Cart />
                </Route>
            </Switch>
        </div>
    )
}

export default MarketPlace
