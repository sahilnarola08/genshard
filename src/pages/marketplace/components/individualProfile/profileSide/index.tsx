import assetImage from '../../../../../images/marketplace/Asset1.png'
import searchIcon from '../../../../../images/marketplace/SearchVector1.svg'
import copyIcon from '../../../../../images/marketplace/CopyVector.svg'
import LikeIcon from '../../../../../images/marketplace/Like.png'
import Hide from '../../../../../images/marketplace/HideVector.svg'
import Image from '../../../../../images/marketplace/you_belong_to_me_by_aquasixio-d799lr2 1.png'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useCopyClipboard from '../../../../../hooks/useCopyClipboard'
import { calculateGasMargin, getContract, shortenAddress, getScrollPercent, searchToObject } from '../../../../../utils'
import styled from 'styled-components'
import filterIcon from '../../../../../images/marketplace/Filter.png'
import { NavLink } from 'react-router-dom'
import { AppState } from '../../../../../state'
import { useDispatch, useSelector } from 'react-redux'
import { PROJECTS_DATA, PROJECTS_DATA_AVALANCHE, PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET, PROJECTS_DATA_BSC, PROJECTS_DATA_BSC_NETWORK_TESTNET, PROJECTS_DATA_HARMONY, PROJECTS_DATA_HARMONY_NETWORK_TESTNET, PROJECTS_DATA_IOTEX, PROJECTS_DATA_IOTEX_NETWORK_TESTNET, PROJECTS_DATA_MATIC, PROJECTS_DATA_MUMBAI, PROJECTS_DATA_GOERLI, MORALIS_API_SERVER_URL, MORALIST_API_KEY, GET_ALL_NFTS_DATA, apiBaseUrl } from '../../../../../constants'
import { useActiveWeb3React } from '../../../../../hooks/web3'
import ReactPlayer from 'react-player'
import { isVideoFormat } from '../../../../market/helper'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useGetNumberOfTicketTypes, useGetRedeemableToken, useGetTicketBalance, useGetTicketInfo, useGetVestingData } from '../../../../../state/ticket/hooks'
import { useWeb3Contract } from '../../../../../hooks/useContract'

import downArrow from '../../../../../images/marketplace/downArrow.svg'
import { abi as GEN_TICKET_ABI } from '../../../../../contracts/GenTickets.json'
import { abi as GEN_TICKET_ABI_v1 } from '../../../../../contracts/GenTickets_v1.json'
import { getTicketMetadata } from '../../../../../utils/genTicketMetadata'
import { getGenTicketUrl } from '../../../../dashboard/dashboard.helpers'
import { InventoryTicketDto, ITicketVestingData } from '../../../../dashboard/components/inventory/types'
import _ from 'lodash'
import Web3 from 'web3'
import { NetworkChainId, NetworkURL } from '../../../../../connectors'
import { formatEther } from 'ethers/lib/utils'
// import Pagination from '../../../../../shared/components/Pagination'
import PaginationComp from './pagination'
import { abi as GEN_MARKETPLACE_ABI } from '../../../../../contracts/GenMarketPlace.json';
import { useIPFS } from '../../../../../hooks/useIPFS'
// import { useMoralisWeb3Api } from "react-moralis";
import { Card } from '../../../../../state/market/types'

import './style.sass'
import axios from 'axios'
import { IUserNFT } from '../../..'
import { sellingDropdown } from '../../collectionPage'
import { useTokenLikes } from '../../../../../hooks/tokens'

export const Tooltip = styled('div')({
  backgroundColor: '#fff',
  color: '#111',
  position: 'absolute',
  top: '-35px',
  right: '-30px',
  letterSpacing: '0.1em',
  fontSize: '16px',
  padding: '6px 10px',
  '&:after': {
    content: "''",
    position: 'absolute',
    width: '0',
    height: '0',
    border: '5px solid transparent',
    borderTopColor: '#fff',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  '@media(max-width: 480px)': {
    right: '-15px',
  },
})

const CardContainer = (currentProject: any, setAllProjectData: any, setInfiniteLoader: any): any => {

  const { resolveLink } = useIPFS();
  const itemsLimit = 50
  const itemLoadingRef = useRef(false)
  const totalItemsRef = useRef(0)
  const fetchedTotalItemsRef = useRef(0)
  const nextCursor = useRef(undefined)

  // const moralistAPIKeySandBox = process.env.REACT_APP_MORALIS_API_KEY_TEST;
  // const moralistAPIKeyProduction = 
  const genMarketPlace = useWeb3Contract(GEN_MARKETPLACE_ABI)
  // const getTicketBalance = useGetTicketBalance(currentProject)
  // const getTicketInfo = useGetTicketInfo(currentProject)
  // const getNumberOfTicketTypes = useGetNumberOfTicketTypes(currentProject)
  // const getVestingData = useGetVestingData(currentProject)
  // const getRedeemableToken = useGetRedeemableToken(currentProject)
  const { account } = useActiveWeb3React()
  const network = useSelector((state: AppState) => state.application.network)
  // const Web3Api = useMoralisWeb3Api();
  const [data, setData] = useState<any[]>([])
  const [totalNumberOfResults, setTotalNumberOfResults] = useState(0)
  const { getTokenLikes } = useTokenLikes()
  let apiResponseData: any = {} //[apiResponseData, setApiResponseData] = useState<any>([])

  const isRealValue = (obj: any) => {
    return obj && obj !== 'null' && obj !== 'undefined';
  }

  const web3Custom = (ABI: any) => {
    return (address: string) => {
      let web3 = new Web3(NetworkURL[network])
      const contract = new web3.eth.Contract(ABI, address)
      return contract
    }
  }

  // const fetchMoreData = () => {
  //   setTimeout(() => {
  //     if(apiResponseData.cursor){
  //       handleFetchTicket(apiResponseData.cursor)
  //     }
  //   }, 1500);
  // };

  const handleScroll = () => {
    console.log("scrolled", nextCursor.current, getScrollPercent(), itemLoadingRef.current, totalItemsRef.current, fetchedTotalItemsRef.current)
    if (nextCursor.current && getScrollPercent() > 85 && !itemLoadingRef.current && totalItemsRef.current > fetchedTotalItemsRef.current) {
      console.log("scrolled above 85% of the page loading next items Wallet Page")
      itemLoadingRef.current = true
      setInfiniteLoader(prev => !prev)
      handleFetchTicket(nextCursor.current)
    }
    else {
      setInfiniteLoader(false)
    }
  }

  // const handleScroll = () => {
  //   console.log("setTotalNumberOfResults", totalNumberOfResults, data.length, window.innerHeight + document.documentElement.scrollTop, document.documentElement.offsetHeight);

  //   if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight && (totalNumberOfResults == data.length))
  //   { 
  //     return; 
  //   }
  //   console.log('Fetch more list items!');
  //   fetchMoreData()
  // }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, totalNumberOfResults]);

  // const genTicket = web3Custom(currentProject?.projectDuration! === 'New' ? GEN_TICKET_ABI : GEN_TICKET_ABI_v1);

  useEffect(() => {
    onFetchInitialData()
  }, [network, account!])

  useEffect(() => {
    if (data?.length) {
      fetchTickets();
    } else {
      setAllProjectData([]);
    }
  }, [data]);

  const onFetchInitialData = () => {
    setData([])
    nextCursor.current = undefined
    fetchedTotalItemsRef.current = 0
    totalItemsRef.current = 0
    handleFetchTicket(undefined)
  }

  const handleFetchTicket = async (cursorValue?: string) => {

    // New Code - MoralisProvider
    try {
      // get NFTs for address
      const chainIdOfAPICallBack = NetworkChainId[network]
      const networkName = (network === 'MATIC' ? 'matic' : network === 'MUMBAI' ? 'matic testnet' : network === 'BSC' ? 'bsc' : network === 'T-BSC' ? 'bsc testnet' : network === 'GOERLI' ? 'goerli' : network === 'T-IoTeX' ? 'iotx testnet' : network === 'IOTEX' ? 'iotx' : network === 'T-HRMNY' ? 'one testnet' : network === 'HARMONY' ? 'one' : network === 'T-AVALANCHE' ? 'avalanche testnet' : network === 'AVALANCHE' ? 'avalanche' : String(network).toLowerCase())
      // const options = {
      //   chain: networkName,
      //   address: account!,
      //   limit: 50,
      //   cursor: cursorValue ? cursorValue : null
      // };
      // const MORALIS_API_SERVER_URL = process.env.REACT_APP_MORALIS_API_SERVER_URL
      // const MORALIST_API_KEY_SANDBOX = process.env.REACT_APP_MORALIS_API_KEY_TEST;
      // const MORALIST_API_KEY_PRODUCTION = process.env.REACT_APP_MORALIS_API_KEY_PROD;

      const options = {
        method: 'GET',
        url: `${MORALIS_API_SERVER_URL}/${account!}/nft`,
        params: { chain: networkName, format: 'decimal', limit: itemsLimit, cursor: cursorValue ? cursorValue : null },
        headers: { accept: 'application/json', 'X-API-Key': MORALIST_API_KEY }
      };
      console.log("OwnNFTDataArray options", options);
      await axios
        .request(options as any)
        .then(async function (response) {
          console.log("OwnNFTDataArray RES", response.data);

          const NFTDataArray = await response.data //await Web3Api.account.getNFTs(options as any);
          console.log("OwnNFTDataArray", NFTDataArray);
          apiResponseData = NFTDataArray
          setTotalNumberOfResults(Number(NFTDataArray?.total))
          const fetchActiveItemsDetails = NFTDataArray?.result
          nextCursor.current = NFTDataArray.cursor
          totalItemsRef.current = NFTDataArray.total

          const fetchActiveItemsObjArray = fetchActiveItemsDetails && fetchActiveItemsDetails?.map(async (nftItem: any, index: number) => {

            // console.log("Data", item);

            //Get metadata for one nft.
            // const nft_collection_metadata_options = {
            //   chain: networkName,
            //   address: nftItem?.token_address
            // };
            const nftCollectionMetadata = {} //await Web3Api.token.getNFTMetadata(nft_collection_metadata_options as any);
            // console.log("nftCollectionMetadata", nftCollectionMetadata);

            const nftMetaDataJson = JSON.parse(nftItem?.metadata)

            const balanceOfNFT = Number(nftItem?.amount) ?? 0
            const baseURIOfNFT = ''
            const nameOfNFT = nftMetaDataJson?.name ?? ''
            const nameOfNFTProject = '' //nftCollectionMetadata?.name ?? ''
            const symbolOfNFT = nftMetaDataJson?.symbol ?? ''
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
              nftSeller: nftItem?.owner_of ?? "",
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
              networkChainName: networkName,
              networkChainIdValue: chainIdOfAPICallBack,
              nftCollectionMetaData: nftCollectionMetadata,
              nftImage: ''
            };

          }) || []
          const fetchActiveItemsDataArray = await Promise.all(fetchActiveItemsObjArray)
          console.log('fetchActiveItemsDataArray', fetchActiveItemsDataArray);
          setData((prev: any) => [...prev, ...fetchActiveItemsDataArray])
          fetchedTotalItemsRef.current = fetchedTotalItemsRef.current + fetchActiveItemsDataArray.length
          if (itemLoadingRef.current) setInfiniteLoader(prev => !prev)
          itemLoadingRef.current = false
        })
        .catch(function (error) {
          itemLoadingRef.current = false
          setInfiniteLoader(prev => !prev)
          console.error("OwnNFTDataArray ERR", error);
        });

    } catch (error) {
      itemLoadingRef.current = false
      setInfiniteLoader(prev => !prev)
      console.log("Failed to Load Owned NFT Error", error);
    }

    // Older Code to Load Genshards NFT

    // let ticketsFinal: any = [];
    // try {
    //   const numTicketTypes = await getNumberOfTicketTypes();

    //   if (currentProject !== undefined && account !== undefined) {
    //     const [vestData, tge] = await Promise.all([
    //       getVestingData(0, currentProject?.projectDuration!),
    //       genTicket(currentProject!.ticketAddress).methods.TGE().call()
    //     ])

    //     const totalTix = numTicketTypes * (Number(vestData?.totalTranches!) + 1);
    //     const uris = await Promise.all(_.map(_.range(0, numTicketTypes), (i) => genTicket(currentProject!.ticketAddress).methods.uri(i).call()))
    //     const prices = await Promise.all(_.map(_.range(0, numTicketTypes), (i) => genMarketPlace(currentProject!.marketPlaceAddress).methods.prices(i).call()))

    //     const ticketMetas = await Promise.all(_.map(_.range(0, numTicketTypes), (i) => getTicketMetadata(getGenTicketUrl(uris[i], i)).catch(
    //       (err) => {
    //         console.error('[Inventory][handleFetchTicket]', err)
    //         return {}
    //       }
    //     )
    //     ))

    //     const balances = await Promise.all(_.map(_.range(0, totalTix), (i) => getTicketBalance(i)))
    //     const remainingTix = _.filter(_.range(0, totalTix), (i) => balances[i] !== 0)
    //     const ticketPromises = new Array(remainingTix.length)
    //       .fill(undefined)
    //       .map(async (item, index) => {
    //         try {
    //           const balance = balances[remainingTix[index]]

    //           if (parseInt(balance) === 0) {
    //             return
    //           }

    //           const [
    //             vestingData,
    //             redeemableToken,
    //             price
    //           ] = await Promise.all([
    //             getVestingData(remainingTix[index], currentProject?.projectDuration!),
    //             getRedeemableToken(remainingTix[index], currentProject?.projectDuration!),
    //             formatEther(prices[index % numTicketTypes])
    //           ])

    //           return new InventoryTicketDto(
    //             ticketMetas[index % numTicketTypes],
    //             balance,
    //             vestingData,
    //             redeemableToken,
    //             index,
    //             price
    //           )
    //         } catch (error) {
    //           return;
    //         }
    //       })

    //     ticketsFinal = await Promise.all(ticketPromises)
    //     ticketsFinal = _.without(ticketsFinal, undefined)

    //     setAllProjectData((prev: any) => [...prev, ...ticketsFinal?.flat()])
    //   }
    // } catch (err) {
    //   console.log("error occured", err);
    // }

  } //[getTicketBalance, getTicketInfo, getRedeemableToken, network]

  const ticketPromises = async (item: any) => {
    // get the nft meta data

    let nftImage = ''
    let nftName = item?.nameOfNFT ?? ""
    let nftDescription = ''
    let nftAttributes = ''
    console.log("item", item);
    if (isRealValue(item?.nftMetaData)) {
      console.log("PPPPPP2", item?.nftMetaData);
      nftImage = resolveLink(item?.nftMetaData?.image)
      nftName = item?.nftMetaData?.name
      nftDescription = item?.nftMetaData?.description
      nftAttributes = item?.nftMetaData?.attributes
    } else if (item?.tokenURIOfNFT) {
      try {
        await fetch(item?.tokenURIOfNFT)
          .then((response) => response.json())
          .then((data) => {
            console.log("PPPPPP1111", data);
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
        networkChainIdValue: item?.networkChainId,
        networkChainName: item?.networkChainName,
        index: item?.nftTokenId
      } as Card
    } catch (err) {
      return {} as Card;
    }
  }

  const fetchTickets = async () => {
    console.log('allTickets11', data);
    const allTickets = await Promise.all(data?.map(ticketPromises));
    console.log('allTickets', allTickets);
    setAllProjectData(allTickets);
    const tokens = allTickets.map((item: any) => ({ tokenAddress: item.nftContract, tokenId: item.nftTokenId }))
    getTokenLikes(tokens)
  }
}

const ProfileSide = () => {

  const [isCopied, setCopied] = useCopyClipboard()
  const [infiniteLoader, setInfiniteLoader] = useState(false)
  const [nftsData, setNftsData] = useState<IUserNFT[]>([])

  const [allProjectData, setAllProjectData] = useState<any>([])
  const [selectedSortBy, setSelectedSortBy] = useState(sellingDropdown[0] && sellingDropdown[0].value)
  const [priceRange, setPriceRange] = useState<string>("")
  // const [page, setPage] = useState(1);

  const history = useHistory()
  // const { path } = useRouteMatch()
  // console.log("path ------- ", path);

  const locationSearch = searchToObject(window.location.search || "")
  const { type = "" } = locationSearch as any
  const network = useSelector((state: AppState) => state.application.network)
  const accessToken = useSelector((state: AppState) => state.user.access_token)
  const nftUserStats = useSelector((state: AppState) => state.user.nftUserStats)
  const tokenLikes = useSelector((state: AppState) => state.token.tokenLikes)

  const data = network == 'BSC' ? PROJECTS_DATA_BSC : network == 'MATIC' ? PROJECTS_DATA_MATIC : network == 'IOTEX' ? PROJECTS_DATA_IOTEX : network == 'HARMONY' ? PROJECTS_DATA_HARMONY : network == 'AVALANCHE' ? PROJECTS_DATA_AVALANCHE : network == 'GOERLI' ? PROJECTS_DATA_GOERLI : network == 'MUMBAI' ? PROJECTS_DATA_MUMBAI : network == 'T-IoTeX' ? PROJECTS_DATA_IOTEX_NETWORK_TESTNET : network == 'T-HRMNY' ? PROJECTS_DATA_HARMONY_NETWORK_TESTNET : network == 'T-AVALANCHE' ? PROJECTS_DATA_AVALANCHE_NETWORK_TESTNET : network == 'T-BSC' ? PROJECTS_DATA_BSC_NETWORK_TESTNET : PROJECTS_DATA
  const { account, chainId } = useActiveWeb3React()
  const { getTokenLikes } = useTokenLikes()

  useEffect(() => {
    if (account && chainId && accessToken && type) {
      const [minPrice = 0, maxPrice = 0] = priceRange.split("_")
      if (type === "my_nfts") {
        axios.get(GET_ALL_NFTS_DATA.concat(`/${account}`).concat(`?chainId=${chainId}`), { params: { sortBy: selectedSortBy, minPrice, maxPrice } }).then(({ data }) => {
          console.log("my_nftsmy_nfts", data);
          
          setNftsData(data.values || [])
          const tokens = data.values.map((item: IUserNFT) => ({ tokenAddress: item.tokenAddress, tokenId: item.tokenId }))
          getTokenLikes(tokens)
        })
      } else if (type === "liked_nfts") {
        axios.get(`${apiBaseUrl}/api/v1/marketplace/user/liked_nfts/chain_id/${chainId}`, { headers: { authorization: `Bearer ${accessToken}` } }).then(({ data }) => {
          setNftsData(data.values || [])
          const tokens = data.values.map((item: IUserNFT) => ({ tokenAddress: item.tokenAddress, tokenId: item.tokenId }))
          getTokenLikes(tokens)
        })
      }
    }
  }, [account && accessToken, chainId, type])

  const myItems = [
    {
      name: 'COLLECTED',
      count: nftUserStats.totalAllNfts,
      to: "/profile-detail"
    },
    {
      name: 'CREATED',
      count: nftUserStats.totalNfts,
      to: "/profile-detail?type=my_nfts"
    },
    {
      name: 'FAVORITED',
      count: nftUserStats.totalLikedNfts,
      to: "/profile-detail?type=liked_nfts"
    },
    // {
    //     name: 'HIDDEN',
    //     count: '56'
    // }
  ];

  const accounts = [
    {
      name: 'ACTIVITY',
      to: 'activity',
    },
    {
      name: 'OFFERS RECEIVED',
      to: 'offersReceived',
    },
    {
      name: 'OFFERS MADE',
      to: 'offersMade',
    },
  ]

  const getOwnedNFTCallBack = async () => {
    console.log(await CardContainer(null, setAllProjectData, setInfiniteLoader))
  };

  getOwnedNFTCallBack();

  // data?.forEach(async (val) => {
  //   await CardContainer(val, setAllProjectData)
  // })

  const selectedSortByValue = sellingDropdown.find(item => item.value === selectedSortBy)

  return (
    <div className="profileSide">
      <div className="mainProfile">
        <div className="profileImageAndSidebar">
          <div className="profilePic">
            <img src={assetImage} alt="profile check" />
          </div>
          <div className="myItemsSide">
            <div className="myItems">
              <h3>MY ITEMS</h3>
              <hr />
              {myItems?.map((items) => (
                <div className="nameAndCount">
                  <div className="itemsName">{items?.name}</div>
                  <div className="itemsCount">{items?.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profileDetail">
          <h3>Unnamed</h3>
          <p id="orofileSubText">
            <span>{account}</span>
            <img
              src={copyIcon}
              alt="vector"
              onClick={() => setCopied(account ?? '')}
            />
            {isCopied && (
              <Tooltip role="tooltip" aria-describedby="copied text">
                Copied!
              </Tooltip>
            )}
          </p>
          {/* <p id="profileWebsite">www.jackdoe.com</p> */}
        </div>
        <div className="accounts">
          {accounts?.map((account, index) => (
            <li key={index}>
              <NavLink
                className="accountName"
                activeClassName="active-link"
                exact
                to={`${account.to}`}
                title={account.name}
              >
                {account.name}
              </NavLink>
            </li>
          ))}
        </div>
      </div>

      <div className="card-container">
        <div className="collectionSearchAndSelling">
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search your collection"
              name="searchCollection"
            ></input>
            <img src={searchIcon} alt="search" />
          </div>
          <div className="sortAndFilter">
            <div className="filter_icon">
              <div className="filter">FILTERS</div>
              <img src={filterIcon} alt="filter icon" />
            </div>

            <div className="sort">
              <div className="select_selling">
                <select
                  name="best selling"
                  id="best_selling"
                  className="currency"
                  value={selectedSortByValue?.value || ""}
                  onChange={(e) => setSelectedSortBy(e.target.value)}
                >
                  <option value="test" style={{ display: 'none' }}>Default</option>
                  {sellingDropdown.map((sellingData) => {
                    return (
                      <option value={sellingData.value}>{sellingData.label}</option>
                    )
                  })}
                </select>
                {/* <div className="dropdown_arrow">
                <img src={downArrow} alt="" />
              </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="garenCards row">
          {(type && nftsData.length) ?
            <>{
              nftsData?.map((currentProject) => {
                const videoFormat = isVideoFormat(currentProject?.nft.nftAsset)
                const totalLikes = tokenLikes && tokenLikes[`${String(currentProject.tokenAddress).toLowerCase()}_${currentProject.tokenId}`] || 0
                return (
                  <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-4 col-6">
                    <div className="px-2 py-3">
                      <div
                        className="garen"
                        onClick={() => { history.push(`/assets/${currentProject?.tokenAddress}/${currentProject?.tokenId}`, currentProject); console.log("garen current project => ", currentProject); }}
                      >
                        <div className="garen_img">
                          {
                            videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={currentProject?.nft.nftAsset} loop={false} />
                              : <img src={currentProject?.nft?.nftAsset && currentProject?.nft?.nftAsset !== '' && currentProject?.nft?.nftAsset.split('.').pop() !== "svg+xml" ? currentProject?.nft?.nftAsset : `/images/noimageavailable.png`} alt="" loading="lazy" />
                          }
                          <div className="heart">
                            <div className="heart_img">
                              <img src={LikeIcon} alt="Heart" />
                            </div>
                            <div className="heartNum">{totalLikes}</div>
                          </div>
                        </div>
                        <div className="silver_section">
                          <div className="silver_lake">
                            <p className="lake">{`${shortenAddress(currentProject?.tokenAddress)}`}</p>
                            {/* <p className="price">
                              PRICE <span>{currentProject?.listingPrice} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</span>
                            </p> */}
                          </div>
                          <div className="eden">
                            <p className="eden_text">{currentProject?.nft.name ? currentProject?.nft.name : ""}</p>
                            {/* <p className="edenHide">
                              <img src={Hide} alt="hide img" /> Hide
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {infiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
            </>
            :
            type ? <div style={{ color: 'black', textAlign: 'center', height: '100%' }} className="no-data-found" >No Projects Available!</div> : null
          }
          {(!type && allProjectData.length) ?
            <>{
              allProjectData?.map((currentProject: any) => {
                const videoFormat = isVideoFormat(currentProject?.nftMetaDataImageURL)


                return (
                  <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-4 col-6">
                    <div className="px-2 py-3">
                      <div
                        className="garen"
                        onClick={() => { history.push(`/assets/${currentProject?.nftContract}/${currentProject?.nftTokenId}`, currentProject); console.log("garen current project => ", currentProject); }}
                      >
                        <div className="garen_img">
                          {
                            videoFormat ? <ReactPlayer className="card-player" width={'100%'} height={'100%'} playing={false} muted={true} url={currentProject?.nftMetaDataImageURL} loop={false} />
                              : <img src={currentProject?.nftMetaDataImageURL && currentProject?.nftMetaDataImageURL !== '' ? currentProject?.nftMetaDataImageURL : `/images/no_image_available.jpeg`} alt="" loading="lazy" />
                          }
                          <div className="heart">
                            <div className="heart_img">
                              <img src={LikeIcon} alt="Heart" />
                            </div>
                            <div className="heartNum">{currentProject?.numberOfNFTHolding ?? 0}</div>
                          </div>
                        </div>
                        <div className="silver_section">
                          <div className="silver_lake">
                            <p className="lake">{`${shortenAddress(currentProject?.nftContract)}`}</p>
                            {/* <p className="price">
                              PRICE <span>{currentProject?.price} {(network === 'BSC' || network === 'T-BSC' ? 'WBNB' : network === 'GOERLI' ? 'WETH' : network === 'T-IoTeX' || network === 'IOTEX' ? 'WIOTX' : network === 'T-HRMNY' || network === 'HARMONY' ? 'WONE' : network === 'T-AVALANCHE' || network === 'AVALANCHE' ? 'WAVAX' : "W" + String(network).toUpperCase())}</span>
                            </p> */}
                          </div>
                          <div className="eden">
                            <p className="eden_text">{currentProject?.name ? currentProject?.name : (currentProject?.numberOfNFTHolding ?? 0)}</p>
                            {/* <p className="edenHide">
                              <img src={Hide} alt="hide img" /> Hide
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {infiniteLoader ? <div style={{ color: "white", height: 100, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 40 }}>Loading more items.....</div> : null}
            </>
            :
            !type ? <div style={{ color: 'black', textAlign: 'center', height: '100%' }} className="no-data-found" >No Projects Available!</div> : null
          }
        </div>
      </div>
    </div>
  )
}

export default ProfileSide
